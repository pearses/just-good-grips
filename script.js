/* Just Good Grips – site JS */

(function () {
  'use strict';

  // ── Sticky header shadow ──────────────────────────────────────────────────
  const header = document.getElementById('header');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile nav toggle ─────────────────────────────────────────────────────
  const toggle   = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on any mobile-nav link click
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Smooth-scroll nav links ───────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Buy-Now placeholder guard ─────────────────────────────────────────────
  // Warn in console if Stripe links haven't been updated yet.
  document.querySelectorAll('.btn-buy').forEach(btn => {
    const href = btn.getAttribute('href') || '';
    if (href.startsWith('YOUR_STRIPE')) {
      btn.addEventListener('click', e => {
        e.preventDefault();
        // In production replace href with your Stripe Payment Link.
        // e.g. https://buy.stripe.com/test_xxxx
        alert('Stripe payment link not yet configured.\nReplace the href on this button with your Stripe Payment Link URL.');
      });
    }
  });

})();
