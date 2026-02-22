import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join, basename } from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const POSTS_DIR = 'blog/posts'
const PUBLIC_BLOG_DIR = 'public/blog'
const MANIFEST = 'public/blog/posts.json'
const SITE_URL = 'https://echos.sh'

// Ensure output directories exist
mkdirSync(PUBLIC_BLOG_DIR, { recursive: true })

// Configure marked for clean output
marked.setOptions({
    gfm: true,
    breaks: false,
})

// ── Helpers ──────────────────────────────────────────────────────────

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

// ── Collect posts ────────────────────────────────────────────────────

const files = existsSync(POSTS_DIR)
    ? readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
    : []

const posts = files.map(file => {
    const raw = readFileSync(join(POSTS_DIR, file), 'utf-8')
    const { data, content } = matter(raw)

    const slug = data.slug || basename(file, '.md')
    const html = marked(content)

    // Normalize date
    const rawDate = data.date
    let dateStr
    if (rawDate instanceof Date) {
        dateStr = rawDate.toISOString().split('T')[0]
    } else {
        dateStr = String(rawDate || new Date().toISOString().split('T')[0])
    }

    return {
        slug,
        title: data.title || slug,
        date: dateStr,
        summary: data.summary || '',
        html,
    }
})

// Sort by date descending (newest first)
posts.sort((a, b) => (b.date > a.date ? 1 : -1))

// ── Write JSON manifest (without html field) ──────────────────────

const manifest = posts.map(({ html, ...rest }) => rest)
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), 'utf-8')

// ── Generate standalone HTML page per post ────────────────────────

for (const post of posts) {
    const postDir = join('blog', post.slug)
    mkdirSync(postDir, { recursive: true })

    const pageHtml = `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(post.title)} | EchOS Blog</title>
  <meta name="description" content="${escapeHtml(post.summary)}" />

  <!-- Canonical -->
  <link rel="canonical" href="${SITE_URL}/blog/${post.slug}/" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(post.title)}" />
  <meta property="og:description" content="${escapeHtml(post.summary)}" />
  <meta property="og:url" content="${SITE_URL}/blog/${post.slug}/" />
  <meta property="og:site_name" content="EchOS" />
  <meta property="article:published_time" content="${post.date}T00:00:00Z" />
  <meta property="article:author" content="Albino Tonnina" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(post.title)}" />
  <meta name="twitter:description" content="${escapeHtml(post.summary)}" />

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": ${JSON.stringify(post.title)},
    "description": ${JSON.stringify(post.summary)},
    "datePublished": "${post.date}T00:00:00Z",
    "author": {
      "@type": "Person",
      "name": "Albino Tonnina",
      "url": "https://github.com/albinotonnina"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EchOS"
    },
    "url": "${SITE_URL}/blog/${post.slug}/",
    "mainEntityOfPage": "${SITE_URL}/blog/${post.slug}/"
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,200;1,9..144,300;1,9..144,400&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
    rel="stylesheet" />
</head>

<body>

  <!-- ── Navigation ─────────────────────────────────────────────────── -->
  <nav>
    <a href="/" class="nav-logo">EchOS</a>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/blog/" class="active">Blog</a></li>
      <li><a href="/#how-it-works">How it works</a></li>
      <li><a href="/#get-started">Get started</a></li>
      <li><a href="/#about">About</a></li>
    </ul>
  </nav>

  <section class="page-section blog-section">
    <a href="/blog/" class="blog-back">← All posts</a>

    <article class="blog-article">
      <div class="blog-post-header">
        <div class="section-label">${formatDate(post.date)}</div>
        <h1 class="blog-post-title">${escapeHtml(post.title)}</h1>
      </div>
      <div class="prose blog-content">
        ${post.html}
      </div>
    </article>
  </section>

  <!-- ── Footer ─────────────────────────────────────────────────────── -->
  <footer>
    <p>EchOS v0.5.4 · <a href="https://github.com/albinotonnina/echos"
        target="_blank">github.com/albinotonnina/echos</a>
    </p>
    <p>MIT License · built by <a href="https://github.com/albinotonnina" target="_blank">Albino Tonnina</a></p>
  </footer>

  <script type="module" src="/src/blog.js"></script>
</body>

</html>
`
    writeFileSync(join(postDir, 'index.html'), pageHtml, 'utf-8')
}

// ── Generate sitemap.xml ──────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]
const sitemapEntries = [
    `  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>`,
    `  <url><loc>${SITE_URL}/blog/</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>`,
    ...posts.map(
        p =>
            `  <url><loc>${SITE_URL}/blog/${p.slug}/</loc><lastmod>${p.date}</lastmod><priority>0.7</priority></url>`
    ),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>
`
writeFileSync('public/sitemap.xml', sitemap, 'utf-8')

// ── Generate robots.txt ──────────────────────────────────────────

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
writeFileSync('public/robots.txt', robots, 'utf-8')

console.log(`Blog: ${posts.length} post(s) built → ${MANIFEST}`)
console.log(`SEO: sitemap.xml + robots.txt generated`)
