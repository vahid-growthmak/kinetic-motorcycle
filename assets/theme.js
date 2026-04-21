/* ==========================================================================
   Kinetic Motorcycles — Base theme JS
   ========================================================================== */
(function () {
  'use strict';

  // --------- Sticky header shadow on scroll ---------
  const header = document.querySelector('[data-km-header]');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --------- Mobile menu toggle ---------
  const menuToggle = document.querySelector('[data-km-menu-toggle]');
  const menuPanel = document.querySelector('[data-km-menu]');
  if (menuToggle && menuPanel) {
    menuToggle.addEventListener('click', () => {
      const open = menuPanel.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // --------- Model chooser tabs ---------
  document.querySelectorAll('[data-km-tabs]').forEach((container) => {
    const tabs = container.querySelectorAll('[data-km-tab]');
    const panels = container.querySelectorAll('[data-km-panel]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.kmTab;
        tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.kmTab === id));
        panels.forEach((p) => p.classList.toggle('is-active', p.dataset.kmPanel === id));
      });
    });
  });

  // --------- Before/After slider ---------
  document.querySelectorAll('[data-km-compare]').forEach((el) => {
    const handle = el.querySelector('[data-km-compare-handle]');
    const after = el.querySelector('[data-km-compare-after]');
    if (!handle || !after) return;

    let rect;
    let dragging = false;
    const setPos = (x) => {
      const r = el.getBoundingClientRect();
      let pct = ((x - r.left) / r.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
    };
    const onMove = (e) => {
      if (!dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    };
    const onDown = (e) => {
      dragging = true;
      rect = el.getBoundingClientRect();
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    };
    const onUp = () => { dragging = false; };

    handle.addEventListener('mousedown', onDown);
    handle.addEventListener('touchstart', onDown, { passive: true });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);

    // Allow click anywhere on the image to move the slider
    el.addEventListener('click', (e) => {
      if (e.target === handle) return;
      const x = e.clientX;
      setPos(x);
    });

    // Initial position at 50%
    after.style.clipPath = 'inset(0 50% 0 0)';
    handle.style.left = '50%';
  });

  // --------- FAQ accordion ---------
  document.querySelectorAll('[data-km-faq]').forEach((item) => {
    const trigger = item.querySelector('[data-km-faq-trigger]');
    const panel = item.querySelector('[data-km-faq-panel]');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // --------- Reveal on scroll ---------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('km-in-view');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    document.querySelectorAll('[data-km-reveal]').forEach((el) => io.observe(el));
  }

  // --------- Horizontal carousel controls ---------
  document.querySelectorAll('[data-km-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-km-track]');
    const prev = carousel.querySelector('[data-km-prev]');
    const next = carousel.querySelector('[data-km-next]');
    if (!track) return;
    const scrollBy = (dir) => {
      const card = track.firstElementChild;
      const step = card ? card.getBoundingClientRect().width + 24 : 300;
      track.scrollBy({ left: dir * step, behavior: 'smooth' });
    };
    if (prev) prev.addEventListener('click', () => scrollBy(-1));
    if (next) next.addEventListener('click', () => scrollBy(1));
  });
})();
