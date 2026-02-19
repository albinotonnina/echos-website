# echos-website

Marketing site for [EchOS](https://github.com/albinotonnina/echos) — a self-hosted AI assistant with real memory.

**App repo:** https://github.com/albinotonnina/echos
**Live site:** https://echos-website.vercel.app

---

## Stack

- [Vite](https://vite.dev) — vanilla JS, no framework
- Plain HTML + CSS + JS
- Deployed on [Vercel](https://vercel.com) — auto-deploys on push to `main`

---

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build     # production build → dist/
npm run preview   # serve dist/ locally
```

---

## Project structure

```
echos-website/
├── index.html              # All page HTML (single-page, section-based)
├── src/
│   ├── main.js             # Scroll reveal + active nav
│   └── style.css           # All styles + design tokens
├── public/
│   └── favicon.svg         # Favicon
└── docs/
    └── website-content.md  # Source of truth for copy
```

---

## Working on the site

### Content

All copy lives in `docs/website-content.md`. Edit the text there, then update `index.html` to match.

### Design tokens

CSS custom properties at the top of `src/style.css`:

```css
:root {
  --bg:     #0c0c0a;   /* page background */
  --accent: #c47c3a;   /* amber — primary accent */
  --text:   #ede9df;   /* warm off-white */
  /* ... */
}
```

### Page sections

The site is one scrollable page. Each section maps to a nav item:

| Section ID        | Content                          |
|-------------------|----------------------------------|
| `#home`           | Hero, core loop, features, CTA   |
| `#how-it-works`   | Capture, search, write, plugins  |
| `#get-started`    | Requirements + setup steps       |
| `#about`          | Origin story, philosophy, status |

### Fonts

Loaded from Google Fonts in `<head>`:

| Font             | Used for                        |
|------------------|---------------------------------|
| Fraunces         | Headings, italic accents        |
| Lora             | Body text                       |
| JetBrains Mono   | Nav, labels, code, UI chrome    |

### Scroll animations

Add `reveal` to any element to fade it in on scroll. Use `reveal-delay-{1,2,3}` to stagger siblings:

```html
<div class="reveal reveal-delay-1">...</div>
<div class="reveal reveal-delay-2">...</div>
<div class="reveal reveal-delay-3">...</div>
```

---

## Deployment

Vercel auto-deploys every push to `main`. To deploy manually:

```bash
vercel --prod --yes
```

To inspect logs:

```bash
vercel inspect <deployment-url> --logs
```
