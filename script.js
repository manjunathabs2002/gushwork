/**
 * Gushwork - Premium HDPE Pipes & Coils
 * JavaScript - Interactive Features
 * Features: Sticky Header, Image Carousel with Zoom
 */

// ==================== Navigation Functionality ====================

/**
 * Add navigation functionality
 * Enables smooth scrolling to sections
 */
const heroSlides = [
  { src: 'assets/fishnet.jpg', alt: 'Fishnet installation on site' },
  { src: 'assets/EuroFlexlogo.png', alt: 'EuroFlex HDPE branding' },
  { src: 'assets/logo.png', alt: 'Mangalam HDPE product branding' },
];

let heroSlideIndex = 0;

function initializeNavigation() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Only handle anchor links
      if (href.startsWith('#') && href !== '#') {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

function initializeProductSelect() {
  const productSelect = document.getElementById('productsSelect');
  if (!productSelect) return;

  productSelect.addEventListener('change', (event) => {
    const target = event.target.value;
    if (!target) return;

    const targetElement = document.querySelector(target);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    productSelect.selectedIndex = 0;
  });
}

function updateHeroImage(index) {
  const heroImage = document.getElementById('heroMainImage');
  const thumbnails = document.querySelectorAll('.thumbnail-item');

  if (!heroImage) return;

  heroSlideIndex = (index + heroSlides.length) % heroSlides.length;
  heroImage.src = heroSlides[heroSlideIndex].src;
  heroImage.alt = heroSlides[heroSlideIndex].alt;

  thumbnails.forEach((thumb, thumbIndex) => {
    thumb.classList.toggle('active', thumbIndex === heroSlideIndex);
  });
}

function initializeHeroSlider() {
  const prevButton = document.getElementById('heroPrev');
  const nextButton = document.getElementById('heroNext');
  const thumbnails = document.querySelectorAll('.thumbnail-item');

  if (!prevButton || !nextButton || thumbnails.length === 0) return;

  prevButton.addEventListener('click', () => {
    updateHeroImage(heroSlideIndex - 1);
  });

  nextButton.addEventListener('click', () => {
    updateHeroImage(heroSlideIndex + 1);
  });

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      updateHeroImage(index);
    });
  });
}

// ==================== Image Carousel Functionality ====================

/**
 * State object to manage carousel
 * Tracks current position and total items
 */
const carouselState = {
  currentIndex: 0,
  itemsPerView: 4,
  totalItems: 0,
  realTotal: 0,
  cloneCount: 0,
  autoPlayInterval: null,
  isAutoPlaying: false,
};

/**
 * Initialize the image carousel with zoom on hover
 * Features:
 * - Smooth scrolling between items
 * - Interactive navigation buttons
 * - Pagination dots
 * - Zoom effect on hover
 * - Seamless infinite looping
 */
function initializeCarousel() {
  const carouselTrack = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (!carouselTrack || !prevBtn || !nextBtn || !dotsContainer) return;

  // Get the original carousel items (before cloning)
  let originalItems = Array.from(
    carouselTrack.querySelectorAll('.carousel-item:not(.clone)'),
  );
  carouselState.realTotal = originalItems.length;

  // Update items per view based on screen size
  updateCarouselItemsPerView();
  carouselState.cloneCount = carouselState.itemsPerView;

  // Clone items at start and end for infinite scroll
  originalItems = Array.from(
    carouselTrack.querySelectorAll('.carousel-item:not(.clone)'),
  );
  const lastItems = originalItems.slice(-carouselState.cloneCount);
  const firstItems = originalItems.slice(0, carouselState.cloneCount);

  // Prepend clones of last items
  lastItems.reverse().forEach((item) => {
    const clone = item.cloneNode(true);
    clone.classList.add('clone');
    carouselTrack.insertBefore(clone, carouselTrack.firstChild);
  });

  // Append clones of first items
  firstItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.classList.add('clone');
    carouselTrack.appendChild(clone);
  });

  // Update total items count
  const items = carouselTrack.querySelectorAll('.carousel-item');
  carouselState.totalItems = items.length;
  carouselState.currentIndex = carouselState.cloneCount;

  // Create pagination dots
  createCarouselDots(dotsContainer);

  // Set up event listeners
  prevBtn.addEventListener('click', () => {
    carouselState.currentIndex -= 1;
    updateCarousel();
    checkWrapAround();
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    carouselState.currentIndex += 1;
    updateCarousel();
    checkWrapAround();
    resetAutoPlay();
  });

  // Dot navigation
  const dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      carouselState.currentIndex = carouselState.cloneCount + index;
      updateCarousel();
      resetAutoPlay();
    });
  });

  // Add zoom effect
  addCarouselZoomEffect(items);

  // Handle window resize
  window.addEventListener('resize', () => {
    updateCarouselItemsPerView();
    updateCarousel();
  });

  // Initial display
  updateCarousel();
  startAutoPlay();
}

function checkWrapAround() {
  const carouselTrack = document.getElementById('carouselTrack');
  const realStart = carouselState.cloneCount;
  const realEnd = carouselState.cloneCount + carouselState.realTotal - 1;

  setTimeout(() => {
    if (carouselState.currentIndex > realEnd) {
      carouselState.currentIndex = realStart;
      carouselTrack.style.transition = 'none';
      updateCarousel();
      setTimeout(() => {
        carouselTrack.style.transition = 'transform 0.4s ease-out';
      }, 50);
    } else if (carouselState.currentIndex < realStart) {
      carouselState.currentIndex = realEnd;
      carouselTrack.style.transition = 'none';
      updateCarousel();
      setTimeout(() => {
        carouselTrack.style.transition = 'transform 0.4s ease-out';
      }, 50);
    }
  }, 400);
}

/**
 * Update the number of items shown based on viewport width
 * Responsive breakpoints:
 * - Mobile: 1 item
 * - Tablet: 2 items
 * - Desktop: 4 items
 */
function updateCarouselItemsPerView() {
  const width = window.innerWidth;

  if (width < 480) {
    carouselState.itemsPerView = 1;
  } else if (width < 768) {
    carouselState.itemsPerView = 2;
  } else if (width < 1100) {
    carouselState.itemsPerView = 3;
  } else if (width < 1400) {
    carouselState.itemsPerView = 4;
  } else {
    carouselState.itemsPerView = 5;
  }

  const maxIndex = Math.max(
    0,
    carouselState.totalItems - carouselState.itemsPerView,
  );
  if (carouselState.currentIndex > maxIndex) {
    carouselState.currentIndex = maxIndex;
  }
}

/**
 * Create pagination dots dynamically
 * One dot per "page" of carousel items
 */
function createCarouselDots(container) {
  container.innerHTML = '';
  const totalPages = Math.max(1, carouselState.realTotal);

  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    if (i === 0) dot.classList.add('active');
    container.appendChild(dot);
  }
}

/**
 * Update carousel position and active states
 * Handles visual feedback and animation
 */
function updateCarousel() {
  const carouselTrack = document.getElementById('carouselTrack');
  const items = carouselTrack.querySelectorAll('.carousel-item');
  const dots = document.querySelectorAll('.dot');

  if (!carouselTrack || items.length === 0) return;

  // Calculate dimensions
  const itemWidth = items[0].offsetWidth;
  const trackStyle = getComputedStyle(carouselTrack);
  const gap = parseInt(trackStyle.gap || '16', 10);
  const scrollPosition = carouselState.currentIndex * (itemWidth + gap);

  // Apply transform
  carouselTrack.style.transform = `translateX(-${scrollPosition}px)`;

  // Update active dot
  if (dots.length > 0) {
    const activeDotIndex = Math.max(
      0,
      Math.min(
        carouselState.currentIndex - carouselState.cloneCount,
        dots.length - 1,
      ),
    );
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeDotIndex);
    });
  }
}

/**
 * Add zoom effect to carousel images on hover
 * Displays a magnifying glass icon and zoomed preview
 * Images scale up smoothly with overlay effect
 */
function addCarouselZoomEffect(items) {
  items.forEach((item) => {
    const imageWrapper = item.querySelector('.carousel-image-wrapper');
    const image = item.querySelector('.carousel-image');
    const zoomOverlay = item.querySelector('.carousel-zoom');

    if (!imageWrapper || !image || !zoomOverlay) return;

    // Add hover effect
    imageWrapper.addEventListener('mouseenter', () => {
      // Image zoom is handled by CSS
      image.style.transform = 'scale(1.15)';
      zoomOverlay.style.opacity = '1';
    });

    imageWrapper.addEventListener('mouseleave', () => {
      image.style.transform = 'scale(1)';
      zoomOverlay.style.opacity = '0';
    });

    // Touch support for mobile devices
    imageWrapper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      imageWrapper.play?.();
    });
  });
}

/**
 * Reset autoplay timer
 * Useful when user manually navigates carousel
 */
function resetAutoPlay() {
  if (carouselState.autoPlayInterval) {
    clearInterval(carouselState.autoPlayInterval);
  }
  startAutoPlay();
}

/**
 * Start automatic carousel navigation
 * Rotates through items every 5 seconds
 */
function startAutoPlay() {
  if (carouselState.autoPlayInterval) {
    clearInterval(carouselState.autoPlayInterval);
  }

  carouselState.autoPlayInterval = setInterval(() => {
    carouselState.currentIndex += 1;
    updateCarousel();
    checkWrapAround();
  }, 4000); // Auto-advance every 4 seconds
}

/**
 * Fishnet image slider state and management
 */
const fishnetState = {
  currentIndex: 0,
  images: [
    'assets/FishNetManufacturing.png',
    'assets/FishNetManufacturing.png',
    'assets/FishNetManufacturing.png',
    'assets/FishNetManufacturing.png',
    'assets/FishNetManufacturing.png',
  ],
  autoPlayInterval: null,
};

/**
 * Manufacturing process stage state
 */
const manufacturingStages = [
  {
    title: 'High-Grade Raw Material Selection',
    description:
      'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
    points: ['PE100 grade material', 'Optimal molecular weight distribution'],
    image: 'assets/FishNetManufacturing.png',
    alt: 'Raw material stage',
  },
  {
    title: 'Precision Extrusion',
    description:
      'High-output extrusion lines form consistent HDPE pipe wall thickness with minimal dimensional variance.',
    points: ['Advanced melt control', 'Uniform wall distribution'],
    image: 'assets/fishnet.jpg',
    alt: 'Extrusion stage',
  },
  {
    title: 'Controlled Cooling',
    description:
      'Water bath cooling preserves surface finish and prevents dimensional growth after extrusion.',
    points: ['Even cooling profile', 'Reduced stress build-up'],
    image: 'assets/FishNetManufacturing.png',
    alt: 'Cooling stage',
  },
  {
    title: 'Precision Sizing',
    description:
      'Precision sizing ensures consistent diameter and wall thickness across every length of pipe.',
    points: ['Accurate diameter control', 'Consistent wall thickness'],
    image: 'assets/fishnet.jpg',
    alt: 'Sizing stage',
  },
  {
    title: 'Quality Control',
    description:
      'Automated inspections and pressure testing deliver pipes that exceed industry standards.',
    points: ['Pressure testing', 'Dimensional verification'],
    image: 'assets/FishNetManufacturing.png',
    alt: 'Quality control stage',
  },
  {
    title: 'Marking & Traceability',
    description:
      'Precise marking and batch tracking provide traceability for every manufactured coil.',
    points: ['Batch coding', 'Traceable markings'],
    image: 'assets/fishnet.jpg',
    alt: 'Marking stage',
  },
  {
    title: 'Cutting & Finishing',
    description:
      'Clean cutting with smooth end finishes ready pipes for installation or shipment.',
    points: ['Smooth end finishes', 'Custom length cutting'],
    image: 'assets/FishNetManufacturing.png',
    alt: 'Cutting stage',
  },
  {
    title: 'Packaging & Delivery',
    description:
      'Protective packaging and logistics ensure safe delivery to your project site.',
    points: ['Secure packaging', 'Efficient delivery'],
    image: 'assets/fishnet.jpg',
    alt: 'Packaging stage',
  },
];

let manufacturingStageIndex = 0;

/**
 * Testimonial data for the testimonials section
 */
const testimonials = [
  {
    quote: 'Revolutionized our FIBC production efficiency!',
    detail:
      'Our HDPE systems have optimized production efficiency. The precision engineering ensures consistent product quality. Excellent support for specialized applications.',
    author: 'Johann Mueller',
    title: 'Production Director',
  },
  {
    quote: 'Excellent support for specialized applications.',
    detail:
      'The durability and performance of our HDPE infrastructure has significantly improved our operational efficiency. Excellent support for specialized applications.',
    author: 'Carlos Mendoza',
    title: 'Operations Manager',
  },
  {
    quote: 'Excellent support for specialized applications.',
    detail:
      'The durability and performance of our HDPE systems has significantly improved product quality. Excellent support for specialized applications.',
    author: 'Carlos Mendoza',
    title: 'Operations Manager',
  },
  {
    quote: 'Provides the exact specifications we need!',
    detail:
      'For our technical applications, HDPE infrastructure provides the exact specifications required. Their understanding of automotive textile requirements is exceptional.',
    author: 'Rajesh Kumar',
    title: 'Manufacturing Head',
  },
];

/**
 * Initialize manufacturing stage tabs
 */
function initializeManufacturingTabs() {
  const tabs = document.querySelectorAll('.manufacturing-tab');
  const titleEl = document.getElementById('manufacturingStageTitle');
  const descriptionEl = document.getElementById(
    'manufacturingStageDescription',
  );
  const featuresEl = document.getElementById('manufacturingStageFeatures');
  const imageEl = document.getElementById('manufacturingImage');
  const prevBtn = document.getElementById('manufacturingPrev');
  const nextBtn = document.getElementById('manufacturingNext');

  if (
    !tabs.length ||
    !titleEl ||
    !descriptionEl ||
    !featuresEl ||
    !imageEl ||
    !prevBtn ||
    !nextBtn
  ) {
    return;
  }

  const setActiveStage = (index) => {
    manufacturingStageIndex =
      (index + manufacturingStages.length) % manufacturingStages.length;
    const stage = manufacturingStages[manufacturingStageIndex];

    tabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === manufacturingStageIndex;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    titleEl.textContent = stage.title;
    descriptionEl.textContent = stage.description;
    imageEl.src = stage.image;
    imageEl.alt = stage.alt;

    featuresEl.innerHTML = stage.points
      .map((point) => `<li>${point}</li>`)
      .join('');
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      setActiveStage(parseInt(tab.dataset.stage, 10));
    });
  });

  prevBtn.addEventListener('click', () => {
    setActiveStage(manufacturingStageIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    setActiveStage(manufacturingStageIndex + 1);
  });

  setActiveStage(0);
}

/**
 * Initialize fishnet image slider
 */
function initializeFishnetSlider() {
  const fishnetImage = document.getElementById('fishnetImage');
  const prevBtn = document.getElementById('fishnetPrev');
  const nextBtn = document.getElementById('fishnetNext');
  const dotsContainer = document.getElementById('fishnetDots');

  if (!fishnetImage || !prevBtn || !nextBtn || !dotsContainer) return;

  // Create dots for pagination
  createFishnetDots(dotsContainer);

  // Set up arrow navigation
  prevBtn.addEventListener('click', () => {
    fishnetState.currentIndex =
      (fishnetState.currentIndex - 1 + fishnetState.images.length) %
      fishnetState.images.length;
    updateFishnetSlider();
    resetFishnetAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    fishnetState.currentIndex =
      (fishnetState.currentIndex + 1) % fishnetState.images.length;
    updateFishnetSlider();
    resetFishnetAutoPlay();
  });

  // Set up dot navigation
  const dots = dotsContainer.querySelectorAll('.fishnet-dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      fishnetState.currentIndex = index;
      updateFishnetSlider();
      resetFishnetAutoPlay();
    });
  });

  // Initialize display
  updateFishnetSlider();
}

/**
 * Create pagination dots for fishnet slider
 */
function createFishnetDots(container) {
  container.innerHTML = '';

  fishnetState.images.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'fishnet-dot';
    if (index === 0) dot.classList.add('active');
    container.appendChild(dot);
  });
}

/**
 * Update fishnet slider display
 */
function updateFishnetSlider() {
  const fishnetImage = document.getElementById('fishnetImage');
  const dots = document.querySelectorAll('.fishnet-dot');

  if (!fishnetImage) return;

  // Update image with fade effect
  fishnetImage.style.opacity = '0.5';
  setTimeout(() => {
    fishnetImage.src = fishnetState.images[fishnetState.currentIndex];
    fishnetImage.style.opacity = '1';
  }, 150);

  // Update active dot
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === fishnetState.currentIndex);
  });
}

/**
 * Reset fishnet autoplay
 */
function resetFishnetAutoPlay() {
  if (fishnetState.autoPlayInterval) {
    clearInterval(fishnetState.autoPlayInterval);
  }
  startFishnetAutoPlay();
}

/**
 * Start automatic fishnet slider rotation
 */
function startFishnetAutoPlay() {
  fishnetState.autoPlayInterval = setInterval(() => {
    fishnetState.currentIndex =
      (fishnetState.currentIndex + 1) % fishnetState.images.length;
    updateFishnetSlider();
  }, 5000); // Rotate every 5 seconds
}

/**
 * Initialize mobile menu toggle
 * Shows/hides navigation on mobile devices
 */
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  // Close menu when a link is clicked
  const links = navLinks.querySelectorAll('a');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });

  // Close menu on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });
}

// ==================== Smooth Scroll for Navigation Links ====================

/**
 * Add smooth scroll behavior to all internal navigation links
 * Enhances user experience with smooth transitions
 */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      e.preventDefault();

      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// ==================== Form Submission ====================

/**
 * Handle CTA form submission
 * Validates input and provides user feedback
 */
function initializeFormHandling() {
  const forms = document.querySelectorAll('.cta-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const input = form.querySelector('input[type="email"]');
      const email = input?.value;

      // Basic email validation
      if (email && email.includes('@')) {
        // Simulate form submission
        alert(`Thank you! We'll send updates to ${email}`);
        input.value = '';
      } else {
        alert('Please enter a valid email address');
      }
    });
  });
}

// ==================== Performance Optimization ====================

/**
 * Lazy loading for images
 * Improves initial page load performance
 */
function initializeLazyLoading() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;

          // Load image
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.add('loaded');
            observer.unobserve(lazyImage);
          }
        }
      });
    });

    // Observe all images that need lazy loading
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// ==================== Accessibility Enhancements ====================

/**
 * Add keyboard navigation support
 * Enables navigation using arrow keys and Tab
 */
function initializeKeyboardNavigation() {
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (!prevBtn || !nextBtn) return;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      nextBtn.click();
    }
  });
}

// ==================== Initialize All Features ====================

/**
 * Main initialization function
 * Called when DOM is fully loaded
 * Sets up all interactive features
 */
function initializeAll() {
  // Navigation with smooth scroll
  initializeNavigation();
  initializeProductSelect();
  initializeHeroSlider();
  updateHeroImage(heroSlideIndex);

  // Carousel
  initializeCarousel();

  // Fishnet slider
  initializeFishnetSlider();

  // Manufacturing stage tabs
  initializeManufacturingTabs();

  // Mobile menu
  initializeMobileMenu();

  // Form handling
  initializeFormHandling();

  // Lazy loading
  initializeLazyLoading();

  // Keyboard navigation
  initializeKeyboardNavigation();

  console.log('Gushwork website initialized successfully!');
}

// ==================== DOM Ready Event ====================

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAll);
} else {
  // DOM is already loaded
  initializeAll();
}

// ==================== Error Handling ====================

/**
 * Global error handler for debugging
 */
window.addEventListener('error', (e) => {
  console.error('Error:', e.error);
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
});
