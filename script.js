/* Just Good Grips — site JS */

// ── Announcement bar copy button ───────────────────────────────────────────
function copyCode(btn) {
  navigator.clipboard.writeText('FREESHIP26').then(function () {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = 'FREESHIP26';
      btn.classList.remove('copied');
    }, 2000);
  });
}

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

  // ── PRODUCT MODAL ─────────────────────────────────────────────────────────
  const modal          = document.getElementById('productModal');
  const modalBackdrop  = document.getElementById('modalBackdrop');
  const modalClose     = document.getElementById('modalClose');
  const openBtn        = document.getElementById('openProductModal');
  const mainImg        = document.getElementById('modalMainImg');
  const mainPlaceholder = document.getElementById('modalMainPlaceholder');
  const thumbsWrap     = document.getElementById('modalThumbs');

  const openImgBtn = document.getElementById('openProductModalImg');

  if (modal && openBtn) {
    const thumbBtns = Array.from(thumbsWrap.querySelectorAll('.modal-thumb'));

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      modalClose.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      openBtn.focus();
    }

    function activateThumb(btn) {
      const src = btn.dataset.src;
      const alt = btn.dataset.alt;
      thumbBtns.forEach(t => t.classList.remove('is-active'));
      btn.classList.add('is-active');

      if (!src) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.hidden = true;
          mainPlaceholder.hidden = false;
        }, 220);
        return;
      }

      mainPlaceholder.hidden = true;
      mainImg.hidden = false;
      mainImg.style.opacity = '0';

      const preload = new Image();
      preload.onload = preload.onerror = () => {
        mainImg.src = src;
        mainImg.alt = alt;
        mainImg.style.opacity = '1';
      };
      preload.src = src;
    }

    openBtn.addEventListener('click', openModal);
    if (openImgBtn) openImgBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    thumbBtns.forEach(btn => btn.addEventListener('click', () => activateThumb(btn)));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    // initialise first thumb as active
    if (thumbBtns.length) activateThumb(thumbBtns[0]);
  }

  // ── REVIEW CAROUSEL ───────────────────────────────────────────────────────
  const track    = document.getElementById('reviewTrack');
  const dotsWrap = document.getElementById('reviewDots');
  const prevBtn  = document.getElementById('reviewPrev');
  const nextBtn  = document.getElementById('reviewNext');

  if (!track) return;

  const cards     = Array.from(track.querySelectorAll('.review-card'));
  const total     = cards.length;
  let   current   = 0;
  let   autoTimer = null;
  const AUTO_MS   = 4800;
  const SWIPE_MIN = 40;

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

  const outer = track.closest('.carousel-outer');
  if (outer) {
    outer.addEventListener('mouseenter', stopAuto);
    outer.addEventListener('mouseleave', startAuto);
    outer.addEventListener('focusin',    stopAuto);
    outer.addEventListener('focusout',   startAuto);
  }

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

  document.addEventListener('keydown', e => {
    if (!document.getElementById('reviews')?.contains(document.activeElement)) return;
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  });

  startAuto();

})();
