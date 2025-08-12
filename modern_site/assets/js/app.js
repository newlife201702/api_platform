// 基础工具
const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel))

document.addEventListener('DOMContentLoaded', () => {
  initHeaderElevate()
  initMobileMenu()
  initReveal()
  initTilt()
  initParallaxBadges()
  initPricingToggle()
})

function initHeaderElevate() {
  const header = $('.site-header[data-elevate]')
  const onScroll = () => {
    const y = window.scrollY
    header.style.boxShadow = y > 8 ? '0 8px 30px rgba(0,0,0,.28)' : 'none'
    header.style.backgroundColor = y > 8 ? 'rgba(12,20,36,.65)' : 'transparent'
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
}

function initMobileMenu() {
  const nav = $('.nav')
  const btn = $('.nav-toggle')
  const menu = $('#primary-menu')
  if (!btn || !nav || !menu) return
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open')
    btn.setAttribute('aria-expanded', String(open))
  })
  // 点击菜单项关闭
  $$('#primary-menu a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')))
}

function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('reveal-in')
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' })
  $$('[data-reveal]').forEach(el => io.observe(el))
}

function initTilt() {
  // 简易倾斜效果（替代第三方）
  const cards = $$('[data-tilt]')
  const max = 10
  const dist = 100
  const enter = e => e.currentTarget.style.transition = 'transform .12s ease'
  const leave = e => {
    const el = e.currentTarget
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
    el.style.transition = 'transform .3s ease'
  }
  const move = e => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const rx = ((y - r.height / 2) / dist) * -max
    const ry = ((x - r.width / 2) / dist) * max
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`
  }
  cards.forEach(el => {
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
  })
}

function initParallaxBadges() {
  const root = $('.hero-visual')
  if (!root) return
  const badges = $$('[data-parallax]', root)
  root.addEventListener('mousemove', e => {
    const rect = root.getBoundingClientRect()
    const cx = e.clientX - rect.left - rect.width / 2
    const cy = e.clientY - rect.top - rect.height / 2
    badges.forEach((b, i) => {
      const f = (i + 1) * 0.008
      b.style.transform = `translate(${(-cx) * f}px, ${(-cy) * f}px)`
    })
  })
}

function initPricingToggle() {
  const toggle = $('#billingToggle')
  if (!toggle) return
  const prices = $$('.plan .price')
  const apply = () => {
    const yearly = toggle.checked
    prices.forEach(p => {
      p.textContent = yearly ? p.dataset.year : p.dataset.month
    })
  }
  toggle.addEventListener('change', apply)
  apply()
}

