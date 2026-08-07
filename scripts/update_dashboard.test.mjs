import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateMinutes,
  calculatePendingTotal,
  calculatePayment,
  formatDuration,
  parseTime,
  updateDashboardSource,
} from './update_dashboard.mjs';

const fixture = `<!doctype html>
<div class="footer">Updated July 2026</div>
<script>
const inProgress = [];
const DATA_VERSION = 10;
</script>`;

test('calculates an overnight work session', () => {
  assert.equal(parseTime('11:30am'), 690);
  assert.equal(parseTime('1am'), 60);
  const minutes = calculateMinutes({start: '11:30am', end: '1am'});
  assert.equal(minutes, 810);
  assert.equal(formatDuration(minutes), '13 h 30 min');
  assert.equal(calculatePayment(minutes, 5.75), 77.63);
});

test('adds a new pending month and bumps the data version', () => {
  const result = updateDashboardSource(fixture, {
    date: '08.08',
    month: 'August 2026',
    task: 'Secret Mosque project',
    duration: '13 h 30 min',
    payment: 77.63,
  });

  assert.match(result.source, /month: "August 2026"/);
  assert.match(result.source, /date: "08\.08"/);
  assert.match(result.source, /rate: 77\.63/);
  assert.match(result.source, /Updated August 2026/);
  assert.match(result.source, /const DATA_VERSION = 11;/);
  assert.equal(calculatePendingTotal(result.source), 77.63);
});

test('appends to an existing month and rejects an exact duplicate', () => {
  const first = updateDashboardSource(fixture, {
    date: '08.08',
    month: 'August 2026',
    task: 'Secret Mosque project',
    duration: '13 h 30 min',
    payment: 77.63,
  });
  const second = updateDashboardSource(first.source, {
    date: '09.08',
    month: 'August 2026',
    task: 'Research',
    duration: '1 h',
    payment: 5.75,
  });
  const sameDateAndTaskSeparately = updateDashboardSource(second.source, {
    date: '08.08',
    month: 'August 2026',
    task: 'Research',
    duration: '1 h',
    payment: 5.75,
  });

  assert.match(second.source, /08\.08[\s\S]+09\.08/);
  assert.equal(calculatePendingTotal(second.source), 83.38);
  assert.equal(calculatePendingTotal(sameDateAndTaskSeparately.source), 89.13);
  assert.throws(
    () =>
      updateDashboardSource(second.source, {
        date: '09.08',
        month: 'August 2026',
        task: 'Research',
        duration: '1 h',
        payment: 5.75,
      }),
    /Duplicate entry/,
  );
});
