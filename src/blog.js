import './style.css'

// ── Mobile Menu ──────────────────────────────────────────────────────
const menuToggle = document.querySelector('.menu-toggle')
const navLinksContainer = document.querySelector('.nav-links')
const navLinksItems = document.querySelectorAll('.nav-links a')

if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('nav-active')
    })

    // Close menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('nav-active')
        })
    })
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

async function renderBlogIndex() {
    const list = document.getElementById('blog-list')
    if (!list) return

    try {
        const res = await fetch('/blog/posts.json')
        const posts = await res.json()

        if (posts.length === 0) {
            list.innerHTML = '<p class="blog-empty">No posts yet.</p>'
            return
        }

        list.innerHTML = posts
            .map(
                (post, i) => `
      <a href="/blog/${post.slug}/" class="blog-card reveal${i < 3 ? ` reveal-delay-${i + 1}` : ''}">
        <div class="blog-card-date">${formatDate(post.date)}</div>
        <div class="blog-card-title">${post.title}</div>
        <div class="blog-card-summary">${post.summary}</div>
        <span class="blog-card-read">Read →</span>
      </a>
    `
            )
            .join('')

        // Initialize scroll reveal for the injected cards
        const io = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                        io.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.08 }
        )
        list.querySelectorAll('.reveal').forEach(el => io.observe(el))
    } catch {
        list.innerHTML = '<p class="blog-empty">Could not load posts.</p>'
    }
}

renderBlogIndex()
