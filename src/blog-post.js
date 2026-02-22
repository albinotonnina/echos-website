import './style.css'

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

async function renderPost() {
    const params = new URLSearchParams(window.location.search)
    const slug = params.get('slug')

    if (!slug) {
        window.location.href = '/blog.html'
        return
    }

    try {
        // Load the post metadata for the title, date, and meta description
        const metaRes = await fetch('/blog/posts.json')
        const posts = await metaRes.json()
        const meta = posts.find(p => p.slug === slug)

        if (meta) {
            document.getElementById('blog-post-title').textContent = meta.title
            document.getElementById('blog-post-date').textContent = formatDate(meta.date)
            document.title = `${meta.title} | EchOS Blog`

            // Update meta description
            const descEl = document.querySelector('meta[name="description"]')
            if (descEl) descEl.setAttribute('content', meta.summary)
        }

        // Load the post HTML
        const contentRes = await fetch(`/blog/dist/${slug}.html`)

        if (!contentRes.ok) {
            document.getElementById('blog-post-content').innerHTML =
                '<p>Post not found.</p>'
            return
        }

        const html = await contentRes.text()
        document.getElementById('blog-post-content').innerHTML = html
    } catch {
        document.getElementById('blog-post-content').innerHTML =
            '<p>Could not load post.</p>'
    }
}

renderPost()
