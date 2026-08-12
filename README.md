# Camp Quest — Summer Adventure

Interactive browser game for young ESL learners (A1, Grades 1–2 / approx. ages 6–8).

## Missions

1. **Pack the Backpack** — camping vocabulary, *need / don't need*, **have got**.
2. **Dress for the Hike** — clothes, **is wearing / Present Continuous**.
3. **Weather Trail** — sunny / rainy / snowy & windy, actions in **Present Continuous**.
4. **River Camp** — camping sequence and **can / can't**.
5. **Our Camp Day** — 15 daily-routine actions, sequencing, **Present Simple**.
6. **Sunset Celebration** — final reward screen + speaking challenge.

## GitHub Pages upload

Upload the **contents of this folder** to the root of a GitHub repository. The file `index.html` must stay in the repository root.

Then open:

**Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/ (root)` → Save**

GitHub will publish the game as a static website.

## Files

- `index.html` — game shell + built-in SVG icon library
- `style.css` — layout, responsive design, animations and visual theme
- `game.js` — all six missions, scoring, audio feedback and interactions
- `assets/mission-1.webp` … `assets/mission-6.webp` — optimized illustrated mission artwork
- `.nojekyll` — keeps GitHub Pages in simple static-file mode

## Technical notes

- No frameworks or external JavaScript libraries.
- No external image or font requests.
- Works as a static GitHub Pages site.
- Responsive layout for desktop, tablet and smaller screens.
- Audio is generated in the browser with Web Audio API and can be switched off.

## Final QA

The release build was smoke-tested through the complete 1 → 6 mission path, including all correct-answer branches, grammar checks, mission transitions, replay/speaking controls, and runtime exception monitoring.
