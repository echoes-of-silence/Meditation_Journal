# Sahaja Journal

A private, offline-first meditation journal for Sahaja Yoga practitioners. All data is stored
locally in the browser (IndexedDB) — there is no server, no account, and no analytics. Nothing
ever leaves your device unless you explicitly export or back it up.

## Features

- **Session entries**: date/time, duration, Thoughtless Awareness Depth (1–5), and free-form notes
  for experience, insights, sensations, and dreams/synchronicities.
- **Chakra state tracking**: Mooladhara through Sahasrara, each across Left / Central / Right
  channels, with state (Cool/Clear, Balanced, Mild/Moderate/Strong Catch) and optional 0–5
  intensity.
- **Fingertip Awareness Map**: interactive hand diagram mapped to chakra correspondences.
- **Subtle System Visualization**: an animated, color-coded diagram of the whole subtle system.
- **Trends & Analytics**: depth trends, chakra frequency, channel imbalance, streaks, and an
  automatically generated pattern-observations feed.
- **Calendar view & activity heatmap.**
- **Affirmations library** and a local quote-of-the-day, both bundled with the app (no network
  calls).
- **Export** to JSON, CSV, and PDF, plus full backup/restore.

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Dexie.js (IndexedDB) for local persistence
- Recharts for analytics charts, Framer Motion for animation

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint
```

The production build in `dist/` is a fully static site (uses hash-based routing) and can be
opened offline or hosted on any static file server.
