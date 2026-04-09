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

function getCarouselStep(carouselTrack) {
  const firstItem = carouselTrack.querySelector('.carousel-item');
  if (!firstItem) return 0;

  const itemWidth = firstItem.getBoundingClientRect().width;
  const trackStyles = getComputedStyle(carouselTrack);
  const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0;

  return itemWidth + gap;
}

function scrollCarousel(carouselTrack, direction) {
  const step = getCarouselStep(carouselTrack);
  if (!step) return;

  const maxScrollLeft = Math.max(
    0,
    carouselTrack.scrollWidth - carouselTrack.clientWidth,
  );
  const atStart = carouselTrack.scrollLeft <= 2;
  const atEnd = carouselTrack.scrollLeft >= maxScrollLeft - 2;

  if (direction < 0 && atStart) {
    carouselTrack.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    return;
  }

  if (direction > 0 && atEnd) {
    carouselTrack.scrollTo({ left: 0, behavior: 'smooth' });
    return;
  }

  carouselTrack.scrollBy({ left: direction * step, behavior: 'smooth' });
}

function initializeCarousel() {
  const carouselTrack = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (!carouselTrack || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener('click', () => {
    scrollCarousel(carouselTrack, -1);
  });

  nextBtn.addEventListener('click', () => {
    scrollCarousel(carouselTrack, 1);
  });
}

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
