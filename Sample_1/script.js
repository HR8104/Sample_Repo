/* ============================================
   ARIA CHEN — Portfolio Script
   ============================================ */

'use strict';

// ============================================================
// 1. CUSTOM CURSOR
// ============================================================
(function initCursor() {
  const dot     = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth outline follow
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.left = outlineX + 'px';
    outline.style.top  = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover effect on interactive elements
  const interactiveEls = 'a, button, .feed-item, .service-card, .case-card, input, textarea';
  document.querySelectorAll(interactiveEls).forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
  });
})();


// ============================================================
// 2. NAVBAR — scroll + hamburger
// ============================================================
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
})();


// ============================================================
// 3. DARK / LIGHT THEME TOGGLE
// ============================================================
(function initTheme() {
  const btn   = document.getElementById('themeToggle');
  const icon  = document.getElementById('theme-icon');
  const html  = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', theme);
  }

  applyTheme(saved);

  btn.addEventListener('click', () => {
    applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
  });
})();


// ============================================================
// 4. INTERSECTION OBSERVER — SCROLL ANIMATIONS
// ============================================================
(function initScrollAnimations() {
  // Small delay so hero renders first, then we enable scroll FX on rest
  setTimeout(() => {
    document.body.classList.add('anim-ready');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    // Only animate elements outside the hero section
    document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
      if (!el.closest('.hero')) observer.observe(el);
    });
  }, 120);
})();


// ============================================================
// 5. INSTAGRAM FEED GRID — dynamic injection with lazy load
// ============================================================
(function initFeedGrid() {
  const grid = document.getElementById('feedGrid');
  if (!grid) return;

  // Sample feed data
  const posts = [
    { src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=400&fit=crop', likes: '42.1K', comments: '384' },
    { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop', likes: '38.7K', comments: '291' },
    { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop', likes: '55.2K', comments: '512' },
    { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop', likes: '61.4K', comments: '673' },
    { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop', likes: '47.8K', comments: '405' },
    { src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop', likes: '33.9K', comments: '227' },
    { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', likes: '28.5K', comments: '198' },
    { src: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop', likes: '51.3K', comments: '447' },
  ];

  posts.forEach(post => {
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
      <img src="${post.src}" alt="Instagram post" loading="lazy" />
      <div class="feed-overlay">
        <span><i class="fas fa-heart"></i> ${post.likes}</span>
        <span><i class="fas fa-comment"></i> ${post.comments}</span>
      </div>
    `;
    item.addEventListener('click', () => window.open('https://instagram.com', '_blank'));
    grid.appendChild(item);
  });
})();


// ============================================================
// 6. ANIMATED COUNTERS
// ============================================================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-value[data-target]');
  if (!counters.length) return;

  function formatNumber(num, isDecimal, target) {
    if (isDecimal) return num.toFixed(1);
    if (target >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    return Math.round(num).toLocaleString();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el        = entry.target;
      const target    = parseFloat(el.dataset.target);
      const isDecimal = el.dataset.decimal === '1';
      const duration  = 2000;
      const start     = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatNumber(eased * target, isDecimal, target);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


// ============================================================
// 7. SWIPER TESTIMONIALS
// ============================================================
(function initSwiper() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    effect: 'fade',
    fadeEffect: { crossFade: true },
  });
})();


// ============================================================
// 8. GSAP SCROLL ANIMATIONS (parallax only — hero is always visible)
// ============================================================
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero orb parallax (purely decorative, doesn't affect visibility)
  gsap.to('.orb-1', {
    scrollTrigger: { trigger: '.hero', scrub: 1 },
    y: -120, x: 40,
  });
  gsap.to('.orb-2', {
    scrollTrigger: { trigger: '.hero', scrub: 1 },
    y: 80, x: -30,
  });
})();


// ============================================================
// 9. CONTACT FORM VALIDATION
// ============================================================
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  function showError(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errorId);
    if (!input || !err) return;
    input.classList.add('error');
    err.textContent = msg;
  }

  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errorId);
    if (!input || !err) return;
    input.classList.remove('error');
    err.textContent = '';
  }

  // Real-time validation
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearError(id, id + 'Error'));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    // Name validation
    if (!name.value.trim()) {
      showError('name', 'nameError', 'Please enter your name.');
      valid = false;
    } else {
      clearError('name', 'nameError');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError('email', 'emailError', 'Please enter your email address.');
      valid = false;
    } else if (!emailRegex.test(email.value.trim())) {
      showError('email', 'emailError', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('email', 'emailError');
    }

    // Message validation
    if (!message.value.trim() || message.value.trim().length < 20) {
      showError('message', 'messageError', 'Please enter a message (at least 20 characters).');
      valid = false;
    } else {
      clearError('message', 'messageError');
    }

    if (!valid) return;

    // Simulate submission
    const btn = form.querySelector('.btn-primary');
    const txt = btn.querySelector('.btn-text');
    btn.disabled = true;
    txt.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      txt.textContent = 'Send Message';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1500);
  });
})();


// ============================================================
// 10. IMAGE LAZY LOADING (native + fallback)
// ============================================================
(function initLazyImages() {
  // Native loading="lazy" handles most; add intersection fallback for older browsers
  if ('loading' in HTMLImageElement.prototype) return;

  const images = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        io.unobserve(img);
      }
    });
  });
  images.forEach(img => io.observe(img));
})();


// ============================================================
// 11. SMOOTH SCROLL for in-page anchors
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
