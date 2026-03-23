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

    // ── IMAGE LIGHTBOX ───────────────────────────────────────────────────────
    const lightbox        = document.getElementById('imgLightbox');
    const lightboxImg     = document.getElementById('lightboxImg');
    const lightboxClose   = document.getElementById('lightboxClose');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const lightboxPrev    = document.getElementById('lightboxPrev');
    const lightboxNext    = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const mainImgWrap     = mainImg.closest('.modal-main-img-wrap');

    // Only show arrows if there are multiple images
    let lightboxIndex = 0;

    function getLightboxSrcs() {
      return thumbBtns
        .filter(b => b.dataset.src)
        .map(b => ({ src: b.dataset.src, alt: b.dataset.alt || '' }));
    }

    function openLightbox(index) {
      const srcs = getLightboxSrcs();
      if (!srcs.length) return;
      lightboxIndex = ((index % srcs.length) + srcs.length) % srcs.length;
      lightboxImg.src = srcs[lightboxIndex].src;
      lightboxImg.alt = srcs[lightboxIndex].alt;
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${srcs.length}`;
      // Hide arrows when only one image
      const multi = srcs.length > 1;
      lightboxPrev.hidden = !multi;
      lightboxNext.hidden = !multi;
      lightboxCounter.hidden = !multi;
      lightbox.hidden = false;
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      mainImg.focus();
    }

    function lightboxNavigate(dir) {
      const srcs = getLightboxSrcs();
      lightboxIndex = ((lightboxIndex + dir) + srcs.length) % srcs.length;
      // Animate out then swap
      lightboxImg.style.animation = 'none';
      lightboxImg.src = srcs[lightboxIndex].src;
      lightboxImg.alt = srcs[lightboxIndex].alt;
      // Force reflow to restart animation
      void lightboxImg.offsetWidth;
      lightboxImg.style.animation = '';
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${srcs.length}`;
      // Sync the modal thumbnail highlight
      const activeThumb = thumbBtns.filter(b => b.dataset.src)[lightboxIndex];
      if (activeThumb) activateThumb(activeThumb);
    }

    // Open lightbox on main image click
    mainImgWrap.addEventListener('click', () => {
      const srcs = getLightboxSrcs();
      const currentSrc = mainImg.src;
      const idx = srcs.findIndex(s => currentSrc.includes(s.src.split('/').pop()));
      openLightbox(idx >= 0 ? idx : 0);
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => lightboxNavigate(-1));
    lightboxNext.addEventListener('click', () => lightboxNavigate(1));

    document.addEventListener('keydown', e => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  lightboxNavigate(-1);
      if (e.key === 'ArrowRight') lightboxNavigate(1);
    });

    // Swipe to navigate on touch devices
    let lbTouchX = 0;
    lightbox.addEventListener('touchstart', e => {
      lbTouchX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - lbTouchX;
      if (Math.abs(dx) > 40) lightboxNavigate(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

})();

// ── REVIEW CAROUSEL ───────────────────────────────────────────────────────
async function initReviewCarousel() {
  const track    = document.getElementById('reviewTrack');
  const dotsWrap = document.getElementById('reviewDots');
  const prevBtn  = document.getElementById('reviewPrev');
  const nextBtn  = document.getElementById('reviewNext');

  if (!track) return;

  // Load and shuffle reviews
  let reviews = [];
  try {
    const res = await fetch('reviews.json');
    reviews = await res.json();
    for (let i = reviews.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [reviews[i], reviews[j]] = [reviews[j], reviews[i]];
    }
  } catch (e) {
    return;
  }

  // Build cards — cap at 5 random, then a "+" card linking to /reviews
  const shown = reviews.slice(0, 5);
  track.innerHTML = shown.map(r => `
    <div class="review-card">
      <div class="stars">${'★'.repeat(r.stars || 5)}</div>
      <p class="review-title">${r.title}</p>
      <p class="review-text">"${r.text}"</p>
      <p class="review-author">${r.author}</p>
      <img src="images/grip-pack-12-white.webp" alt="12 Pack" class="review-thumb" onerror="this.style.display='none'">
    </div>
  `).join('') + `
    <div class="review-card review-card--more">
      <a href="/reviews" class="review-more-link" aria-label="See all reviews">
        <span class="review-more-plus">+</span>
        <span class="review-more-label">See all reviews</span>
      </a>
    </div>
  `;

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
}

initReviewCarousel();

// ── REVIEW SUBMISSION MODAL ───────────────────────────────────────────────
(function () {
  const reviewModal    = document.getElementById('reviewModal');
  const reviewBackdrop = document.getElementById('reviewModalBackdrop');
  const reviewClose    = document.getElementById('reviewModalClose');
  const openBtn        = document.getElementById('openReviewModal');
  const reviewForm     = document.getElementById('reviewForm');
  const successMsg     = document.getElementById('reviewFormSuccess');

  if (!reviewModal || !openBtn) return;

  function openReviewModal() {
    reviewModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    reviewClose.focus();
  }

  function closeReviewModal() {
    reviewModal.classList.remove('is-open');
    document.body.style.overflow = '';
    openBtn.focus();
  }

  openBtn.addEventListener('click', openReviewModal);
  reviewClose.addEventListener('click', closeReviewModal);
  reviewBackdrop.addEventListener('click', closeReviewModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !reviewModal.hidden) closeReviewModal();
  });

  reviewForm.addEventListener('submit', async e => {
    e.preventDefault();
    const res = await fetch(reviewForm.action, {
      method: 'POST',
      body: new FormData(reviewForm),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      reviewForm.hidden = true;
      successMsg.hidden = false;
    } else {
      alert('Something went wrong — please email us directly at contact@justgoodgrips.com');
    }
  });
})();
