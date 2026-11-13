'use strict';
window.setupInvitationExperience = () => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const card = document.querySelector('#keepsake-card');
  const turn = document.querySelector('#turn-keepsake');
  turn.addEventListener('click', () => {
    const flipped = card.classList.toggle('is-turned');
    turn.setAttribute('aria-pressed', String(flipped));
    for (const [index, face] of [...card.children].entries()) {
      const hidden = index === 0 ? flipped : !flipped;
      face.inert = hidden; face.setAttribute('aria-hidden', String(hidden));
    }
  });

  const track = document.querySelector('.gallery-track');
  const photos = [...track.querySelectorAll('.photo-button')];
  let currentPhoto = 0;
  const updateGallery = () => {
    const bounds = track.getBoundingClientRect(), center = bounds.left + bounds.width / 2;
    currentPhoto = photos.reduce((best, photo, index) => {
      const distance = node => { const r = node.getBoundingClientRect(); return Math.abs(r.left + r.width / 2 - center); };
      return distance(photo) < distance(photos[best]) ? index : best;
    }, 0);
    document.querySelector('#gallery-position').textContent = `${currentPhoto + 1} / ${photos.length}`;
    document.querySelector('[data-gallery-step="-1"]').disabled = currentPhoto === 0;
    document.querySelector('[data-gallery-step="1"]').disabled = currentPhoto === photos.length - 1;
  };
  const goToPhoto = index => {
    const photo = photos[index].getBoundingClientRect(), bounds = track.getBoundingClientRect();
    track.scrollBy({ left: photo.left + photo.width / 2 - bounds.left - bounds.width / 2, behavior: reduced.matches ? 'instant' : 'smooth' });
  };
  document.querySelectorAll('[data-gallery-step]').forEach(button => button.addEventListener('click', () => {
    stopSlideshow();
    goToPhoto(Math.max(0, Math.min(photos.length - 1, currentPhoto + Number(button.dataset.galleryStep))));
  }));
  track.addEventListener('scroll', updateGallery, { passive: true });
  window.addEventListener('resize', updateGallery);
  updateGallery();

  // Slow auto slideshow: one photo at a time, reversing at each end and carrying on. Any touch, arrow,
  // key or focus on the gallery hands control back to the guest for good.
  let direction = 1, slideshow = 0;
  const stopSlideshow = () => { clearInterval(slideshow); slideshow = 0; };
  const advance = () => {
    if (document.hidden) return;
    const box = track.getBoundingClientRect();
    if (box.bottom < 0 || box.top > innerHeight) return;
    if (currentPhoto >= photos.length - 1) direction = -1;
    else if (currentPhoto <= 0) direction = 1;
    goToPhoto(currentPhoto + direction);
  };
  if (!reduced.matches) {
    slideshow = setInterval(advance, 4500);
    for (const type of ['pointerdown', 'touchstart', 'wheel', 'keydown', 'focusin']) track.addEventListener(type, stopSlideshow, { passive: true });
    reduced.addEventListener('change', () => { if (reduced.matches) stopSlideshow(); });
  }

  const dock = document.querySelector('.guest-dock');
  const links = [...dock.querySelectorAll('a')];
  let scrollQueued = false;
  const updateProgress = () => {
    const length = document.documentElement.scrollHeight - innerHeight;
    dock.style.setProperty('--reading-progress', length > 0 ? String(Math.min(1, Math.max(0, scrollY / length))) : '0');
    let active = links[0];
    for (const link of links) {
      const section = document.querySelector(link.hash);
      if (!section.hidden && section.getBoundingClientRect().top <= innerHeight * .4) active = link;
    }
    for (const link of links) {
      if (link === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const tiltSelector = '[data-tilt], .hero-photo, .story-photo, .portrait-companion';
  let tilted;
  const resetTilt = () => {
    tilted?.style.removeProperty('--tilt-x'); tilted?.style.removeProperty('--tilt-y'); tilted = null;
  };
  document.addEventListener('pointermove', event => {
    if (reduced.matches || event.pointerType !== 'mouse') return;
    const target = event.target.closest(tiltSelector);
    if (target !== tilted) resetTilt();
    if (!target) return;
    tilted = target;
    const r = target.getBoundingClientRect();
    target.style.setProperty('--tilt-x', `${Math.max(-5, Math.min(5, (0.5 - (event.clientY - r.top) / r.height) * 10))}deg`);
    target.style.setProperty('--tilt-y', `${Math.max(-5, Math.min(5, ((event.clientX - r.left) / r.width - .5) * 10))}deg`);
  }, { passive: true });
  document.addEventListener('pointerout', event => { if (tilted && !tilted.contains(event.relatedTarget)) resetTilt(); });
  window.addEventListener('blur', resetTilt);

  // Animate visible content once; it remains readable without observers or motion support.
  const animations = new Set();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (reduced.matches || !entry.target.animate) continue;
        const animation = entry.target.animate([
          { opacity: .25, translate: '0 24px' }, { opacity: 1, translate: '0 0' }
        ], { duration: 850, easing: 'cubic-bezier(.2,.65,.25,1)' });
        animations.add(animation);
        animation.finished.catch(() => {}).finally(() => animations.delete(animation));
      }
    }, { threshold: .12 });
    document.querySelectorAll('.section-heading, .welcome-section, .ornament, .story-art, .keepsake-scene').forEach(node => observer.observe(node));
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) { resetTilt(); animations.forEach(animation => animation.cancel()); }
  });
};
