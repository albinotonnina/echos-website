import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join, basename } from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const POSTS_DIR = 'blog/posts'
const DIST_DIR = 'blog/dist'
const MANIFEST = 'blog/posts.json'

// Ensure output directories exist
mkdirSync(DIST_DIR, { recursive: true })

// Configure marked for clean output
marked.setOptions({
    gfm: true,
    breaks: false,
})

// Collect all .md files
const files = existsSync(POSTS_DIR)
    ? readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
    : []

const posts = files.map(file => {
    const raw = readFileSync(join(POSTS_DIR, file), 'utf-8')
    const { data, content } = matter(raw)

    const slug = data.slug || basename(file, '.md')
    const html = marked(content)

    // Write the HTML snippet for this post
    writeFileSync(join(DIST_DIR, `${slug}.html`), html, 'utf-8')

    // Normalize date — gray-matter may parse YAML dates as Date objects
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
    }
})

// Sort by date descending (newest first)
posts.sort((a, b) => (b.date > a.date ? 1 : -1))

// Write the manifest
writeFileSync(MANIFEST, JSON.stringify(posts, null, 2), 'utf-8')

// Also copy to dist/ if it exists (for production builds)
const distBlogDir = 'dist/blog/dist'
const distManifest = 'dist/blog/posts.json'
if (existsSync('dist')) {
    mkdirSync(distBlogDir, { recursive: true })
    writeFileSync(distManifest, JSON.stringify(posts, null, 2), 'utf-8')
    for (const post of posts) {
        const src = join(DIST_DIR, `${post.slug}.html`)
        const dest = join(distBlogDir, `${post.slug}.html`)
        writeFileSync(dest, readFileSync(src, 'utf-8'), 'utf-8')
    }
}

console.log(`Blog: ${posts.length} post(s) built → ${MANIFEST}`)
