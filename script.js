/**
 * NovaFlow Responsive Landing Page — Interactive UI Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header & Back-to-Top Visibility
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 2. Mobile Navigation Hamburger Menu
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  };

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // 3. Active Navigation Highlight on Scroll (ScrollSpy)
  const sections = document.querySelectorAll('main section[id]');

  const updateActiveNavLink = () => {
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // 4. Dark / Light Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('novaflow-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('novaflow-theme', nextTheme);
  });

  // 5. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // 6. Animated Statistics Counters
  const counters = document.querySelectorAll('.counter');

  const animateCounter = (counter) => {
    const target = parseFloat(counter.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 1400;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * eased;

      counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = isDecimal ? target.toFixed(1) : target;
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // 7. Interactive Hero Dashboard Chart Switcher (7D vs 30D)
  const chartTabs = document.querySelectorAll('.chart-tab');
  const barFills = document.querySelectorAll('#hero-chart .bar-fill');

  const chartData = {
    week: ['45%', '65%', '52%', '82%', '74%', '95%', '88%'],
    month: ['68%', '78%', '85%', '60%', '92%', '79%', '98%'],
  };

  chartTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      chartTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const series = chartData[tab.dataset.series] || chartData.week;
      barFills.forEach((bar, index) => {
        bar.style.setProperty('--h', series[index]);
      });
    });
  });

  // 8. Interactive Billing Toggle (Monthly vs Annual)
  const billingSwitch = document.getElementById('billing-switch');
  const monthlyLabel = document.getElementById('monthly-label');
  const annualLabel = document.getElementById('annual-label');
  const priceAmounts = document.querySelectorAll('.price-amount');

  billingSwitch.addEventListener('click', () => {
    const isAnnual = billingSwitch.getAttribute('aria-checked') !== 'true';
    billingSwitch.setAttribute('aria-checked', String(isAnnual));

    monthlyLabel.classList.toggle('active', !isAnnual);
    annualLabel.classList.toggle('active', isAnnual);

    priceAmounts.forEach((priceEl) => {
      priceEl.textContent = isAnnual ? priceEl.dataset.annual : priceEl.dataset.monthly;
    });
  });

  // 9. Interactive FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((headerBtn) => {
    headerBtn.addEventListener('click', () => {
      const body = headerBtn.nextElementSibling;
      const icon = headerBtn.querySelector('.accordion-icon');
      const isExpanded = headerBtn.getAttribute('aria-expanded') === 'true';

      // Close other open accordion items
      accordionHeaders.forEach((otherBtn) => {
        if (otherBtn !== headerBtn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherBtn.nextElementSibling.classList.remove('open');
          otherBtn.querySelector('.accordion-icon').textContent = '+';
        }
      });

      headerBtn.setAttribute('aria-expanded', String(!isExpanded));
      body.classList.toggle('open', !isExpanded);
      icon.textContent = !isExpanded ? '−' : '+';
    });
  });

  // 10. Newsletter Form Validation & Feedback
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const formFeedback = document.getElementById('form-feedback');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      formFeedback.textContent = 'Please enter a valid email address.';
      formFeedback.className = 'form-feedback error';
      return;
    }

    formFeedback.textContent = '🎉 Thanks for subscribing! Check your inbox for early access details.';
    formFeedback.className = 'form-feedback success';
    newsletterForm.reset();
  });

  // 11. Interactive Call-to-Action Signup Modal
  const modal = document.getElementById('signup-modal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('modal-close');
  const modalForm = document.getElementById('modal-form');
  const modalSuccess = document.getElementById('modal-success');

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modalSuccess.textContent = '';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  openModalBtns.forEach((btn) => btn.addEventListener('click', openModal));
  closeModalBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = document.getElementById('modal-name').value.trim();
    modalSuccess.textContent = `Welcome aboard, ${userName || 'Explorer'}! Redirecting to your workspace...`;
    setTimeout(() => {
      modalForm.reset();
      closeModal();
    }, 1600);
  });

  // 12. Dynamic Footer Year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
