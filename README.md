# RV Warranty Claim Packet Generator

A free, single-page web app that helps independent RV technicians and small
service shops turn a finished repair into a clean, submit-ready **PDF warranty
claim packet** in a few minutes.

Everything runs **client-side in the browser**. There are no accounts, no login,
no payment, and no server-side storage. Your business info, your customers'
details, and your photos never leave the browser — they only ever go into the
PDF you download. Refreshing the page clears everything (that's intentional).

## What it does

A short, step-by-step form:

1. **Who you're filing with** — Thor Industries, Forest River, Jayco, Grand
   Design, Lippert, Dometic, or any other name you type in.
2. **Unit & customer** — VIN, year/make/model, customer name, service date, plus
   your shop's filer info (business, technician, phone, email).
3. **What you did** — pick a labor operation from a searchable chart
   (`data/labor-codes.json`) or enter a custom one with your own hours; add
   optional parts rows; describe the work.
4. **Evidence** — attach photos. They're downscaled/compressed **on your device**
   and embedded directly into the PDF.
5. **Review & generate** — see exactly what will be in the PDF, then download it.

The resulting PDF has a header, a "submitted by" block, a unit/customer block,
labor and parts tables, the work description, embedded photos, and a
signature/date line — formatted to look credible enough to email straight to a
warranty department.

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **@react-pdf/renderer** for client-side PDF generation (the claim is a React
  component; the renderer is lazy-loaded in the browser only)
- No database, no auth, no backend API routes
- Deploys to **Vercel** as a standard, zero-config Next.js app

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Deploy

It's a standard Next.js app with no environment variables or backend services,
so it deploys to Vercel with no configuration:

```bash
vercel deploy
```

## `data/labor-codes.json` — adding real labor codes

The searchable labor dropdown is seeded from `data/labor-codes.json`.

**About the seed data:** the entries reference **real, common RV components and
part numbers** (e.g. Suburban `SW10DE` water heaters, the Lippert Schwintek
`236575` slide motor, the Dometic Brisk II `B59516` A/C, Lippert Solera `373566`
awning motor). The `hours` are **realistic industry-typical estimates**, not any
single manufacturer's official allowance.

> ⚠️ **Important — the official numbers are portal-only.** Coachbuilders (Thor,
> Forest River, Jayco, Grand Design, etc.) publish their flat-rate **codes** and
> **approved labor hours** only inside their dealer/service warranty portals;
> they are not public. Inside the portal, labor time auto-populates from the
> repair code you select. Before you submit a claim, replace the `code` and
> `hours` here with your portal's official values (the `code` field is what
> prints on the PDF). The seed data is a fast, real-world starting point — not a
> substitute for your manufacturer's chart.

Each entry looks like this:

```json
{
  "code": "SLD-100",
  "description": "Slide-out room adjustment and seal inspection",
  "hours": 1.5,
  "manufacturer": "Thor Industries"
}
```

| Field          | Required | Notes                                                            |
| -------------- | -------- | ---------------------------------------------------------------- |
| `code`         | yes      | The manufacturer/flat-rate code shown in the picker and the PDF. |
| `description`  | yes      | Human-readable operation description (also what you search on).  |
| `hours`        | yes      | Flat-rate hours allowed for the operation (number).              |
| `manufacturer` | no       | Optional tag for filtering by manufacturer later.                |

You can edit the JSON by hand, or import a manufacturer's CSV chart with the
included script.

### Importing a CSV of labor codes

`scripts/import-labor-codes.ts` converts a CSV into `data/labor-codes.json`. It
takes the **CSV path as a command-line argument** (nothing is hardcoded) and,
besides printing to the console, writes a full run log to
`scripts/import-labor-codes.log.txt`.

```bash
npm run import-labor-codes -- path/to/flat-rate-chart.csv
# optional second argument overrides the output file:
npm run import-labor-codes -- path/to/chart.csv data/labor-codes.json
```

The CSV needs a header row with these columns (case-insensitive; extra columns
are ignored). `manufacturer` is optional:

```csv
code,description,hours,manufacturer
SLD-100,"Slide-out room adjustment and seal inspection",1.5,Thor Industries
RF-200,Roof membrane reseal (per section),2.0,
```

Rows missing a code/description/hours or with a non-numeric `hours` value are
skipped and reported in the log.

## Privacy

- No accounts, no analytics, no network calls for your data.
- Photos are read and compressed locally and embedded into the PDF only.
- The **only** thing persisted is your own filer/business block, stored in this
  browser's `localStorage` so you don't retype it next time. It is never
  transmitted anywhere. Clearing your browser storage removes it.

## Progressive Web App

A manifest and a service worker are included, so on a phone you can "Add to Home
Screen" and keep generating PDFs even with no signal — generation is fully
client-side. (The service worker only registers in production builds.)

## Project layout

```
app/                     Next.js App Router (layout, page, styles)
components/               UI: wizard, stepper, step screens, PDF document
  steps/                 One component per form step
lib/                     types, image compression, PDF + download, localStorage
data/labor-codes.json    Seed labor chart (replace with real codes)
scripts/                 CSV → labor-codes.json import script
public/                  manifest, icon, service worker
```

## Scope (this version)

**Included:** the full form → PDF flow, photo embedding, PWA basics, remembered
filer info.

**Not included (by design):** login/accounts, a database, payment/billing, and
any direct integration with a manufacturer's claim system. This tool prepares
the document; you submit it yourself.
