/**
 * rakshitha Developer Portfolio
 * Vanilla JavaScript Controller
 * Features:
 *  - Theme Toggle (Light / Dark mode, default Light Theme)
 *  - Mobile Drawer Navigation & Accessibility Traps
 *  - Scroll-triggered Sticky Header & Section Spy
 *  - Interactive Roadmap / Learning Journey Filter Tabs
 *  - Resume Modal Viewer & Print Handler
 *  - Copy to Clipboard with Animated Toast Notification
 *  - Contact Form Mailto Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Theme Management (Default: Light Theme per design preference)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Check saved theme in localStorage, default to 'light'
  const savedTheme = localStorage.getItem('rakshitha_portfolio_theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Theme`);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('rakshitha_portfolio_theme', theme);
  }

  // -------------------------------------------------------------------------
  // 2. Sticky Header & Scroll Spy
  // -------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // IntersectionObserver for active section highlight
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        setActiveNavLink(id);
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  function setActiveNavLink(sectionId) {
    desktopNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Mobile Drawer Navigation
  // -------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  function openDrawer() {
    mobileDrawer?.classList.add('active');
    mobileDrawerBackdrop?.classList.add('active');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    mobileNavToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('active');
    mobileDrawerBackdrop?.classList.remove('active');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    mobileNavToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileNavToggle?.addEventListener('click', openDrawer);
  mobileDrawerClose?.addEventListener('click', closeDrawer);
  mobileDrawerBackdrop?.addEventListener('click', closeDrawer);

  // Close drawer on link click
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // -------------------------------------------------------------------------
  // 4. Learning Journey Filter Tabs
  // -------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const roadmapCards = document.querySelectorAll('.roadmap-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterValue = tab.getAttribute('data-filter');

      roadmapCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Add smooth fade in
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 5. Resume Modal Viewer
  // -------------------------------------------------------------------------
  const openResumeBtn = document.getElementById('openResumeBtn');
  const mobileResumeBtn = document.getElementById('mobileResumeBtn');
  const closeResumeBtn = document.getElementById('closeResumeBtn');
  const resumeModalBackdrop = document.getElementById('resumeModalBackdrop');

  function openResume() {
    closeDrawer();
    resumeModalBackdrop?.classList.add('active');
    resumeModalBackdrop?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    resumeModalBackdrop?.classList.remove('active');
    resumeModalBackdrop?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openResumeBtn?.addEventListener('click', openResume);
  mobileResumeBtn?.addEventListener('click', openResume);
  closeResumeBtn?.addEventListener('click', closeResume);

  resumeModalBackdrop?.addEventListener('click', (e) => {
    if (e.target === resumeModalBackdrop) {
      closeResume();
    }
  });

  // ESC key listener to close drawer and modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModalBackdrop?.classList.contains('active')) {
        closeResume();
      }
      if (mobileDrawer?.classList.contains('active')) {
        closeDrawer();
      }
    }
  });

  // -------------------------------------------------------------------------
  // 6. Copy to Clipboard & Toast Notifications
  // -------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.btn-copy-action');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          showToast('Failed to copy. Please copy manually.');
        });
      }
    });
  });

  function showToast(message) {
    if (!toastNotification || !toastMessage) return;

    toastMessage.textContent = message;
    toastNotification.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }

  // -------------------------------------------------------------------------
  // 7. Interactive Contact Form with Validation & Mailto
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const senderName = document.getElementById('senderName')?.value.trim();
      const senderEmail = document.getElementById('senderEmail')?.value.trim();
      const messageSubject = document.getElementById('messageSubject')?.value.trim();
      const messageBody = document.getElementById('messageBody')?.value.trim();

      if (!senderName || !senderEmail || !messageSubject || !messageBody) {
        showToast('Please complete all form fields.');
        return;
      }

      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(senderEmail)) {
        showToast('Please enter a valid email address.');
        return;
      }

      // Build Mailto link
      const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${messageSubject} - from ${senderName}`);
      const encodedBody = encodeURIComponent(
        `Hello rakshitha,\n\n${messageBody}\n\n---\nSender Details:\nName: ${senderName}\nEmail: ${senderEmail}`
      );

      const mailtoUrl = `mailto:rakshasalian57@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      // Open email client
      window.location.href = mailtoUrl;

      showToast('Opening your default mail client...');
      contactForm.reset();
    });
  }
});
