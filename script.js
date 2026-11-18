// Accurate Window Cleaners — London Ontario (lead-gen demo)

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initMobileMenu();
  initFAQ();
  initQuoteForm();
  initBeforeAfterSlider();
  initGalleryTabs();
});

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  function openMenu() {
    menu.classList.remove('hidden');
    if (backdrop) backdrop.classList.remove('hidden');
    btn.setAttribute('aria-expanded', 'true');
    btn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
    if (window.lucide) lucide.createIcons();
    document.body.classList.add('overflow-hidden');
  }

  function closeMenu() {
    menu.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
    if (window.lucide) lucide.createIcons();
    document.body.classList.remove('overflow-hidden');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('hidden')) openMenu();
    else closeMenu();
  });

  if (backdrop) backdrop.addEventListener('click', closeMenu);
  links.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) closeMenu();
  });
}

function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      items.forEach((i) => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

function initQuoteForm() {
  const form = document.getElementById('quote-form');
  const success = document.getElementById('quote-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (success) {
      success.classList.remove('hidden');
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    form.reset();
  });
}

function initBeforeAfterSlider() {
  const container = document.getElementById('before-after-container');
  const beforeWrapper = document.getElementById('before-wrapper');
  const handle = document.getElementById('slider-handle');
  const hint = document.getElementById('slider-hint');
  if (!container || !beforeWrapper || !handle) return;

  let dragging = false;

  function setPosition(clientX) {
    const rect = container.getBoundingClientRect();
    if (!rect.width) return;
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    beforeWrapper.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = `${pct}%`;
    handle.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  function startDrag(clientX) {
    dragging = true;
    container.classList.add('is-dragging');
    if (hint) hint.classList.add('opacity-0');
    setPosition(clientX);
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    container.classList.remove('is-dragging');
  }

  container.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    container.setPointerCapture?.(e.pointerId);
    startDrag(e.clientX);
  });

  container.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    setPosition(e.clientX);
  });

  container.addEventListener('pointerup', endDrag);
  container.addEventListener('pointercancel', endDrag);
  window.addEventListener('pointerup', endDrag);

  // Keyboard accessibility
  handle.setAttribute('tabindex', '0');
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'Compare before and after');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', '50');

  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(handle.style.left) || 50;
    let next = current;
    if (e.key === 'ArrowLeft') next = current - 3;
    if (e.key === 'ArrowRight') next = current + 3;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = 100;
    if (next === current) return;
    e.preventDefault();
    next = Math.max(0, Math.min(100, next));
    beforeWrapper.style.clipPath = `inset(0 ${100 - next}% 0 0)`;
    handle.style.left = `${next}%`;
    handle.setAttribute('aria-valuenow', String(Math.round(next)));
  });
}

const GALLERY_SETS = {
  carpet: {
    before: 'images/before-after/carpet-before-messy.jpg',
    after: 'images/before-after/carpet-after-clean.jpg',
    beforeAlt: 'Stained living room carpet before cleaning',
    afterAlt: 'Professionally cleaned living room carpet',
    caption:
      '<strong>Carpet Deep Clean in Sahali:</strong> Same living room before and after — muddy footprints, spills, and traffic soil lifted with professional extraction.',
  },
  windows: {
    before: 'images/before-after/windows-before-dirty.jpg',
    after: 'images/before-after/windows-after-clean.jpg',
    beforeAlt: 'Hard-water spotted residential windows before cleaning',
    afterAlt: 'Clear residential windows after cleaning',
    caption:
      '<strong>Residential Window Cleaning in Aberdeen:</strong> Same view before and after — water spots and dusty film cleared for a streak-free finish.',
  },
  concrete: {
    before: 'images/before-after/concrete-before-dirty.jpg',
    after: 'images/before-after/concrete-after-clean.jpg',
    beforeAlt: 'Oil-stained driveway before pressure washing',
    afterAlt: 'Clean driveway after pressure washing',
    caption:
      '<strong>Driveway Pressure Washing in Valleyview:</strong> Same house angle before and after — oil spots and tire marks removed with pressure washing.',
  },
};

function initGalleryTabs() {
  const tabs = document.querySelectorAll('.gallery-tab-btn');
  const beforeImg = document.getElementById('before-image');
  const afterImg = document.getElementById('after-image');
  const caption = document.getElementById('gallery-caption');
  const beforeWrapper = document.getElementById('before-wrapper');
  const handle = document.getElementById('slider-handle');
  const hint = document.getElementById('slider-hint');
  if (!tabs.length || !beforeImg || !afterImg) return;

  function setActiveTab(tabKey) {
    const set = GALLERY_SETS[tabKey];
    if (!set) return;

    beforeImg.src = set.before;
    afterImg.src = set.after;
    beforeImg.alt = set.beforeAlt;
    afterImg.alt = set.afterAlt;
    if (caption) caption.innerHTML = set.caption;

    // Reset slider to center on tab change
    if (beforeWrapper) beforeWrapper.style.clipPath = 'inset(0 50% 0 0)';
    if (handle) {
      handle.style.left = '50%';
      handle.setAttribute('aria-valuenow', '50');
    }
    if (hint) hint.classList.remove('opacity-0');

    tabs.forEach((btn) => {
      const active = btn.getAttribute('data-tab') === tabKey;
      btn.classList.toggle('active', active);
      btn.classList.toggle('bg-brand-600', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('shadow-sm', active);
      btn.classList.toggle('bg-slate-100', !active);
      btn.classList.toggle('text-slate-700', !active);
      btn.classList.toggle('hover:bg-slate-200', !active);
    });
  }

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-tab');
      if (key) setActiveTab(key);
    });
  });

  // Preload other sets for snappy switches
  Object.values(GALLERY_SETS).forEach((set) => {
    [set.before, set.after].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  });
}
