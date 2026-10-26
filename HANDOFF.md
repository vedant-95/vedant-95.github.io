# Handoff notes (for Vedant or any AI assistant picking this up)

Live site: https://vedant-95.github.io (GitHub Pages, deploys automatically 1-2 min after a push to `main`).
Plain static site: no build step, no framework. Run locally with `python3 -m http.server 8080` and open http://localhost:8080.

## Where things are
| File | What it holds |
| --- | --- |
| `index.html` | Page skeleton: left windows, spinning photo, desktop icons, bottom bar |
| `content.js` | **All text and data.** `FOLDERS` = desktop icons and their windows. `JOBS` = work timeline. `BUILDS` = "things I built" tiles |
| `app.js` | Window behaviour: open/drag/stack/minimise, timeline hover, project hover previews |
| `style.css` | All styling. Mobile layout is the `@media (max-width:768px)` block at the end |
| `icons.js` | Fallback flat SVG icons (only used if a folder has no `img`) |
| `img/icons/*.webp` | Desktop icons (custom Blender renders) |
| `img/builds/*` | Project icons and the short silent `.mp4` loops shown on hover |
| `img/vedant-3d.webp` | Spinning 3D portrait (animated WebP, 60 frames, one turn per ~4.8 s) |
| `tools/` | Scripts used to make the assets above (not loaded by the site) |

## Common edits
- **New desktop icon/section:** add an entry to `FOLDERS` in `content.js` (`id`, `label`, `img`, `title`, `html`, optional `width`).
- **New job / timeline bar:** add to `JOBS`. `from`/`to` are decimal years (2025.5 = July 2025). `client: true` puts it inside the dashed EXL box. `badge` adds a yellow sticker. `pts` are the hover bullets. Keep `now: true` on the current role (it is shown by default).
- **New project:** add to `BUILDS` with `icon`, `video` (short muted loop, ~640px wide, under ~2 MB) and a one-line `text`.
- **Music:** upload videos to YouTube (Public or Unlisted), then embed with `<iframe src="https://www.youtube.com/embed/VIDEO_ID">` in the music folder. Don't put big videos in this repo (GitHub rejects files over 100 MB).

## Decisions already made (keep these)
- Look is inspired by tulsi.design (retro desktop OS), but every asset is original. Don't copy her images.
- Icons should be shiny/metallic 3D in the site's blue / lime / purple palette, not flat stock icons.
- Work section is written for a hiring manager: results first, numbers on top. Jobs since 2021 were all through EXL: show one dashed "EXL 2021-now" box, no "client" wording. The current role is labelled "ML platform" (the client is confidential).
- SpoilerGuard links to the Chrome Web Store, not GitHub.
- Phone number and visa status stay off the site.
- The raw 3D scan (`.ply`) must never be committed. `scan/` is gitignored for that reason.
- "About me" was removed on purpose.
- The "What's This Charge?" hover video is a mock iMessage chat (`tools/previews/wtc.html`), not a real recording. Swap it in if a real one exists.

## Still to do
- Music: YouTube links.
- Gaming: which game he was Immortal in, plus a tracker link or clips.
- Reviews window: real LinkedIn recommendations (currently placeholders).
- Financial markets: content and format are still placeholders (see the Webull notes below).
- resume.pdf: the download button is a placeholder. Use a version without the phone number.

## Webull auto-sync idea (not built)
Webull has an official OpenAPI (https://developer.webull.com) with Account Balance, Account Positions and Order History endpoints (Python SDK: `webull-openapi-python-sdk`).
1. Apply for it: webull.com, log in, avatar menu, Developer Tool, OpenAPI Management, My Application. Review takes 1-2 working days. Then create an App Key + App Secret under API Keys Management. (Use read-only access if offered.)
2. The keys must **never** be in this public repo or in browser JavaScript. Store them as GitHub Actions secrets (repo Settings, Secrets and variables, Actions).
3. A scheduled GitHub Action (e.g. daily) runs a small Python script that calls the API and writes `data/markets.json`, then commits it. The markets window reads that JSON.
4. Privacy: publish % returns, tickers and dates, not dollar balances or account IDs, unless Vedant explicitly wants dollar amounts public.

## How assets were made (`tools/`)
- `tools/icons/icons.py`: Blender (4.2, Cycles CPU) script that renders each desktop icon to a transparent PNG: `blender -b -P icons.py -- OUTDIR [names]`. The PNGs were then resized to webp with Pillow.
- `tools/previews/rec.py URL NAME`: records a scrolling video of a website with Playwright and compresses it with ffmpeg into `img/builds/NAME.mp4`. Run it from `tools/previews/`.
- `tools/portrait-3d/`: `gs.py` is a small CPU Gaussian-splat renderer (numba) and `turntable.py` renders 60 frames of the Scaniverse scan. The scan's vertex data was first converted from `.ply` to `raw.npy` (a numpy structured array with the PLY property names). Frames were combined into the animated WebP with Pillow.
