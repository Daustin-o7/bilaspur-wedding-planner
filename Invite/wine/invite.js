'use strict';
(() => {
  const root = document.documentElement, body = document.body;
  const cover = document.querySelector('#invitation-cover');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js-ready');

  // Start the hero choreography when the envelope opens (or straight away on deep links).
  const reveal = viaSeal => { if (viaSeal) body.classList.add('via-seal'); body.classList.add('revealed'); };
  const burst = seal => {
    if (!seal || !cover) return;
    const r = seal.getBoundingClientRect();
    for (let i = 0; i < 22; i++) {
      const spark = document.createElement('i'), angle = Math.random() * 6.283, distance = 70 + Math.random() * 130;
      spark.className = 'spark';
      spark.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;--x:${Math.cos(angle) * distance}px;--y:${Math.sin(angle) * distance - 40}px;animation-delay:${Math.random() * .15}s`;
      cover.append(spark); setTimeout(() => spark.remove(), 1500);
    }
  };
  document.querySelector('#open-invitation')?.addEventListener('click', event => {
    if (reduced) { reveal(false); return; }
    burst(event.currentTarget.querySelector('.wax-seal')); reveal(true);
  });
  cover?.addEventListener('close', () => reveal(false));
  if (!cover?.open) reveal(false);

  // A thin gold ribbon marks reading progress; the guest dock stays for navigation.
  const bar = document.createElement('div'); bar.className = 'top-progress'; bar.setAttribute('aria-hidden', 'true'); body.append(bar);
  const tick = () => { const h = root.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; };
  addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); tick();

  // Gold frames settle in around keepsake sections; portraits "develop" like prints.
  const frames = document.querySelectorAll('.keepsake-section, .scripture-section, .gifts-section, .closing-section');
  const prints = document.querySelectorAll('.story-photo img, .portrait-companion img, .gallery-track img');
  frames.forEach(node => node.classList.add('frame-card'));
  prints.forEach(node => node.classList.add('develop'));
  const targets = [...frames, ...prints];
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    }), { threshold: .25 });
    targets.forEach(node => io.observe(node));
  } else targets.forEach(node => node.classList.add('in'));

  // Quiet gold dust rises and a few petals fall behind everything.
  if (reduced) return;
  const canvas = document.createElement('canvas'); canvas.className = 'dust'; canvas.setAttribute('aria-hidden', 'true'); body.append(canvas);
  const ctx = canvas.getContext('2d'); let w, h, dpr;
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); w = canvas.width = innerWidth * dpr; h = canvas.height = innerHeight * dpr; };
  size(); addEventListener('resize', size);
  const count = innerWidth < 600 ? 26 : 44;
  const bits = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 1.8, s: .015 + Math.random() * .04, p: Math.random() * 6.283, petal: Math.random() < .2 }));
  let last = 0;
  const frame = time => {
    const dt = Math.min(.05, (time - last) / 1000 || 0); last = time;
    ctx.clearRect(0, 0, w, h);
    for (const b of bits) {
      b.y += (b.petal ? b.s * 1.6 : -b.s) * dt;
      if (b.y > 1.05) b.y = -.05; if (b.y < -.05) b.y = 1.05;
      const x = (b.x + Math.sin(time / 2200 + b.p) * .012) * w, y = b.y * h;
      if (b.petal) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(time / 1800 + b.p); ctx.scale(1, .55);
        ctx.fillStyle = b.r > 1.4 ? 'rgba(112,45,61,.26)' : 'rgba(214,160,160,.34)';
        ctx.beginPath(); ctx.arc(0, 0, b.r * 4 * dpr, 0, 6.283); ctx.fill(); ctx.restore();
      } else {
        ctx.fillStyle = `rgba(217,180,106,${.18 + .3 * (.5 + .5 * Math.sin(time / 900 + b.p))})`;
        ctx.beginPath(); ctx.arc(x, y, b.r * dpr, 0, 6.283); ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
