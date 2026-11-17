// Accurate Window Cleaning Kamloops - Professional Interactive Script

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 2. Mobile Menu Toggle with Backdrop & Icon morph
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-menu-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    if (mobileBackdrop) mobileBackdrop.classList.remove('hidden');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileMenuBtn.innerHTML = '<i data-lucide="x" class="w-5 h-5 sm:w-6 sm:h-6 text-slate-800"></i>';
      if (window.lucide) lucide.createIcons();
    }
    document.body.classList.add('overflow-hidden');
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    if (mobileBackdrop) mobileBackdrop.classList.add('hidden');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-5 h-5 sm:w-6 sm:h-6 text-slate-700"></i>';
      if (window.lucide) lucide.createIcons();
    }
    document.body.classList.remove('overflow-hidden');
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        openMobileMenu();
      } else {
        closeMobileMenu();
      }
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', closeMobileMenu);
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
      }
    });
  }

  // 4. Interactive Before & After Slider (CSS clip-path)
  initBeforeAfterSlider();

  // 5. Gallery Tab Switcher
  initGalleryTabs();

  // 6. Interactive Estimate Calculator
  initEstimateCalculator();

  // 7. FAQ Accordion
  initFAQAccordion();

  // 8. Live Social Proof Toast
  initLiveSocialProofToast();
});

// ========================================================
// POSTAL CODE CHECKER (Canadian Standard Feature)
// ========================================================
const kamloopsPostalMap = {
  'V2C': 'Downtown Kamloops, Valleyview, Juniper Ridge & Dallas',
  'V2E': 'Sahali, Upper Sahali & Southgate',
  'V1S': 'Aberdeen, Dufferin & Pineview',
  'V2B': 'North Kamloops, Brocklehurst & Westsyde',
  'V2H': 'Sun Rivers, Rayleigh & Heffley Creek'
};

window.handlePostalCheck = function (event) {
  event.preventDefault();
  const input = document.getElementById('postal-input');
  const resultDiv = document.getElementById('postal-result');
  if (!input || !resultDiv) return;

  const rawVal = input.value.trim().toUpperCase().replace(/\s+/g, '');
  if (rawVal.length < 3) {
    resultDiv.className = 'text-xs font-semibold p-2.5 rounded-lg bg-red-900/60 text-red-200 border border-red-700/60 mt-2 block';
    resultDiv.innerHTML = '⚠️ Please enter at least the first 3 characters of your postal code (e.g. V2C).';
    return;
  }

  const prefix = rawVal.substring(0, 3);
  const addressField = document.getElementById('quote-address');

  if (kamloopsPostalMap[prefix]) {
    const neighborhood = kamloopsPostalMap[prefix];
    resultDiv.className = 'text-xs font-semibold p-3 rounded-xl bg-emerald-950/80 text-emerald-200 border border-emerald-500/60 mt-2 block space-y-1';
    resultDiv.innerHTML = `
      <div class="flex items-center gap-1.5 text-white font-bold text-sm">
        <span>✅ Direct Service Available in ${prefix}!</span>
      </div>
      <p class="text-[11px] text-emerald-300">Neighborhood: <strong>${neighborhood}</strong>. Trucks are scheduled in your zone this week.</p>
      <a href="#quote-calculator" class="inline-block mt-1 text-xs font-extrabold text-cyan-300 underline hover:text-white">
        Proceed to Book with 10% First-Time Discount →
      </a>
    `;
    if (addressField) {
      addressField.value = `${prefix} - ${neighborhood.split(',')[0]}`;
    }
  } else if (rawVal.startsWith('V')) {
    resultDiv.className = 'text-xs font-semibold p-3 rounded-xl bg-cyan-950/80 text-cyan-200 border border-cyan-500/60 mt-2 block space-y-1';
    resultDiv.innerHTML = `
      <div class="flex items-center gap-1.5 text-white font-bold">
        <span>✅ Regional Service Available!</span>
      </div>
      <p class="text-[11px] text-cyan-300">We service extended Thompson-Nicola and surrounding lake properties by appointment.</p>
      <a href="tel:2505550192" class="inline-block mt-1 text-xs font-extrabold text-amber-300 underline">
        Call (250) 555-0192 for direct scheduling →
      </a>
    `;
    if (addressField) addressField.value = rawVal;
  } else {
    resultDiv.className = 'text-xs font-semibold p-3 rounded-xl bg-amber-950/80 text-amber-200 border border-amber-500/60 mt-2 block';
    resultDiv.innerHTML = `
      <span>📍 Enter a British Columbia postal code starting with 'V' (e.g. V2C 1A1) or call Kyle at (250) 555-0192.</span>
    `;
  }
};

// ========================================================
// BEFORE & AFTER SLIDER COMPONENT (CLIP-PATH ENGINE)
// ========================================================
function initBeforeAfterSlider() {
  const container = document.getElementById('before-after-container');
  const beforeWrapper = document.getElementById('before-wrapper');
  const handle = document.getElementById('slider-handle');

  if (!container || !beforeWrapper || !handle) return;

  let isDragging = false;

  const setSliderPosition = (xPos) => {
    const rect = container.getBoundingClientRect();
    let offsetX = xPos - rect.left;
    let percentage = (offsetX / rect.width) * 100;

    // Clamp between 4% and 96%
    if (percentage < 4) percentage = 4;
    if (percentage > 96) percentage = 96;

    beforeWrapper.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    handle.style.left = `${percentage}%`;
  };

  const startDrag = (e) => {
    isDragging = true;
    document.body.classList.add('dragging');
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
  };

  const stopDrag = () => {
    if (isDragging) {
      isDragging = false;
      document.body.classList.remove('dragging');
    }
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSliderPosition(clientX);
  };

  // Mouse events
  container.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('mousemove', onDrag);

  // Touch events for mobile/tablet
  container.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: true });
}

// ========================================================
// GALLERY CATEGORIES (Tabs)
// ========================================================
const galleryData = {
  windows: {
    beforeImg: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    caption: '<strong>Residential Window Restoration in Sahali:</strong> Mineral deposit removal and frame scrub using 100% deionized purified water.'
  },
  concrete: {
    beforeImg: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80',
    caption: '<strong>Driveway & Walkway Surface Washing in Aberdeen:</strong> Heavy moss, tire marks, and oil stains removed with high-pressure rotary surface cleaners.'
  },
  gutters: {
    beforeImg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    caption: '<strong>Vinyl Siding Soft Wash & Gutter Clean in Valleyview:</strong> Organic algae scrub, downspout clearance, and gutter exterior whitening.'
  }
};

function initGalleryTabs() {
  const tabButtons = document.querySelectorAll('.gallery-tab-btn');
  const beforeImg = document.getElementById('before-image');
  const afterImg = document.getElementById('after-image');
  const caption = document.getElementById('gallery-caption');
  const beforeWrapper = document.getElementById('before-wrapper');
  const handle = document.getElementById('slider-handle');

  if (!tabButtons.length || !beforeImg || !afterImg) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (!galleryData[tab]) return;

      tabButtons.forEach(b => {
        b.classList.remove('bg-brand-600', 'text-white', 'shadow-sm');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.add('bg-brand-600', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-slate-100', 'text-slate-700');

      beforeImg.src = galleryData[tab].beforeImg;
      afterImg.src = galleryData[tab].afterImg;
      caption.innerHTML = galleryData[tab].caption;

      // Reset slider to center using clip-path
      if (beforeWrapper && handle) {
        beforeWrapper.style.clipPath = 'inset(0 50% 0 0)';
        handle.style.left = '50%';
      }
    });
  });
}

// ========================================================
// INSTANT BALLPARK ESTIMATE CALCULATOR
// ========================================================
function initEstimateCalculator() {
  const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
  const storyRadios = document.querySelectorAll('input[name="stories"]');
  const storyOptions = document.querySelectorAll('.story-option');
  const estimateDisplay = document.getElementById('estimate-display');
  const selectedCountDisplay = document.getElementById('selected-service-count');

  if (!serviceCheckboxes.length || !estimateDisplay) return;

  const calculateTotal = () => {
    let baseSum = 0;
    let selectedCount = 0;

    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        baseSum += parseFloat(cb.getAttribute('data-price') || '0');
        selectedCount++;
      }
    });

    let multiplier = 1.0;
    storyRadios.forEach(radio => {
      if (radio.checked) {
        multiplier = parseFloat(radio.getAttribute('data-multiplier') || '1.0');
      }
    });

    let total = Math.round(baseSum * multiplier);

    if (selectedCount === 0) {
      estimateDisplay.textContent = '$0';
      if (selectedCountDisplay) selectedCountDisplay.textContent = 'None selected';
      return;
    }

    // Apply a multi-service bundle discount if 2 or more services selected
    if (selectedCount >= 2) {
      total = Math.round(total * 0.90); // 10% bundle discount
    }

    estimateDisplay.textContent = `$${total}`;
    if (selectedCountDisplay) {
      selectedCountDisplay.textContent = `${selectedCount} Service${selectedCount > 1 ? 's (10% Bundle Discount)' : ''}`;
    }
  };

  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateTotal);
  });

  storyRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      storyOptions.forEach(opt => opt.classList.remove('active', 'border-brand-500', 'bg-brand-500/10'));
      const parentLabel = radio.closest('.story-option');
      if (parentLabel) {
        parentLabel.classList.add('active', 'border-brand-500', 'bg-brand-500/10');
      }
      calculateTotal();
    });
  });

  calculateTotal();
}

// Function to pre-select a service from cards or packages
window.selectServiceInForm = function (serviceName) {
  const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
  const nameLower = serviceName.toLowerCase();

  if (nameLower.includes('bundle')) {
    // Select windows, siding, and gutters
    serviceCheckboxes.forEach(cb => {
      if (['windows', 'power-wash', 'gutters'].includes(cb.value)) {
        cb.checked = true;
      }
    });
  } else {
    serviceCheckboxes.forEach(cb => {
      const val = cb.value;
      if (nameLower.includes('residential') && val === 'windows') cb.checked = true;
      else if (nameLower.includes('commercial') && val === 'commercial') cb.checked = true;
      else if (nameLower.includes('power') && val === 'power-wash') cb.checked = true;
      else if (nameLower.includes('pressure') && val === 'pressure-wash') cb.checked = true;
      else if (nameLower.includes('gutter') && val === 'gutters') cb.checked = true;
      else if (nameLower.includes('solar') && val === 'solar') cb.checked = true;
    });
  }

  // Re-trigger calculation
  if (serviceCheckboxes[0]) {
    serviceCheckboxes[0].dispatchEvent(new Event('change'));
  }
};

// ========================================================
// QUOTE FORM SUBMISSION HANDLER
// ========================================================
window.handleQuoteSubmit = function (event) {
  event.preventDefault();

  const submitBtn = document.getElementById('submit-quote-btn');
  const successBanner = document.getElementById('quote-success-banner');

  if (!submitBtn || !successBanner) return;

  const originalContent = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>Confirming Details with Kyle...</span>
  `;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalContent;
    successBanner.classList.remove('hidden');

    successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (window.lucide) {
      lucide.createIcons();
    }
  }, 900);
};

// ========================================================
// FAQ ACCORDION
// ========================================================
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (!questionBtn || !answerDiv) return;

    questionBtn.addEventListener('click', () => {
      const isAlreadyOpen = !answerDiv.classList.contains('hidden');

      faqItems.forEach(otherItem => {
        const otherAnswer = otherItem.querySelector('.faq-answer');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherAnswer && otherAnswer !== answerDiv) {
          otherAnswer.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isAlreadyOpen) {
        answerDiv.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        answerDiv.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// ========================================================
// LIVE SOCIAL PROOF TOAST (Discreet International Standard)
// ========================================================
function initLiveSocialProofToast() {
  const toast = document.getElementById('live-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastBody = document.getElementById('toast-body');
  const toastTime = document.getElementById('toast-time');
  const closeBtn = document.getElementById('close-toast');

  if (!toast || !toastTitle || !toastBody) return;

  const activities = [
    { title: "New Booking in Aberdeen", body: "Deluxe In & Out Window Cleaning scheduled", time: "4 mins ago" },
    { title: "Quote Sent in Sahali", body: "House Soft Wash & Gutter Flush estimated", time: "11 mins ago" },
    { title: "Commercial Plaza Clean", body: "Storefront recurring glass maintenance confirmed", time: "22 mins ago" },
    { title: "Booking in Sun Rivers", body: "Full Property Revival Bundle booked", time: "38 mins ago" }
  ];

  let currentIndex = 0;
  let isClosed = false;

  const showToast = () => {
    if (isClosed) return;
    const act = activities[currentIndex];
    toastTitle.textContent = act.title;
    toastBody.textContent = act.body;
    toastTime.textContent = act.time;

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      if (isClosed) return;
      toast.classList.add('translate-y-20', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 6000);

    currentIndex = (currentIndex + 1) % activities.length;
  };

  // Initial delay 4 seconds, then repeat every 24 seconds
  setTimeout(showToast, 4000);
  setInterval(showToast, 26000);

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      isClosed = true;
      toast.classList.add('translate-y-20', 'opacity-0');
    });
  }
}
