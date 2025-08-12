// 简单工具
const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

// 移动端导航
const navToggle = qs('.nav-toggle');
const navMenu = qs('.nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('show');
  });
  qsa('.nav-link', navMenu).forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// 滚动显示动画
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
qsa('.reveal-up').forEach(el => io.observe(el));

// 数字增长动画
const counters = qsa('.stat .num');
const animateNumber = (el) => {
  const targetText = el.dataset.count || '0';
  // 识别单位
  const hasPlus = /\+$/.test(targetText);
  const hasPercent = /%$/.test(targetText);
  const hasSlash = /\//.test(targetText);
  if (hasSlash) { el.textContent = targetText; return; }
  const target = parseInt(targetText.replace(/[^0-9]/g, ''), 10) || 0;
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const val = Math.floor(target * p);
    el.textContent = hasPercent ? `${val}%` : hasPlus ? `${val}+` : String(val);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateNumber(e.target);
      counterIO.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
counters.forEach(el => counterIO.observe(el));

// 视差：根据鼠标/滚动轻微位移
const depthNodes = qsa('[data-depth]');
const parallax = (x = 0, y = 0) => {
  depthNodes.forEach(n => {
    const d = parseFloat(n.dataset.depth || '0');
    n.style.transform = `translate3d(${x * d}px, ${y * d}px, 0)`;
  });
};
window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  parallax((e.clientX - cx) * 0.02, (e.clientY - cy) * 0.02);
});
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const diff = y - lastY;
  parallax(0, diff * 0.05);
  lastY = y;
});

// 回到顶部按钮
const backTop = qs('.back-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backTop.classList.add('show'); else backTop.classList.remove('show');
});
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// 优化：尊重降低动态偏好
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mq.matches) {
  depthNodes.forEach(n => n.style.transition = 'none');
}

// 简易表单提交提示（示例）
qs('.cta-form')?.addEventListener('submit', () => {
  const btn = qs('.cta-form button');
  const old = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 已提交';
  setTimeout(() => { btn.disabled = false; btn.innerHTML = old; }, 1500);
});

