'use strict';
window.setupInvitationOpening = preview => {
  const cover = document.querySelector('#invitation-cover');
  const open = document.querySelector('#open-invitation');
  const finish = () => { if (cover.open) cover.close(); };
  open.addEventListener('click', () => {
    if (open.disabled) return;
    open.disabled = true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    cover.classList.add('is-opening');
    document.body.classList.add('invitation-opening');
    // Follow the actual animation, including cancellation when motion preferences change.
    const animation = cover.getAnimations().find(item => item.animationName === 'cover-dismiss');
    if (animation) animation.finished.then(finish, finish);
    else finish();
  });
  cover.addEventListener('close', () => {
    cover.classList.remove('is-opening');
    document.body.classList.remove('invitation-opening');
    document.querySelector('#main').focus({ preventScroll: true });
  });
  // Deep links and editor previews go straight to the requested details.
  if (!preview && !location.hash && typeof cover.showModal === 'function') cover.showModal();
};
