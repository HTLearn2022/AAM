# Airport Airside Manager (AAM) – JIA Demonstration

A static, fictional airport demonstration by JSR Communications. No real operational records are included.

## Contents
- `index.html`: Operations Hub dashboard, including a time-based interactive apron map linked to assignment records.
- `assets/jia-demo-apron.svg`: original fictional vector airport diagram, featuring configured stand and GA positions.
- `assignments.html`: uploaded stand/counter/GA demonstration, with a link back to the hub.
- `airfield-inspection.html`: uploaded airfield inspection demonstration, with a link back.
- `terminal-inspection.html`: uploaded terminal inspection demonstration, with a link back.

## To preview
Open `index.html` in a browser, or run a local static server in this directory:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Deploy to GitHub Pages (after approval)
1. Create an appropriately named repo e.g. `aam-demo` (public if on GitHub Free).
2. Upload all files from this directory, preserving their names.
3. In repository Settings → Pages, deploy from `main` branch, root `/`.
4. The expected URL format is `https://<username>.github.io/aam-demo/`.

## Important limitations
- The default assignment rules now include stands 1–10, stand 7L, Cargo and GA positions G1–G9 to match the map. Existing browser-saved rules are never overwritten; unconfigured map positions are shown as unavailable.
- The diagram is a fictional schematic, not an operationally accurate or georeferenced map. Its coloured occupancy pins are computed using the same ETA/ETD and turnaround/buffer rules as the assignment application. GA stays appear as recorded or reserved, because their register does not specify precise on-stand times.
- The dashboard reads fictional sample flights by default, and reads saved assignments from the same origin's browser localStorage (key `jia-stands-v1`) if present. It doesn't write sample data to the assignment module.
- The two inspection modules each maintain their own local browser drafts. The dashboard displays only whether browser drafts exist, not inspection outcomes.
- No real user authentication, shared data, server database, live flight data, submission or official NOTAM function is provided here.
- Forms and buttons inside the original modules retain their existing behaviour. A few buttons can download PDFs or open the visitor's email client; none should be interpreted as an official airport workflow.
- Do not put any airport proprietary data, passwords or API keys in the static site. GitHub Pages is public-facing.
- GitHub Pages should be used only as a fictional demonstration, not for commercial SaaS operations.

## Source preservation
Each supplied HTML module has only a small home-link navigation row and associated CSS inserted. Its original application scripts and logic are unchanged.