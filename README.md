# Pipeline Dashboard

A sales pipeline dashboard built to answer the questions a founder asks every week. How much is in the pipe, where it sits, who’s driving it, and which deals to look at next.

**Live demo:** [https://5ss-the-dashboard-task.vercel.app/](https://5ss-the-dashboard-task.vercel.app/)

**Repo:** [github.com/Eniola-Codes/The-dashboard](https://github.com/Eniola-Codes/The-dashboard)

---

## What it answers

| Founder question | Where to look |
| --- | --- |
| **How much pipeline do I have, and where is it?** | KPI cards (total value, deal count, won value, average deal size) + stage funnel chart |
| **Who and which channels are working?** | Owner performance chart + lead source chart |
| **Show me the deals** | Filterable deals table — filter by date, stage, owner, vertical and source  + search, sort and export CSV |
| **How is pipeline trending over time?** | Pipeline trend chart + revenue by vertical |

All KPIs, charts, and the table share the same filtered dataset, change a filter and the whole dashboard updates together.

---

## Features

- **Five global filters** — date range, stage, owner, vertical, source
- **URL-synced filters** — refresh or share a link; filter state persists in the query string
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

The dashboard is built around **filter-driven metrics**: one `filterDeals` pass feeds KPIs, every chart, and the table, so numbers never disagree. **Won value** is featured alongside deal counts because revenue matters more to a founder than win-rate percentages alone. Charts emphasize **pipeline value and won value by owner and source** rather than random data. Filters sync to the **URL** so a filtered view can be bookmarked or shared without extra state management. The UI uses a dark theme with shadcn components for a clean, product-ready feel on desktop and mobile.

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

## License

Private — built as a take-home assignment.
