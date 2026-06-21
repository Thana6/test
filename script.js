// ═══════════════════════════════════════════
// Smart Kids — main script
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    setTimeout(() => loader.classList.add('hidden'), 800);
  });

  /* ---------- SWIPER HERO (homepage only) ---------- */
  let swiper;
  if (document.querySelector('.hero-swiper') && typeof Swiper !== 'undefined') {
    swiper = new Swiper('.hero-swiper', {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    effect: 'slide',
    speed: 1000,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    pagination: { el: '.swiper-pagination', clickable: true },
    on: {
      init() { restartKenBurns(); },
      slideChangeTransitionEnd() { restartKenBurns(); }
    }
    });
  }
  function restartKenBurns() {
    document.querySelectorAll('.hero-swiper .swiper-slide .slide-bg').forEach(bg => bg.style.animation = 'none');
    const active = document.querySelector('.hero-swiper .swiper-slide-active');
    if (active) {
      const bg = active.querySelector('.slide-bg');
      if (bg) bg.style.animation = 'kenBurnsZoom 14s ease-in-out infinite alternate';
    }
  }

  /* ---------- MOBILE MENU ---------- */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- SMOOTH ANCHOR SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- TODAY AT SMART KIDS (daily-rotating spotlight) ---------- */
  const dailyThemes = [
    { // Sunday
      title: "We're Closed Today",
      text: "Enjoy the weekend! We reopen Monday morning at 7:00am — see you then.",
      tip: "Weekend tip: a simple nature walk builds the same focus skills as classroom work."
    },
    { // Monday
      title: "🎵 Music & Movement Monday",
      text: "We start the week with songs, rhythm games, and big-muscle movement to shake off the weekend wiggles.",
      tip: "Tip: singing the days of the week at home reinforces what we sing in class."
    },
    { // Tuesday
      title: "🧩 Tinker & Build Tuesday",
      text: "Puzzle corner and our robotics shelf get extra attention today — problem-solving is the theme.",
      tip: "Tip: let your child finish a puzzle without help first, then offer one small hint."
    },
    { // Wednesday
      title: "📖 Wonder Wednesday",
      text: "Storytelling and imaginative play take centre stage — today's circle time includes a brand-new story.",
      tip: "Tip: ask 'what do you think happens next?' while reading together at home."
    },
    { // Thursday
      title: "🔢 Thinking Thursday",
      text: "Number counting and memory games are the focus, building early math confidence.",
      tip: "Tip: counting stairs, snacks, or toys out loud turns any moment into math practice."
    },
    { // Friday
      title: "🎨 Fun Friday",
      text: "Art, colour, and creativity close out the week — expect paint-covered hands at pickup!",
      tip: "Tip: ask your child to tell you about their artwork instead of guessing what it is."
    },
    { // Saturday
      title: "We're Closed Today",
      text: "Enjoy the weekend! We reopen Monday morning at 7:00am — see you then.",
      tip: "Weekend tip: unstructured free play is just as valuable as planned activities."
    }
  ];

  const today = new Date();
  const dayIndex = today.getDay(); // 0 = Sunday
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const theme = dailyThemes[dayIndex];

  const spotlightDay = document.getElementById('spotlightDay');
  const spotlightTitle = document.getElementById('spotlightTitle');
  const spotlightText = document.getElementById('spotlightText');
  const spotlightTip = document.getElementById('spotlightTip');

  if (spotlightDay && theme) {
    spotlightDay.textContent = dayNames[dayIndex];
    spotlightTitle.textContent = theme.title;
    spotlightText.textContent = theme.text;
    spotlightTip.textContent = theme.tip;
  }

  /* ---------- COUNTDOWN ---------- */
  // Update this target date whenever the next enrolment deadline or event changes.
  const countdownTarget = new Date('2026-07-31T18:00:00+05:30').getTime();
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const countdownTitle = document.getElementById('countdownTitle');

  function updateCountdown() {
    const now = Date.now();
    const diff = countdownTarget - now;
    if (diff <= 0) {
      if (countdownTitle) countdownTitle.textContent = 'Enrolment Is Open Now';
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMins.textContent = String(mins).padStart(2, '0');
  }
  if (cdDays) {
    updateCountdown();
    setInterval(updateCountdown, 60 * 1000);
  }

  /* ---------- TESTIMONIAL SLIDER ---------- */
  const tTrack = document.getElementById('tTrack');
  const tDotsWrap = document.getElementById('tDots');
  const slides = tTrack ? Array.from(tTrack.children) : [];
  let activeSlide = 0;
  let slideTimer;

  function renderDots() {
    tDotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      if (i === activeSlide) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      tDotsWrap.appendChild(dot);
    });
  }
  function goToSlide(i) {
    activeSlide = i;
    tTrack.style.transform = `translateX(-${i * 100}%)`;
    Array.from(tDotsWrap.children).forEach((d, idx) => d.classList.toggle('active', idx === i));
    restartAutoplay();
  }
  function nextSlide() { goToSlide((activeSlide + 1) % slides.length); }
  function restartAutoplay() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 6000);
  }
  if (slides.length) {
    renderDots();
    restartAutoplay();
  }

  /* ---------- VISIT FORM VALIDATION ---------- */
  const form = document.getElementById('enquiryForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    const validators = {
      parentName: v => v.trim().length > 1 ? '' : 'Please enter your name.',
      childAge: v => v ? '' : "Please select your child's age.",
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email.',
      phone: v => v.trim().length >= 7 ? '' : 'Please enter a valid phone number.'
    };

    function showError(fieldName, message) {
      const field = form.querySelector(`[name="${fieldName}"]`);
      const errorEl = form.querySelector(`.error[data-for="${fieldName}"]`);
      const wrapper = field.closest('.field');
      errorEl.textContent = message;
      wrapper.classList.toggle('invalid', !!message);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successMsg.classList.remove('show');

      let isValid = true;
      Object.entries(validators).forEach(([fieldName, validate]) => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const message = validate(field.value);
        showError(fieldName, message);
        if (message) isValid = false;
      });

      if (isValid) {
        successMsg.classList.add('show');
        form.reset();
        Object.keys(validators).forEach(fieldName => showError(fieldName, ''));
      }
    });

    Object.keys(validators).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      field.addEventListener('input', () => showError(fieldName, ''));
    });
  }

  /* ---------- ACCORDIONS (About / Montessori programs) ---------- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      header.closest('.accordion-item').classList.toggle('active');
    });
  });

  /* ---------- CONTACT PAGE — simple static form feedback ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactStatus.textContent = '✅ Thank you — your message has been sent. We will get back to you soon.';
      contactStatus.style.color = '#1c7a5e';
      contactForm.reset();
      setTimeout(() => { contactStatus.textContent = ''; }, 6000);
    });
  }

  /* ---------- ACCORDION (About / Montessori programmes) ---------- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      header.closest('.accordion-item').classList.toggle('active');
    });
  });

  /* ---------- CONTACT PAGE — simple message form ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactStatus.textContent = '✅ Thank you — your message has been noted. We\'ll get back to you within one working day.';
      contactStatus.style.color = '#1c7a5e';
      contactForm.reset();
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach(el => observer.observe(el));

  /* ---------- BACK TO TOP ---------- */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('show', window.scrollY > 500);
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
