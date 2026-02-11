export function initNavigation(navItems) {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  // --- Populate nav links ---
  const navLinksEl = document.getElementById('nav-links');
  navItems.forEach(item => {
    const li = document.createElement('li');
    li.setAttribute('role', 'none');
    const a = document.createElement('a');
    a.href = `#${item.id}`;
    a.textContent = item.label;
    a.setAttribute('role', 'menuitem');
    li.appendChild(a);
    navLinksEl.appendChild(li);
  });

  // --- Populate mobile menu ---
  navItems.forEach(item => {
    const a = document.createElement('a');
    a.href = `#${item.id}`;
    a.textContent = item.label;
    mobileMenu.appendChild(a);
  });

  // --- Hamburger toggle ---
  toggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('navbar--open');
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // --- Close mobile menu on link click ---
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navbar.classList.remove('navbar--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // --- Close mobile menu on outside click ---
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('navbar--open') &&
        !navbar.contains(e.target)) {
      navbar.classList.remove('navbar--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // --- Smooth scroll with offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Navbar background on scroll ---
  const onScroll = () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Scroll spy ---
  const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
  const allNavLinks = [...navLinksEl.querySelectorAll('a'), ...mobileMenu.querySelectorAll('a')];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -75% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}
