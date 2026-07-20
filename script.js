/* ==========================================================================
   V. Mutharasi — Portfolio interactions
   Theme state is kept in memory only (no localStorage), so it resets on
   reload — swap in localStorage yourself if hosting outside this preview.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------- Preloader ---------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), 400);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => preloader.classList.add('done'), 2200);

  /* ---------------------------- Theme toggle ---------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  let isDark = true;

  const applyTheme = () => {
    if (isDark) {
      root.removeAttribute('data-theme');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    } else {
      root.setAttribute('data-theme', 'light');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  };

  // Respect system preference on first load
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    isDark = false;
  }
  applyTheme();

  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    applyTheme();
  });

  /* ---------------------------- Navbar scroll state ---------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    scrollTopBtn.classList.toggle('visible', y > 500);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------- Mobile menu ---------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------------------------- Active link on scroll ---------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const linkMap = {};
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    linkMap[link.getAttribute('href').replace('#', '')] = link;
  });

  function updateActiveLink() {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });

    Object.values(linkMap).forEach(l => l.classList.remove('active-link'));
    if (linkMap[currentId]) linkMap[currentId].classList.add('active-link');
  }

  /* ---------------------------- Typing animation ---------------------------- */
  const typeTarget = document.getElementById('typeTarget');
  const phrases = [
    'Computer Science Student',
    'UI/UX Designer',
    'Frontend Developer',
    'Problem Solver'
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      typeTarget.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typeTarget.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }
  typeLoop();

  /* ---------------------------- Scroll reveal ---------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------- Skill bar animation ---------------------------- */
  const skillFills = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillFills.forEach(el => skillObserver.observe(el));

  /* ---------------------------- Counter animation ---------------------------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const isYear = target > 100;
      let current = 0;
      const duration = 1200;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = target / steps;

      const tick = () => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
        } else {
          el.textContent = Math.floor(current);
          requestAnimationFrame(() => setTimeout(tick, stepTime));
        }
      };
      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------------------------- Cursor glow ---------------------------- */
  const glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
  }

  /* ---------------------------- Resume button ---------------------------- */
  const resumeBtn = document.getElementById('resumeBtn');
  resumeBtn.addEventListener('click', (e) => {
    // Swap the href to an actual resume file (e.g. "assets/Mutharasi_Resume.pdf") once available.
    if (resumeBtn.getAttribute('href') === '#') {
      e.preventDefault();
      showToast('Resume file not linked yet — add it at assets/resume.pdf');
    }
  });

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
      Object.assign(toast.style, {
        position: 'fixed', bottom: '90px', right: '28px',
        background: 'var(--surface-strong)', border: '1px solid var(--border)',
        color: 'var(--text)', padding: '14px 20px', borderRadius: '12px',
        fontSize: '.85rem', zIndex: 600, backdropFilter: 'blur(12px)',
        boxShadow: 'var(--shadow-lg)', maxWidth: '260px',
        opacity: '0', transform: 'translateY(10px)',
        transition: 'opacity .35s ease, transform .35s ease'
      });
    }
    toast.textContent = message;
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 3200);
  }

  /* ---------------------------- Contact form ---------------------------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();

    // No backend wired up — this just confirms the message locally.
    // Connect this to a form service (Formspree, EmailJS, etc.) or your own
    // backend to actually deliver messages to mutharasikpr2006@gmail.com.
    formStatus.textContent = `Thanks${name ? ', ' + name : ''}! Your message is ready — connect a form service to deliver it.`;
    form.reset();
  });

  /* ---------------------------- Footer year ---------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
