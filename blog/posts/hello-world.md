---
title: Why I built a second brain that actually works
date: 2026-02-22
summary: I kept losing things I learned. Notes apps didn't stick. So I built EchOS — a self-hosted AI assistant that captures, indexes, and retrieves everything I feed it.
---

I have a bad habit. I read something interesting, think "I'll remember that," and then I don't.

I tried all the usual things. Notion. Obsidian. Apple Notes. A physical notebook for about six days. Each one worked for a while, until maintaining the system took more effort than the system gave back.

The problem isn't the tools. It's the gap between capturing and retrieving. Most tools optimise for one side and leave the other broken. Easy to save, impossible to find. Or meticulously organized, but too much friction to capture anything in the first place.

## What I wanted

Something I could message from my phone, the way I already message people all day. Voice notes when I'm walking. URLs when I find something worth keeping. Just text when I'm thinking through a problem.

And then, weeks later, I wanted to ask: "what did I read about compound interest?" and get an actual answer. Not a list of files. Not a search results page. An answer, drawn from my own notes.

## What I built

EchOS runs on a small VPS. It uses Telegram as the primary interface — no new app to install, no login, just a bot I message. It processes everything I send: transcribes voice notes with Whisper, fetches and summarizes articles, indexes plain text.

Search uses three layers: full-text BM25 via SQLite FTS5, semantic vector search via LanceDB, and Reciprocal Rank Fusion to merge the results. In practice, this means I don't need to remember the exact words I used. I just need to remember roughly what I was thinking about.

The whole thing stores notes as plain Markdown with YAML frontmatter. I can open the vault in Obsidian. Back it up with git. Move it anywhere. The AI layer sits on top; the data underneath is just files.

## What's next

I'm working on a web UI, better scheduling for background jobs, and PDF support. The core loop — capture, recall, write — works. Everything else is polish.

If you want to try it, the [setup guide](/index.html#get-started) takes about 10 minutes.
