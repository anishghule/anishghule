import { loadYAML } from './yaml-loader.js';
import { renderAll } from './renderer.js';
import { initNavigation } from './navigation.js';
import { initTheme } from './theme.js';
import { initAnimations } from './animations.js';

async function init() {
  try {
    // 1. Theme first (prevents flash of wrong theme)
    initTheme();

    // 2. Load content
    const data = await loadYAML('data/content.yaml');

    // 3. Render all sections
    renderAll(data);

    // 4. Initialize navigation (depends on rendered nav items)
    initNavigation(data.nav);

    // 5. Initialize scroll animations (depends on rendered elements)
    initAnimations();

    // 6. Hide loading overlay
    document.getElementById('loading-overlay').classList.add('hidden');

    // 7. Footer year
    document.getElementById('year').textContent = new Date().getFullYear();

  } catch (error) {
    console.error('Failed to initialize portfolio:', error);
    const overlay = document.getElementById('loading-overlay');
    overlay.innerHTML = '<p style="color:var(--color-text-secondary)">Failed to load content. Please refresh the page.</p>';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
