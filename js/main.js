/**
 * ═══════════════════════════════════════════════════════════════
 * CYBERFORGE — OFFICIAL EVENT WEBSITE RUNTIME
 * Design: Developer's Drive / ACM-26 Theme
 * Clean, lightweight, aligned & event-focused
 * ═══════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. SCROLL PROGRESS & NAVBAR STICKY EFFECT
  ───────────────────────────────────────────────────────────── */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.transform = `scaleX(${progress})`;
    }

    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    updateActiveNav();
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     2. NAVIGATION ACTIVE PILL TRACKING & MOBILE DRAWER
  ───────────────────────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-pill-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavClose = document.getElementById('mobileNavClose');

  function updateActiveNav() {
    let currentId = 'home';
    const scrollPos = window.scrollY + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const target = link.getAttribute('data-target') || link.getAttribute('href')?.replace('#', '');
      if (target === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  if (mobileToggle && mobileNavOverlay) {
    mobileToggle.addEventListener('click', () => {
      mobileNavOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMobileNav() {
    if (mobileNavOverlay) {
      mobileNavOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ─────────────────────────────────────────────────────────────
     3. CYBER PARTICLE BACKGROUND CANVAS (NON-BLOCKING)
  ───────────────────────────────────────────────────────────── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor((width * height) / 14000), 55);

    for (let i = 0; i < count; i++) {
      const isThreat = Math.random() < 0.25;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        isThreat: isThreat,
        color: isThreat ? 'rgba(255, 51, 75, ' : 'rgba(97, 217, 248, ',
        baseAlpha: Math.random() * 0.35 + 0.25
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = (particles[i].isThreat || particles[j].isThreat)
              ? `rgba(255, 51, 75, ${alpha * 0.7})`
              : `rgba(97, 217, 248, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.baseAlpha + ')';
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* ─────────────────────────────────────────────────────────────
     4. SCHEDULE TABS (DAY 1 vs DAY 2)
  ───────────────────────────────────────────────────────────── */
  const schedTabs = document.querySelectorAll('.sched-tab-btn');
  const schedPanes = document.querySelectorAll('.sched-pane');

  schedTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      schedTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      schedPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  /* ─────────────────────────────────────────────────────────────
     5. FAQ ACCORDION INTERACTIVITY
  ───────────────────────────────────────────────────────────── */
  const faqBoxes = document.querySelectorAll('.faq-box');

  faqBoxes.forEach(box => {
    const trigger = box.querySelector('.faq-trigger');
    const content = box.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = box.classList.contains('open');

        faqBoxes.forEach(other => {
          if (other !== box) {
            other.classList.remove('open');
            const otherContent = other.querySelector('.faq-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });

        if (isOpen) {
          box.classList.remove('open');
          content.style.maxHeight = null;
        } else {
          box.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

});
