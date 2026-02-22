import { defineConfig } from 'vite'
import { resolve } from 'path'
import { existsSync, readdirSync } from 'fs'

const blogPostsDir = resolve(__dirname, 'blog/posts')
const input = {
    main: resolve(__dirname, 'index.html'),
    blog: resolve(__dirname, 'blog/index.html'),
}

// Dynamically add all generated blog post index.html files
if (existsSync(blogPostsDir)) {
    const files = readdirSync(blogPostsDir).filter(f => f.endsWith('.md'))
    for (const file of files) {
        const slug = file.replace(/\.md$/, '')
        const postHtmlPath = resolve(__dirname, `blog/${slug}/index.html`)
        // We add them mapped by their slug.
        input[`post-${slug}`] = postHtmlPath
    }
}

export default defineConfig({
    build: {
        rollupOptions: {
            input,
        },
    },
})
