/* ==============================================
   RENDERER — Pure functions: YAML data → DOM
   ============================================== */

// === DRY Helpers ===

function el(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function renderTags(tags) {
  const container = el('div', 'tags');
  tags.forEach(tag => container.appendChild(el('span', 'tag', tag)));
  return container;
}

// Social platform SVG icons (inline to avoid extra network requests)
const socialIcons = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>'
};

const linkIcons = {
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
};

// === Section Renderers ===

function renderHero(profile, social) {
  const container = document.getElementById('hero-content');

  // Profile photo (left column on desktop)
  if (profile.photo) {
    const photoWrapper = el('div', 'hero__photo');
    const img = document.createElement('img');
    img.src = profile.photo;
    img.alt = profile.name;
    photoWrapper.appendChild(img);
    container.appendChild(photoWrapper);
  }

  // Text content (right column on desktop)
  const textWrapper = el('div', 'hero__text');

  const greeting = el('p', 'hero__greeting', profile.greeting);
  const name = el('h1', 'hero__name', profile.name);
  name.id = 'about-heading';

  const title = el('p', 'hero__title');
  title.innerHTML = `${profile.title} at <span>${profile.company}</span> · ${profile.location}`;

  const bio = el('p', 'hero__bio', profile.bio);

  const typing = el('div', 'hero__typing');
  typing.innerHTML = `<span id="typing-text"></span><span class="typing-cursor"></span>`;

  const socialDiv = el('div', 'hero__social');
  social.forEach(s => {
    const a = document.createElement('a');
    a.href = s.url;
    a.className = 'social-link';
    a.target = s.platform === 'email' ? '_self' : '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', s.platform);
    a.innerHTML = socialIcons[s.platform] || '';
    socialDiv.appendChild(a);
  });

  [greeting, name, title, bio, typing, socialDiv].forEach(child => {
    textWrapper.appendChild(child);
  });
  container.appendChild(textWrapper);

  // Start typing animation
  startTyping(profile.typing_phrases);
}

function startTyping(phrases) {
  const textEl = document.getElementById('typing-text');
  if (!textEl || !phrases.length) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const phrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      textEl.textContent = phrase.substring(0, charIndex);
    } else {
      charIndex++;
      textEl.textContent = phrase.substring(0, charIndex);
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === phrase.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 1000);
}

function renderTechStack(techstack) {
  const container = document.getElementById('techstack-content');

  techstack.forEach((category, catIdx) => {
    const group = el('div', 'techstack-category animate-on-scroll');
    group.style.setProperty('--delay', `${catIdx * 0.1}s`);

    group.appendChild(el('h3', 'techstack-category__title', category.category));

    const grid = el('div', 'icon-grid');
    category.items.forEach((item, idx) => {
      const itemDiv = el('div', 'icon-grid__item');

      const img = document.createElement('img');
      img.src = `assets/${item.icon}`;
      img.alt = item.name;
      img.loading = 'lazy';
      img.width = 36;
      img.height = 36;
      if (item.invert_in_dark) img.classList.add('icon--invert');

      itemDiv.appendChild(img);
      itemDiv.appendChild(el('span', null, item.name));
      grid.appendChild(itemDiv);
    });

    group.appendChild(grid);
    container.appendChild(group);
  });
}

function renderExperience(experience) {
  const container = document.getElementById('experience-content');

  experience.forEach((exp, idx) => {
    const item = el('div', 'timeline__item animate-on-scroll');
    item.style.setProperty('--delay', `${idx * 0.1}s`);

    const card = el('div', 'timeline__card');

    const header = el('div', 'timeline__header');
    header.appendChild(el('h3', 'timeline__role', exp.role));
    header.appendChild(el('p', 'timeline__company', exp.company));
    card.appendChild(header);

    const meta = el('div', 'timeline__meta');
    meta.appendChild(el('span', null, exp.period));
    meta.appendChild(el('span', null, exp.location));
    card.appendChild(meta);

    card.appendChild(el('p', 'timeline__description', exp.description));

    if (exp.highlights && exp.highlights.length) {
      const ul = el('ul', 'timeline__highlights');
      exp.highlights.forEach(h => ul.appendChild(el('li', null, h)));
      card.appendChild(ul);
    }

    if (exp.tags && exp.tags.length) {
      card.appendChild(renderTags(exp.tags));
    }

    item.appendChild(card);
    container.appendChild(item);
  });
}

function renderEducation(education) {
  const container = document.getElementById('education-content');

  education.forEach(edu => {
    const card = el('div', 'education-card animate-on-scroll');

    card.appendChild(el('h3', 'education-card__degree', edu.degree));
    card.appendChild(el('p', 'education-card__institution', edu.institution));
    card.appendChild(el('p', 'education-card__meta', edu.period));
    card.appendChild(el('p', 'education-card__gpa', edu.gpa));

    if (edu.highlights && edu.highlights.length) {
      const ul = el('ul', 'education-card__highlights');
      edu.highlights.forEach(h => ul.appendChild(el('li', null, h)));
      card.appendChild(ul);
    }

    container.appendChild(card);
  });
}

function renderProjects(projects) {
  const container = document.getElementById('projects-content');

  projects.forEach((project, idx) => {
    const card = el('div', 'card animate-on-scroll');
    card.style.setProperty('--delay', `${idx * 0.08}s`);

    card.appendChild(el('h3', 'card__title', project.name));
    card.appendChild(el('p', 'card__description', project.description));

    const footer = el('div', 'card__footer');
    if (project.tags && project.tags.length) {
      footer.appendChild(renderTags(project.tags));
    }

    const links = el('div', 'card__links');
    if (project.github) {
      const a = document.createElement('a');
      a.href = project.github;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', `${project.name} on GitHub`);
      a.innerHTML = linkIcons.github;
      links.appendChild(a);
    }
    if (project.live) {
      const a = document.createElement('a');
      a.href = project.live;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', `${project.name} live demo`);
      a.innerHTML = linkIcons.external;
      links.appendChild(a);
    }
    if (links.children.length) footer.appendChild(links);

    card.appendChild(footer);
    container.appendChild(card);
  });
}

function renderResearch(research) {
  const container = document.getElementById('research-content');

  research.forEach((item, idx) => {
    const card = el('div', 'card animate-on-scroll');
    card.style.setProperty('--delay', `${idx * 0.08}s`);

    card.appendChild(el('h3', 'card__title', item.title));
    card.appendChild(el('p', 'card__subtitle', `${item.venue} · ${item.year}`));
    card.appendChild(el('p', 'card__description', item.description));

    const footer = el('div', 'card__footer');
    if (item.tags && item.tags.length) {
      footer.appendChild(renderTags(item.tags));
    }
    card.appendChild(footer);

    container.appendChild(card);
  });
}

function renderAchievements(achievements) {
  const container = document.getElementById('achievements-content');
  const grid = el('div', 'achievements-grid');

  achievements.forEach((item, idx) => {
    const row = el('div', 'achievement-item animate-on-scroll');
    row.style.setProperty('--delay', `${idx * 0.08}s`);

    const iconDiv = el('div', 'achievement-item__icon');
    const iconImg = document.createElement('img');
    iconImg.src = `assets/${item.icon}`;
    iconImg.alt = item.title;
    iconImg.loading = 'lazy';
    if (item.invert_in_dark) iconImg.classList.add('icon--invert');
    iconDiv.appendChild(iconImg);

    const content = el('div', 'achievement-item__content');
    content.appendChild(el('h4', 'achievement-item__title', item.title));
    content.appendChild(el('p', 'achievement-item__year', item.year));
    content.appendChild(el('p', 'achievement-item__description', item.description));

    row.appendChild(iconDiv);
    row.appendChild(content);
    grid.appendChild(row);
  });

  container.appendChild(grid);
}

function renderContact(contact, social) {
  const container = document.getElementById('contact-content');
  const wrapper = el('div', 'contact-content');

  wrapper.appendChild(el('p', 'contact-content__description', contact.description));

  const emailLink = document.createElement('a');
  emailLink.href = `mailto:${contact.email}`;
  emailLink.className = 'contact-content__email';
  emailLink.innerHTML = `${socialIcons.email} Say Hello`;
  wrapper.appendChild(emailLink);

  const socialDiv = el('div', 'contact-content__social');
  social.forEach(s => {
    const a = document.createElement('a');
    a.href = s.url;
    a.className = 'social-link';
    a.target = s.platform === 'email' ? '_self' : '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', s.platform);
    a.innerHTML = socialIcons[s.platform] || '';
    socialDiv.appendChild(a);
  });
  wrapper.appendChild(socialDiv);

  container.appendChild(wrapper);
}

// === Public API ===

export function renderAll(data) {
  renderHero(data.profile, data.social);
  renderTechStack(data.techstack);
  renderExperience(data.experience);
  renderEducation(data.education);
  renderProjects(data.projects);
  renderResearch(data.research);
  renderAchievements(data.achievements);
  renderContact(data.contact, data.social);
}
