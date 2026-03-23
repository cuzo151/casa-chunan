/* ══════════════════ CASA CHUNAN — script.js ══════════════════ */
(function () {
  'use strict';

  /* ── NAV: scroll-aware glass darkening ── */
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 70);
  }, { passive: true });

  /* ── VIDEO HERO: fallback to image if video fails ── */
  const video   = document.getElementById('hero-video');
  const fallback = document.getElementById('hero-fallback-img');

  if (video) {
    // Show fallback if video can't load/play
    const showFallback = () => fallback && fallback.classList.add('show');

    video.addEventListener('error', showFallback);
    video.addEventListener('stalled', showFallback);

    // If video takes > 4s to start, show fallback
    const videoTimeout = setTimeout(showFallback, 4000);
    video.addEventListener('playing', () => clearTimeout(videoTimeout));

    // Pause/resume video based on tab visibility (performance)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    });
  }

  /* ── MOBILE MENU ── */
  const hamburger   = document.getElementById('hamburger');
  const menuOverlay = document.getElementById('menu-overlay');
  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    menuOverlay.classList.toggle('open', menuOpen);
    menuOverlay.setAttribute('aria-hidden', String(!menuOpen));
    hamburger.setAttribute('aria-expanded', String(menuOpen));
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  menuOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { if (menuOpen) toggleMenu(); });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) toggleMenu();
  });

  /* ── SCROLL REVEAL (IntersectionObserver — no layout reflows) ── */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── ACTIVE NAV HIGHLIGHT on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => navObserver.observe(s));

  /* ── GALLERY: accessible role attributes ── */
  document.querySelectorAll('.gallery-cell').forEach(cell => {
    const img = cell.querySelector('img');
    if (img) {
      cell.setAttribute('role', 'img');
      cell.setAttribute('aria-label', img.getAttribute('alt') || '');
    }
  });

})();
