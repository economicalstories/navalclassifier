# Naval Classifier: APS5 Edition

A mobile-first, semi-satirical action classification game where you play an APS5 classifier stamping moving vessels before they sail out of the reporting window.

## Play Loop

- Watch each vessel physically move across the sea lane.
- Hold **Scan** to build an evidence lock and reveal stronger clues.
- Fire one of the permanent classification stamps: Patrol, Civilian, Support, or Absurd.
- Classify early for speed points, scan-lock for intel points, and keep a streak alive.
- Missed contacts and wrong stamps generate paperwork, naturally.

## Controls

- Touch: hold **Scan**, then tap a stamp.
- Keyboard: hold `Space` to scan, press `A/S/D/F` to stamp, press `Enter` to continue after feedback.

## Local Development

```bash
npm run dev
```

## Checks

```bash
npm run test
npm run build
```

## Cloudflare Pages

This is a dependency-free static app. Configure Cloudflare Pages with:

- Build command: `npm run build`
- Output directory: `dist`
