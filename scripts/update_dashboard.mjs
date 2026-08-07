import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const usage = `
Add an unpaid dashboard entry and optionally publish it to the saved Gist.

Examples:
  npm run dashboard:add -- --date 08.08 --task "Secret Mosque edit" --start 11:30am --end 1am --publish
  npm run dashboard:add -- --date 09.08 --task "Research" --hours 4.5 --publish

Required:
  --date DD.MM             Work date
  --task TEXT              Task description
  --hours NUMBER           Decimal hours, or use --start and --end
  --start TIME --end TIME  Times such as 11:30am, 1am, or 23:00; an earlier end means next day

Optional:
  --year YYYY              Defaults to the current year
  --hourly-rate NUMBER     Defaults to dashboard.config.json
  --publish                Update the configured GitHub Gist after editing
  --dry-run                Validate and print the result without writing or publishing
  --dashboard PATH         Override the configured dashboard file
  --help                   Show this help
`;

const parseArgs = (argv) => {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument: ${token}`);
    }
    const key = token.slice(2);
    if (['publish', 'dry-run', 'help'].includes(key)) {
      args[key] = true;
      continue;
    }
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }
    args[key] = value;
    i += 1;
  }
  return args;
};

export const parseTime = (value) => {
  const normalized = String(value).trim().toLowerCase().replace(/\s+/g, '');
  const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)?$/);
  if (!match) {
    throw new Error(`Invalid time "${value}". Use a value such as 11:30am, 1am, or 23:00.`);
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const meridiem = match[3];
  if (minute > 59) throw new Error(`Invalid minutes in time "${value}".`);

  if (meridiem) {
    if (hour < 1 || hour > 12) throw new Error(`Invalid 12-hour time "${value}".`);
    if (hour === 12) hour = 0;
    if (meridiem === 'pm') hour += 12;
  } else if (hour > 23) {
    throw new Error(`Invalid 24-hour time "${value}".`);
  }

  return hour * 60 + minute;
};

export const calculateMinutes = ({hours, start, end}) => {
  if (hours !== undefined) {
    const numericHours = Number(hours);
    if (!Number.isFinite(numericHours) || numericHours <= 0) {
      throw new Error('--hours must be a positive number.');
    }
    const minutes = Math.round(numericHours * 60);
    if (Math.abs(minutes / 60 - numericHours) > 0.000001) {
      throw new Error('--hours must resolve to whole minutes.');
    }
    return minutes;
  }

  if (!start || !end) {
    throw new Error('Provide either --hours or both --start and --end.');
  }
  const startMinutes = parseTime(start);
  let endMinutes = parseTime(end);
  if (endMinutes <= startMinutes) endMinutes += 24 * 60;
  return endMinutes - startMinutes;
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${remainder} min`;
  if (remainder === 0) return `${hours} h`;
  return `${hours} h ${remainder} min`;
};

export const calculatePayment = (minutes, hourlyRate) => {
  const hourlyRateInCents = Math.round(hourlyRate * 100);
  return Math.round((minutes * hourlyRateInCents) / 60) / 100;
};

const findMatchingBracket = (source, openIndex, openChar = '[', closeChar = ']') => {
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = openIndex; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '/' && next === '/') {
      lineComment = true;
      i += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      blockComment = true;
      i += 1;
      continue;
    }
    if (['"', "'", '`'].includes(char)) {
      quote = char;
      continue;
    }
    if (char === openChar) depth += 1;
    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  throw new Error(`Could not find closing ${closeChar}.`);
};

const lineIndentAt = (source, index) => {
  const lineStart = source.lastIndexOf('\n', index - 1) + 1;
  return source.slice(lineStart, index).match(/^\s*/)?.[0] ?? '';
};

const insertIntoArray = (source, arrayStart, arrayEnd, item, itemIndent, newline) => {
  const inner = source.slice(arrayStart + 1, arrayEnd);
  const closingIndent = lineIndentAt(source, arrayEnd);
  let replacement;

  if (inner.trim() === '') {
    replacement = `${newline}${itemIndent}${item}${newline}${closingIndent}`;
  } else {
    let existing = inner.trimEnd();
    if (!existing.endsWith(',')) existing += ',';
    replacement = `${existing}${newline}${itemIndent}${item}${newline}${closingIndent}`;
  }

  return source.slice(0, arrayStart + 1) + replacement + source.slice(arrayEnd);
};

export const calculatePendingTotal = (source) => {
  const progressMarker = 'const inProgress =';
  const progressMarkerIndex = source.indexOf(progressMarker);
  if (progressMarkerIndex < 0) throw new Error('Could not find the inProgress array.');
  const progressStart = source.indexOf('[', progressMarkerIndex + progressMarker.length);
  const progressEnd = findMatchingBracket(source, progressStart);
  const progressSource = source.slice(progressStart + 1, progressEnd);
  const rates = [...progressSource.matchAll(/\brate:\s*(-?\d+(?:\.\d+)?)/g)];
  const total = rates.reduce((sum, match) => sum + Number(match[1]), 0);
  return Math.round(total * 100 + Number.EPSILON) / 100;
};

export const updateDashboardSource = (source, entry) => {
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const progressMarker = 'const inProgress =';
  const progressMarkerIndex = source.indexOf(progressMarker);
  if (progressMarkerIndex < 0) throw new Error('Could not find the inProgress array.');

  const progressStart = source.indexOf('[', progressMarkerIndex + progressMarker.length);
  const progressEnd = findMatchingBracket(source, progressStart);
  const progressSource = source.slice(progressStart + 1, progressEnd);
  const monthToken = `month: ${JSON.stringify(entry.month)}`;
  const monthRelativeIndex = progressSource.indexOf(monthToken);
  const entryText = `{ date: ${JSON.stringify(entry.date)}, task: ${JSON.stringify(entry.task)}, duration: ${JSON.stringify(entry.duration)}, rate: ${entry.payment.toFixed(2)} }`;

  let updated = source;
  if (monthRelativeIndex >= 0) {
    const monthIndex = progressStart + 1 + monthRelativeIndex;
    const tasksMarkerIndex = source.indexOf('tasks:', monthIndex);
    if (tasksMarkerIndex < 0 || tasksMarkerIndex > progressEnd) {
      throw new Error(`Could not find the tasks array for ${entry.month}.`);
    }
    const tasksStart = source.indexOf('[', tasksMarkerIndex);
    const tasksEnd = findMatchingBracket(source, tasksStart);
    const tasksSource = source.slice(tasksStart + 1, tasksEnd);
    const duplicateNeedle = `{ date: ${JSON.stringify(entry.date)}, task: ${JSON.stringify(entry.task)},`;
    if (tasksSource.includes(duplicateNeedle)) {
      throw new Error(`Duplicate entry: ${entry.date} — ${entry.task}`);
    }
    const closingIndent = lineIndentAt(source, tasksEnd);
    updated = insertIntoArray(source, tasksStart, tasksEnd, entryText, `${closingIndent}  `, newline);
  } else {
    const monthBlock = `{${newline}    month: ${JSON.stringify(entry.month)},${newline}    tasks: [${newline}      ${entryText}${newline}    ]${newline}  }`;
    const closingIndent = lineIndentAt(source, progressEnd);
    updated = insertIntoArray(source, progressStart, progressEnd, monthBlock, `${closingIndent}  `, newline);
  }

  const footerPattern = /<div class="footer">Updated [^<]+<\/div>/;
  if (!footerPattern.test(updated)) throw new Error('Could not find the dashboard update footer.');
  updated = updated.replace(
    footerPattern,
    `<div class="footer">Updated ${entry.month}</div>`,
  );

  const versionMatch = updated.match(/const DATA_VERSION = (\d+);/);
  if (!versionMatch) throw new Error('Could not find DATA_VERSION.');
  const nextVersion = Number(versionMatch[1]) + 1;
  updated = updated.replace(/const DATA_VERSION = \d+;/, `const DATA_VERSION = ${nextVersion};`);

  return {source: updated, dataVersion: nextVersion};
};

const normalizeDate = (value, year) => {
  const match = String(value).trim().match(/^(\d{1,2})[.\/-](\d{1,2})(?:[.\/-](\d{4}))?$/);
  if (!match) throw new Error('--date must use DD.MM or DD.MM.YYYY.');
  const day = Number(match[1]);
  const month = Number(match[2]);
  const resolvedYear = Number(match[3] ?? year);
  const candidate = new Date(Date.UTC(resolvedYear, month - 1, day));
  if (
    candidate.getUTCFullYear() !== resolvedYear ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    throw new Error(`Invalid date: ${value}`);
  }
  return {
    date: `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}`,
    month: `${MONTHS[month - 1]} ${resolvedYear}`,
  };
};

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage.trimStart());
    return;
  }

  const configPath = resolve(process.cwd(), 'dashboard.config.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (!args.date) throw new Error('--date is required.');
  if (!args.task?.trim()) throw new Error('--task is required.');

  const year = Number(args.year ?? new Date().getFullYear());
  const {date, month} = normalizeDate(args.date, year);
  const minutes = calculateMinutes({hours: args.hours, start: args.start, end: args.end});
  const hourlyRate = Number(args['hourly-rate'] ?? config.hourlyRate);
  if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
    throw new Error('The hourly rate must be a positive number.');
  }
  const duration = formatDuration(minutes);
  const payment = calculatePayment(minutes, hourlyRate);
  const dashboardPath = resolve(process.cwd(), args.dashboard ?? config.dashboardFile);
  const original = readFileSync(dashboardPath, 'utf8');
  const result = updateDashboardSource(original, {
    date,
    month,
    task: args.task.trim(),
    duration,
    payment,
  });
  const pendingTotal = calculatePendingTotal(result.source);

  if (!args['dry-run']) {
    writeFileSync(dashboardPath, result.source, 'utf8');
  }

  let publishedUrl = null;
  if (args.publish && !args['dry-run']) {
    const payload = JSON.stringify({files: {'dashboard.html': {content: result.source}}});
    publishedUrl = execFileSync(
      'gh',
      ['api', '--method', 'PATCH', `/gists/${config.gistId}`, '--input', '-', '--jq', '.html_url'],
      {encoding: 'utf8', input: payload},
    ).trim();
  }

  process.stdout.write(
    JSON.stringify(
      {
        date,
        month,
        task: args.task.trim(),
        duration,
        hourlyRate,
        payment,
        pendingTotal,
        dataVersion: result.dataVersion,
        dryRun: Boolean(args['dry-run']),
        publishedUrl,
      },
      null,
      2,
    ) + '\n',
  );
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isDirectRun) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`Dashboard update failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
