# viru185.github.io

Personal website for Viren Hirpara — a single-page portfolio built with plain HTML, CSS, and JavaScript.  
The design leans into dark, liquid-glass visuals with subtle motion, a loaded-first impression, and JSON-powered content blocks so updates stay fast.

---

## Highlights

- **Glassmorphism UI** – sticky frosted header, hero loader, and full-section glass cards inspired by contemporary iOS/iPadOS aesthetics.
- **Masonry project grid** – variable-height cards with inline metadata, SVG badges for tech stacks, and smart placeholders (`Preview coming soon` / `No preview available`).
- **Timeline storytelling** – experience and education stretch full width with responsive stacks, keeping the layout legible on any device.
- **Formspree contact flow** – progressive enhancement for the contact form using the Fetch API and optimistic status messaging.

---

## Directory overview

```
.
├── assets/
│   ├── hero_img.jpg
│   └── project_img/
│       ├── www.freezemoment.co.uk.png
│       └── www.virenhirpara.com.png
├── index.html
├── src/
│   ├── data/
│   │   ├── projects.json       # Portfolio entries + preview metadata
│   │   └── tech-icons.json     # Inline SVG map for tech pills
│   ├── script.js               # Loader, nav, masonry rendering, form handler
│   ├── styles.css              # Core glass theme, layout, responsive rules
│   └── theme/
│       └── dark.css            # Placeholder for future theme overrides
├── package.json                # BrowserSync helper (npm run sync)
└── README.md
```

---

## Editing content

| Goal | Files to touch |
|------|----------------|
| Update hero/experience/about copy | `index.html` |
| Add or edit projects | `src/data/projects.json` (`preview` can be `coming-soon` or `unavailable`) |
| Add icons for new technologies | `src/data/tech-icons.json` (SVG string keyed by tech name) |
| Adjust layout/styles | `src/styles.css` (global) or `src/theme/dark.css` (theme overrides) |

---

## Local development

```bash
git clone https://github.com/viru185/viru185.github.io.git
cd viru185.github.io
npm install
npm run sync   # launches BrowserSync at http://localhost:5173
```

BrowserSync watches `index.html`, everything inside `src/`, and the `assets/` directory. Save a file and the browser reloads automatically.

---

## Deployment (GitHub Pages)

This repository is already configured as a user site (`viru185.github.io`). Pages serves the root of the `main` branch directly — no static build step is required.

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Describe your change"
   git push origin main
   ```
2. GitHub Pages (Settings → **Pages**) should point to `main / (root)`.
3. Updates usually appear at <https://viru185.github.io> within a couple of minutes.

If you later introduce a build tool, be sure the build output replaces the root contents before pushing.

---

## Tech stack

- Semantic HTML5
- Modern CSS (grid, glassmorphism, custom properties)
- ES2022 JavaScript (no frameworks)
- BrowserSync for local development
- Formspree for contact submissions

---

## Contributing

Ideas and improvements are welcome. Please open an issue first for larger UI/UX changes, or submit a pull request with a clear description of what you’re changing.

---

## License

MIT © Viren Hirpara — see [`LICENSE`](LICENSE) for full terms.
