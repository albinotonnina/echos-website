# CLAUDE.md — echos-website

This is the **marketing website** for [EchOS](https://github.com/albinotonnina/echos).
Your job here is to write website copy, improve the site, and keep it accurate and honest.

---

## The app repo

**All source of truth lives at: https://github.com/albinotonnina/echos**

When you need accurate details — feature behaviour, setup steps, technical specs,
version numbers — read files directly from the app repo rather than relying on memory.

Useful raw URLs to fetch:

```
https://raw.githubusercontent.com/albinotonnina/echos/main/README.md
https://raw.githubusercontent.com/albinotonnina/echos/main/docs/ARCHITECTURE.md
https://raw.githubusercontent.com/albinotonnina/echos/main/docs/PLUGINS.md
https://raw.githubusercontent.com/albinotonnina/echos/main/docs/DEPLOYMENT.md
https://raw.githubusercontent.com/albinotonnina/echos/main/docs/SECURITY.md
https://raw.githubusercontent.com/albinotonnina/echos/main/docs/WRITING.md
https://raw.githubusercontent.com/albinotonnina/echos/main/docs/SCHEDULER.md
https://raw.githubusercontent.com/albinotonnina/echos/main/docs/SLASH_COMMANDS.md
https://raw.githubusercontent.com/albinotonnina/echos/main/package.json
```

Use the `WebFetch` tool to read any of these before writing copy that touches technical specifics.

---

## What EchOS actually is

A self-hosted AI knowledge management system. The user sends it things throughout the day
via Telegram (voice notes, URLs, text, photos). EchOS processes, indexes, and stores them.
When the user needs something back they ask in plain language.

**Core loop:** Capture → Recall → Write

### Real technical details (verified from repo)

**Version:** 0.3.1

**Stack:**
- Node.js 20+ / TypeScript (strict), pnpm monorepo
- Claude (Anthropic API) as the agent brain
- SQLite + FTS5 for full-text search (BM25)
- LanceDB for vector embeddings (semantic search)
- Redis + BullMQ for background scheduler (optional)
- GrammY for Telegram bot
- Fastify for the Web API

**Interfaces:**
| Interface   | Status       | Notes                                              |
|-------------|------------- |----------------------------------------------------|
| Telegram    | Stable       | Primary interface. Voice, URLs, text, photos.      |
| Web API     | Experimental | REST API, disabled by default                      |
| Terminal UI | Experimental | TUI, disabled by default                           |

**Search:** Three layers combined
1. Full-text BM25 via SQLite FTS5
2. Semantic vector search via LanceDB + OpenAI embeddings
3. Reciprocal Rank Fusion to merge ranked results

**Storage:** Plain Markdown files with YAML frontmatter in `data/knowledge/`.
Fully Obsidian-compatible. Git-friendly.

**Plugin system:** Each plugin is a separate pnpm workspace package implementing `EchosPlugin`.
Built-in plugins: `article`, `youtube`, `image`, `content-creation`.

**Setup options:**
- Interactive wizard: `pnpm wizard` (recommended for first-time)
- Docker Compose (recommended for VPS)
- VPS one-liner install script

**Model presets:** fast (Haiku), balanced (Sonnet 4.5), deep (Opus 4.5). Switchable at runtime.

**Scheduler (optional):** Daily digest, reminder checks, async content processing.
Requires Redis. Disabled by default. Enable with `ENABLE_SCHEDULER=true`.

**Security model:** File system sandboxed to `data/`. No shell execution. No eval.
SSRF protection. Rate limiting. Telegram ID allowlist. Single-user per instance.

**API keys needed:**
- Anthropic API key (required)
- Telegram bot token (required)
- OpenAI API key (optional — for Whisper transcription and embeddings)

---

## This website

### What it is

A single-page marketing/product site. Four sections that scroll continuously.

### File structure

```
echos-website/
├── index.html              # All HTML — edit this to change content
├── src/
│   ├── style.css           # All styles. Design tokens at the top.
│   └── main.js             # Scroll reveal + active nav. Minimal.
├── public/favicon.svg
└── docs/website-content.md # Copy drafts and working notes
```

### Sections

| Anchor          | Content                                          |
|-----------------|--------------------------------------------------|
| `#home`         | Hero, core loop, three key features, files CTA   |
| `#how-it-works` | Capture, search, write, interfaces, plugins      |
| `#get-started`  | Requirements + 4 setup steps                     |
| `#about`        | Origin story, philosophy, what works / what's not|

### Design tokens (CSS custom properties in `src/style.css`)

```css
--bg:     #0c0c0a   /* near-black warm background */
--accent: #c47c3a   /* amber — primary accent      */
--text:   #ede9df   /* warm off-white              */
--green:  #7ee787   /* status: live/working        */
```

### Typography

- **Fraunces** — headings and display text (weight 200–400, italic for emphasis)
- **Lora** — body text
- **JetBrains Mono** — nav, labels, code, terminal blocks, UI chrome

### Scroll animations

Add `reveal` class to animate an element in on scroll.
Use `reveal-delay-{1,2,3}` to stagger groups:

```html
<div class="reveal reveal-delay-1">…</div>
<div class="reveal reveal-delay-2">…</div>
```

---

## Tone and copy rules

These come directly from the author's own guidelines in `docs/website-content.md`:

- **First person throughout** — "I built", "I run this", "I use it every day"
- **Short sentences.** Space to breathe.
- **Specific over vague** — "SQLite FTS5" not "fast search"; "runs on a $5 VPS" not "lightweight"
- **Honest about status** — don't hide what's experimental or unfinished
- **No hype words** — no "revolutionary", "game-changing", "powerful", "cutting-edge"
- **Technical specificity builds trust** — don't dumb it down, but don't lead with jargon
- **The reader is deciding whether to install this** — answer that question

### What to emphasise

1. **Privacy as architecture** — data never leaves your server except to reach configured APIs
2. **No lock-in** — plain Markdown files, open in Obsidian, back up with git
3. **Low friction capture** — Telegram is already on your phone
4. **Smart retrieval** — hybrid search means you don't need to remember exact words
5. **Your voice** — content generation draws from your notes, not generic training data

### What not to claim

- Do not describe the Web API or TUI as production-ready — they are experimental
- Do not claim Redis is required — the scheduler is optional
- Do not simplify the setup steps beyond what the README actually says
- Always link to https://github.com/albinotonnina/echos — never to any other URL

---

## Local dev

```bash
npm run dev      # http://localhost:5173
npm run build    # output → dist/
```

## Deploy

Push to `main` — Vercel auto-deploys.

```bash
vercel --prod --yes   # manual deploy if needed
```
