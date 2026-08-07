# Freelance Earnings Dashboard

## Favorite dashboard
- https://gistpreview.github.io/?748912a589e3142bd785f0108e4a6422
- Use this dashboard for future time and earnings updates.

## Created: 2026-04-10

### What we built
A single-file interactive HTML dashboard (`dashboard.html` in project root) to replace the Google Sheets earnings tracker.

### Source data
- Google Sheet: https://docs.google.com/spreadsheets/d/1GRzR-wC8D3UbTqnvuW-DDPH9HBYOlVOk4eHjGEf67bo/edit?usp=sharing
- CSV downloaded to: `C:\Users\user\Downloads\Freelance - Weekly.csv`

### Features
- Dark theme, modern design
- Two main collapsible sections: **Paid Work** and **In Progress**
- 13 months of data (April 2025 — April 2026)
- Each month is a clickable card that expands to show daily tasks
- Summary stats at the top: total earned, monthly average, task count
- Subscription items (Premiere Pro, CapCut) highlighted separately
- Both sections start collapsed on page load
- Self-contained HTML file — no server needed, works offline, can be sent to client directly

### Structure decisions
- Dropped weekly grouping from original sheet — organized by calendar month instead
- "In Progress" section (yellow/amber) holds unpaid tasks:
  - 08.04 | 2 Illegal child Care reels, Screen recording, Reframing, Teaching Claude to write Posts | 8 h | $40.00
  - 09.04 | Working on one reel, and making the guide of how to install Claude AI | 1 h | $5.75
- All other tasks are in "Paid Work" (green)
- No colors (green/yellow per month) for now — skipped at user's request
- Considered hosting online but decided to keep local for security (sensitive financial data)

### How to update
Send a message in either of these forms:

```text
Dashboard: 08.08 | Secret Mosque project | 11:30am-1am next day
Dashboard: 09.08 | Research and organizing | 4.5h
```

The default rate is `$5.75/hour`, so it only needs to be included when it changes. For time ranges, explicitly say `next day` when the work crosses midnight; the helper also treats an end time earlier than the start as overnight.

The integration workflow is:

1. Normalize the message into date, task, and either decimal hours or start/end times.
2. Run `node scripts/update_dashboard.mjs --date DD.MM --task "Description" --hours N --publish`, or use `--start TIME --end TIME` instead of `--hours`.
3. The helper calculates duration and payment, rounds money to cents, prevents exact duplicates, adds the entry to the correct unpaid month, updates the dashboard data version/footer, and publishes the saved Gist.
4. Verify the new entry and pending total, then commit and push only the dashboard-related files.

To move paid work, transfer tasks from `inProgress` to the appropriate month in `months`. Totals compute automatically from task rates.
