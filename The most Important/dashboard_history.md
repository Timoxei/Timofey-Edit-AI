# Freelance Earnings Dashboard

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
1. Add new tasks to the `months` or `inProgress` arrays in `dashboard.html`
2. Move tasks from `inProgress` to the appropriate month in `months` once paid
3. Totals compute automatically from task rates
