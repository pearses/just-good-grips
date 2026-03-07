/* Just Good Grips — site JS */

(function () {
  'use strict';

  // ── Smooth scroll ─────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── REVIEW CAROUSEL ───────────────────────────────────────────────────────
  const track    = document.getElementById('reviewTrack');
  const dotsWrap = document.getElementById('reviewDots');
  const prevBtn  = document.getElementById('reviewPrev');
  const nextBtn  = document.getElementById('reviewNext');

  if (!track) return; // bail if reviews section is absent

  const cards     = Array.from(track.querySelectorAll('.review-card'));
  const total     = cards.length;
  let   current   = 0;
  let   autoTimer = null;
  const AUTO_MS   = 4800;
  const SWIPE_MIN = 40;

  // Build dot indicators
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Review ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), AUTO_MS); }
  function stopAuto()  { clearInterval(autoTimer); autoTimer = null; }
  function resetAuto() { stopAuto(); startAuto(); }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // Pause on hover / focus
  const outer = track.closest('.carousel-outer');
  if (outer) {
    outer.addEventListener('mouseenter', stopAuto);
    outer.addEventListener('mouseleave', startAuto);
    outer.addEventListener('focusin',    stopAuto);
    outer.addEventListener('focusout',   startAuto);
  }

  // Touch / swipe support
  let touchStartX = 0;
  let touchStartY = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) {
      goTo(dx < 0 ? current + 1 : current - 1);
    }
    startAuto();
  }, { passive: true });

  // Keyboard navigation when carousel is focused
  document.addEventListener('keydown', e => {
    if (!document.getElementById('reviews')?.contains(document.activeElement)) return;
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  });

  startAuto();

})();
