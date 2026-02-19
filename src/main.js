import './style.css'

// ── Scroll reveal ────────────────────────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      io.unobserve(entry.target)
    }
  })
}, { threshold: 0.08 })

document.querySelectorAll('.reveal').forEach(el => io.observe(el))

// Immediately reveal anything already in view on load
document.querySelectorAll('#home .reveal').forEach(el => {
  if (el.getBoundingClientRect().top < window.innerHeight) {
    el.classList.add('visible')
  }
})

// ── Active nav link ──────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('.nav-links a')

function updateNav() {
  let current = ''
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 220) current = s.id
  })
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current)
  })
}

window.addEventListener('scroll', updateNav, { passive: true })
updateNav()
