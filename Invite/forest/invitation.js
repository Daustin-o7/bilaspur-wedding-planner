'use strict';
(() => {
  const $ = s => document.querySelector(s), rm = matchMedia('(prefers-reduced-motion: reduce)');
  let ctx, W = 0, H = 0, B = [];
  const cover = $('#invitation-cover');
  const go = () => { document.body.classList.add('revealed'); burst(); };
  cover?.addEventListener('close', go);
  setTimeout(() => { if (!cover?.open) go(); }, 700);
  if (rm.matches) return;
  document.documentElement.classList.add('rv-on');

  // Scroll reveals: staggered, blur-to-sharp. Dynamic cards (events, venues, FAQ) are picked up as they render.
  const sel = 'main section:not(.hero):not(.blessing-band) > :not(.section-heading):not(.ornament):not(.story-art):not(.keepsake-scene), .event-grid > *, .venue-grid > *, .scripture-grid > *, .programme-list > *, #faq-list > *';
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target); e.target.classList.add('in');
    setTimeout(() => e.target.removeAttribute('data-rv'), 1700);
  }), { threshold: .1, rootMargin: '0px 0px -6% 0px' });
  const tag = () => document.querySelectorAll(sel).forEach(n => {
    if (n.hasAttribute('data-rv') || n.classList.contains('in') || n.hidden) return;
    n.setAttribute('data-rv', ''); n.style.setProperty('--d', Math.min([...n.parentElement.children].indexOf(n), 5) * .09 + 's'); io.observe(n);
  });
  let t; tag(); setTimeout(tag, 800);
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(tag, 60); }).observe($('main'), { childList: true, subtree: true });

  // Hero parallax; the arch outline and ornament turn as you scroll.
  const hero = $('.hero'); let q = 0;
  addEventListener('scroll', () => { if (q) return; q = requestAnimationFrame(() => { q = 0; hero?.style.setProperty('--py', Math.min(scrollY, 700) * .1); }); }, { passive: true });

  // Gold fireflies drifting over the card, plus a burst when the invitation opens.
  const cv = document.createElement('canvas'); cv.id = 'fx'; cv.setAttribute('aria-hidden', 'true'); document.body.append(cv);
  ctx = cv.getContext('2d');
  const size = () => { const d = Math.min(devicePixelRatio || 1, 2); W = Math.min(innerWidth, 430); H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  size(); addEventListener('resize', size);
  const mk = () => ({ x: Math.random() * W, y: Math.random() * H, r: .8 + Math.random() * 1.8, s: .15 + Math.random() * .35, p: Math.random() * 6.3 });
  const P = Array.from({ length: 30 }, mk);
  let on = true;
  document.addEventListener('visibilitychange', () => { on = !document.hidden; if (on) requestAnimationFrame(tick); });
  function tick(ts) {
    if (!on) return;
    ctx.clearRect(0, 0, W, H); ctx.shadowColor = '#dac393'; ctx.shadowBlur = 8;
    for (const p of P) {
      p.y -= p.s; p.x += Math.sin(ts / 1800 + p.p) * .25;
      if (p.y < -5) Object.assign(p, mk(), { y: H + 5 });
      ctx.fillStyle = `rgba(196,160,92,${.25 + .55 * Math.abs(Math.sin(ts / 1200 + p.p))})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill();
    }
    for (const b of B) {
      b.x += b.vx; b.y += b.vy; b.vy += .06; b.vx *= .985; b.l -= .012;
      ctx.fillStyle = `rgba(243,223,174,${Math.max(b.l, 0)})`; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.3); ctx.fill();
    }
    B = B.filter(b => b.l > 0); requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  window.__invitationBurst = burst;
  function burst() {
    if (!ctx) return;
    for (let i = 0; i < 46; i++) { const a = Math.random() * 6.3, v = 1 + Math.random() * 3.5; B.push({ x: W / 2, y: H * .38, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, l: 1, r: 1 + Math.random() * 2 }); }
  }
})();
