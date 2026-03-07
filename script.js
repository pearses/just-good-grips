/* Just Good Grips — site JS */

(function () {
  'use strict';

  // ── Sticky header shadow ──────────────────────────────────────────────────
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile nav toggle ─────────────────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Smooth scroll ─────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Stripe link placeholder guard ─────────────────────────────────────────
  document.querySelectorAll('[href^="YOUR_STRIPE"]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      alert(
        'Stripe payment link not yet configured.\n' +
        'Replace the href value with your Stripe Payment Link URL.\n' +
        'Create one at: https://dashboard.stripe.com/payment-links'
      );
    });
  });

  // ── REVIEW CAROUSEL ───────────────────────────────────────────────────────
  const track      = document.getElementById('reviewTrack');
  const dotsWrap   = document.getElementById('reviewDots');
  const prevBtn    = document.getElementById('reviewPrev');
  const nextBtn    = document.getElementById('reviewNext');

  if (!track) return; // bail if reviews section is absent

  const cards       = Array.from(track.querySelectorAll('.review-card'));
  const total       = cards.length;
  let   current     = 0;
  let   autoTimer   = null;
  const AUTO_MS     = 4800;
  const SWIPE_MIN   = 40;

  // Build dot indicators
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className    = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Review ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  });

  // Navigate to a specific slide
  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  // Auto-advance
  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), AUTO_MS);
  }
  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  function resetAuto() {
    stopAuto();
    startAuto();
  }

  // Arrow buttons
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

    // Only treat as horizontal swipe if dx dominates
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

  // Kick off
  startAuto();

})();
