# EchOS Website Content

_Working draft for the EchOS product website. Plain text content only — no HTML, no markup beyond Markdown headings for structure. Intended to be moved to a separate website repo when the site is built._

---

## Page 1: Home

### Hero

**Headline:**
I kept learning things and then losing them. So I built a system that remembers.

**Subheadline:**
EchOS is a self-hosted AI assistant with a real memory. It captures what you read, watch, and think — and helps you find it again later, in your own words.

**CTAs:**

- [Self-host it] → links to /get-started
- [View on GitHub] → links to GitHub repo

---

### What it is

This isn't a notes app. It's not a chatbot. It's closer to a second brain — one that actually works.

You send it things throughout the day: a voice note from your commute, a YouTube video you want to remember, a question you're turning over. It processes, indexes, and stores all of it. When you need something back, you ask. It searches across everything you've given it and answers from your own knowledge — not from the internet, not from someone else's data.

It runs on your server. There's no subscription. No company holds your data. You own the whole thing.

---

### The core loop

**Capture**
Send a voice note on Telegram → transcribed and indexed.
Drop a URL → fetched, summarized, categorized.
Type a thought → stored with context.

**Recall**
Ask a question in plain language → it searches everything and finds what's relevant.
Phrase it however you want. You don't need tags or folders.

**Write**
Ask it to draft something → it pulls from your actual notes, not generic AI training data.
The output sounds like you, because the input was you.

---

### Three things it does well

**Capture anything. No friction.**
Voice messages, URLs, plain text, images. You send it via Telegram — an app you already have on your phone — and EchOS handles the rest. No special app. No login. Just message your bot.

**Find what you mean, not just what you typed.**
EchOS uses hybrid search: full-text matching (BM25) combined with semantic vector search, fused together for better results than either alone. You don't need to remember the exact words you used. You just need to remember roughly what you were thinking.

**Write in your voice.**
You can give EchOS examples of your writing — blog posts, emails, whatever — and it builds a style profile. When you ask it to write something, it draws on your notes and writes the way you write. Not generic. Not robotic.

---

### Your files, your tools

EchOS stores everything as plain Markdown. Open your vault in Obsidian today. Back it up with git. Move it anywhere. You're not locked in to EchOS — you're just using it to fill the vault.

---

### Closing CTA

It runs on Docker. You can have it running in under 10 minutes.

- [Get started] → links to /get-started
- [GitHub] → links to GitHub repo

---

---

## Page 2: How It Works

### Intro

I didn't want to learn a new interface. I wanted to talk to it like a person, the way I already send messages all day.

That's why EchOS uses Telegram as its primary interface. Your phone is already in your pocket. The app is already open. You just message your bot.

---

### Capture

**Voice messages**
Record a voice note in Telegram. EchOS transcribes it with OpenAI Whisper, extracts ideas and key points, and indexes it. The original audio stays stored alongside the text. Good for thinking out loud on a walk, capturing something before you forget it, or just not wanting to type.

**URLs**
Paste a link. EchOS fetches the page, extracts the content, strips the junk, and stores a clean summary alongside the full text. YouTube links get the transcript pulled automatically. No browser extension needed. Just paste and move on.

**Text**
Any message that isn't a URL or voice note gets processed as a note. EchOS categorizes it, tags it if relevant, and makes it searchable.

**Images**
Send a photo and EchOS stores it with metadata. Image analysis is handled by Claude.

---

### Search

EchOS uses three layers of search combined:

1. **Full-text (BM25)** — exact and near-exact phrase matching, stored in SQLite with FTS5
2. **Semantic (vector)** — meaning-based matching, stored in LanceDB
3. **Reciprocal Rank Fusion** — combines the two ranked lists into one result set

In practice, this means you can ask "that thing I read about compound interest last year" and it will find the article. You can ask "my thoughts on moving to a new city" and it will surface voice notes you forgot you recorded. You don't need tags, though you can add them if you want.

---

### Write

EchOS has two separate "voices."

The **agent voice** is how it talks to you — conversational, direct, gets to the point.

The **writing voice** is how it writes for you — and this one you train. You give it examples of your own writing: a few blog posts, a handful of emails, whatever feels representative. EchOS builds a style profile and uses it when generating content on your behalf.

When you ask it to write a blog post on a topic, it doesn't pull from the internet. It searches your own notes for relevant material, then writes in your style from that material. The result is something that actually sounds like you made it — because the raw ingredients were yours.

---

### Interfaces

**Telegram bot** — fully functional. This is the main interface today. Everything works: voice, URLs, text, search, writing.

**Web UI** — in progress. A browser-based interface for browsing and searching your knowledge base.

**Terminal UI** — in progress. For people who live in the terminal.

---

### Plugin system

EchOS processes content through plugins, not hardcoded logic. Each plugin handles a content type.

Included plugins:

- **YouTube** — extracts transcripts from YouTube URLs
- **Article** — extracts clean text from web pages
- **Image** — processes images via Claude

The plugin system is open. If you want to add support for a new content type — PDFs, podcasts, newsletters — you can write a plugin that implements the `EchosPlugin` interface. The core stays clean; the extensions stay modular.

---

---

## Page 3: Self-Hosting (Get Started)

### Intro

I run this on a small VPS. It costs me less than a coffee a month. The setup takes about 10 minutes if you already have Docker installed.

Here's what you need.

---

### Requirements

- Docker and Docker Compose (any recent version)
- A Telegram bot token — get one from [@BotFather](https://t.me/botfather) in about 2 minutes
- An [Anthropic API key](https://console.anthropic.com) — for the Claude agent
- An [OpenAI API key](https://platform.openai.com) — for Whisper (voice transcription) and embeddings. Optional if you don't need voice or semantic search.

That's it. No database server to install. No Redis cluster to configure. Everything runs in Docker.

---

### Steps

**1. Clone the repo**

```
git clone https://github.com/albinotonnina/echos.git
cd echos
```

**2. Set up your config**

```
cp .env.example .env
```

Open `.env` and fill in your keys:

- `TELEGRAM_BOT_TOKEN`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY` (if using voice or semantic search)
- `TELEGRAM_ALLOWED_USER_IDS` — your Telegram user ID. Only these users can interact with the bot.

**3. Start it**

```
docker-compose up -d
```

**4. Start the bot**

Open Telegram, find your bot, and send `/start`.

That's it. You're running.

---

### Going further

- Full configuration reference → [docs]
- Plugin development → [docs/plugins]
- Troubleshooting common issues → [docs/troubleshooting]

---

---

## Page 4: About

### Why I built this

A few years ago I noticed a pattern. I'd read something interesting. I'd think "I'll remember that." I wouldn't.

I tried note-taking apps. I tried tagging systems. I tried a Zettelkasten. Each one worked until it didn't — until the friction of maintaining the system cost more than the value it gave back.

The problem wasn't the tools. It was that capturing and retrieving are two different problems, and most tools optimise for one at the expense of the other.

I wanted something that made capturing effortless (Telegram, voice notes, paste a URL) and retrieval smart (ask a question, get an answer). I wanted it to run on infrastructure I controlled. I didn't want my knowledge base to be someone else's product.

So I built EchOS. It runs on my server. I use it every day. It's not finished — the web UI is still in progress, and there are features I haven't built yet — but the core loop works, and it's changed how I manage information.

I'm sharing it because other people have the same problem, and because the kind of people who want to run their own knowledge infrastructure tend to be good at improving things they care about.

---

### The philosophy

No dashboards. No schemas. No commands to memorize.

Your data is Markdown files on your filesystem. Open them in any editor. Search them with `grep`. Back them up with git. Move them to a different system whenever you want.

EchOS is an interface layer over your own files, not a replacement for them. The AI does the heavy lifting — processing, categorizing, searching, writing — but the underlying data is always yours, always portable, always human-readable.

Privacy isn't a feature. It's the architecture. Your notes never leave your server except to reach the AI APIs you've explicitly configured. There's no analytics. No tracking. No "we may use your data to improve our service." You run it; you control it.

---

### What's working and what's not

**Working today:**

- Telegram bot — voice, URLs, text, images
- Hybrid search — full-text + semantic
- Writing voice — style profiles and content generation
- Plugin system — YouTube, article, image plugins
- Obsidian-compatible Markdown export

**In progress:**

- Web UI
- Terminal UI

**On the list:**

- PDF support
- Better scheduling and background jobs
- More plugin examples and documentation

I'll keep building it. If you use it and hit something broken, open an issue. If you add something useful, I'll look at the PR.

---

_This is v0.3. It's real software that I run and depend on, but it's also a project I'm building in public. Expect rough edges. Expect improvement._

---

## Tone guidelines (for site copywriters / future drafts)

- First person throughout ("I built", "I run", "I use this daily")
- Short sentences. Space to breathe.
- Specific over vague: "runs on a $5 VPS" not "lightweight", "BM25 + LanceDB" not "advanced search"
- Honest about what's done and what's not — don't hide the rough edges
- No hype words: no "revolutionary", "game-changing", "powerful", "cutting-edge"
- Technical specificity builds trust with the audience — don't dumb it down, but don't lead with jargon either
- The reader is deciding whether to install this. Answer that question.
