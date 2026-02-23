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
    <button class="menu-toggle" aria-label="Toggle menu">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/blog/" class="active">Blog</a></li>
      <li><a href="https://docs.echos.sh/" target="_blank">Docs</a></li>
      <li><a href="/#how-it-works">How it works</a></li>
      <li><a href="/#get-started">Get started</a></li>
      <li><a href="/#about">About</a></li>
      <li>
        <a href="https://discord.gg/qbdCjhxB2u" target="_blank" style="display: flex; align-items: center; gap: 4px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
          </svg>
          Discord
        </a>
      </li>
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
    <p>EchOS v0.6.0 · <a href="https://github.com/albinotonnina/echos"
        target="_blank">github.com/albinotonnina/echos</a> · <a href="https://discord.gg/qbdCjhxB2u" target="_blank">Discord</a>
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
