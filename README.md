# Pipeline Dashboard

A sales pipeline dashboard built to answer the questions a founder asks every week. How much is in the pipe, where it sits, who’s driving it, and which deals to look at next.

**Live demo:** [https://5ss-the-dashboard-task.vercel.app/](https://5ss-the-dashboard-task.vercel.app/)

**Repo:** [github.com/Eniola-Codes/The-dashboard](https://github.com/Eniola-Codes/The-dashboard)

**Walkthrough:** [3-min Loom](http://loom.com/share/aa2b75e068104c04a8483b66de742b53)

---

## What it answers

| Founder question | Where to look |
| --- | --- |
| **How much pipeline do I have, and where is it?** | KPI cards (total value, deal count, won value, average deal size) + stage funnel chart |
| **Who and which channels are working?** | Owner performance chart + lead source chart |
| **Show me the deals** | Filterable deals table — filter by date, stage, owner, vertical, and source + search, sort, and CSV export |
| **How is pipeline trending over time?** | Pipeline trend chart + revenue by vertical |

All KPIs, charts, and the table share the same filtered dataset, change a filter and the whole dashboard updates together.

---

## Install blueprint

**Client context:** Founder reviews pipeline weekly from a spreadsheet. No single view exists, data lives across tabs, owners update manually, and getting answers means exporting the sheet and building pivot tables every week.

**Version 1 — shipped (this dashboard)**

- Centralized the full deal dataset into a single filtered view
- One filter pass drives all KPIs, charts, and the table so the numbers never disagree
- Founder answers weekly pipeline questions without opening a spreadsheet

**Version 2 — planned (not built yet)**

- **Stale deal agent** — flags deals with no activity in 14+ days, notifies owner via Slack and email
- **Weekly pipeline brief agent** — Monday morning summary for the founder. Top risks, biggest opportunities, stale deals by representative
- **CRM read sync** — connect HubSpot or Google Sheets as live data source, replacing the static JSON file

**Integration map**

CRM (read) → dashboard dataset → Slack and email (alerts + brief)

**Rollout order**

1. Read sync — live data before any automation
2. Stale deal alerts — low risk, high signal
3. Weekly brief agent — founder reviews one output, not twelve charts
4. Draft follow-ups — human approves before send

**What stays human:** Reps own follow-up, agents flag and draft. Founder approves before anything is sent.

**Risks:** Stale alerts only work if `last_activity` is trusted in the CRM. No write-back until read sync is stable.

**Success metric:** Founder opens one view on Monday. Does not export a CSV. Does not ask a rep for a pipeline update.

---

## Features

- **Five global filters** — date range, stage, owner, vertical, source
- **KPI cards** — pipeline value, deal count, won value, average deal value
- **Charts** — stage funnel, vertical breakdown, owner vs won value, pipeline by source, daily trend
- **Deals table** — search, sort, pagination, CSV export
- **Responsive layout** — inline filters on desktop, bottom drawer on mobile

---

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- [Recharts](https://recharts.org) — charts
- [TanStack Table](https://tanstack.com/table) — sortable, searchable deals table
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) — UI components
- Static pipeline data (`src/lib/data/pipeline.json`) — no backend required

---

## Run locally

**Requirements:** Node.js **20.9+**

```bash
git clone https://github.com/Eniola-Codes/The-dashboard.git
cd The-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

---

## Design choices

The dashboard is built around **filter-driven metrics**. One shared filter pass feeds KPIs, every chart, and the table, so numbers never disagree. **Won value** sits alongside deal counts because revenue matters more to a founder than win-rate alone. Charts focus on **pipeline value and won value by owner and source** so you can see who carries volume and who actually closes. The layout is **responsive** with inline filters on desktop, a bottom drawer on mobile.

---

## Project structure

```
src/
├── app/                    # Next.js App Router pages
├── components/pipeline/    # Dashboard UI (filters, cards, charts, table)
├── hooks/pipeline/         # useChart, useTable, useFilters
├── lib/
│   ├── data/pipeline.json  # Deal dataset
│   └── utils/pipeline/     # filter, metrics, chart, table helpers
└── types/                  # Deal, FilterOptions, PipelineMetrics
```

---

Built as a pipeline install demo.
