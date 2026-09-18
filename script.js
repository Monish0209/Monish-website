// Navbar Toggle & Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navbarWrapper = document.querySelector('.navbar-wrapper');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });
}

// Navbar Hide/Show on Scroll
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (!navbarWrapper || !navMenu) return;
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 20 || navMenu.classList.contains('open')) {
    navbarWrapper.classList.remove('nav-hidden');
    lastScrollY = currentScrollY;
    return;
  }

  if (currentScrollY > lastScrollY) {
    navbarWrapper.classList.add('nav-hidden');
  } else {
    navbarWrapper.classList.remove('nav-hidden');
  }

  lastScrollY = currentScrollY;
});

// Accordion Touch & Slider
(function () {
  function init() {
    const accordion = document.querySelector('.projects-accordion');
    if (!accordion) return;

    const panels = Array.prototype.slice.call(
      accordion.querySelectorAll('.project-panel')
    );

    function useTapExpand() {
      return (
        window.matchMedia('(hover: none)').matches ||
        window.matchMedia('(max-width: 1024px)').matches
      );
    }

    function closeAll() {
      panels.forEach((p) => {
        p.classList.remove('is-expanded');
        p.setAttribute('aria-expanded', 'false');
      });
    }

    function toggle(panel) {
      const wasOpen = panel.classList.contains('is-expanded');
      closeAll();
      if (!wasOpen) {
        panel.classList.add('is-expanded');
        panel.setAttribute('aria-expanded', 'true');
        panel.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }

    panels.forEach((panel) => {
      panel.setAttribute('aria-expanded', 'false');

      panel.addEventListener('click', (e) => {
        if (!useTapExpand()) return;
        if (e.target.closest('a')) return;

        toggle(panel);
      });

      panel.addEventListener('keydown', (e) => {
        if (!useTapExpand()) return;
        if (e.target.closest('a')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(panel);
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!useTapExpand()) return;
      if (accordion.contains(e.target)) return;
      closeAll();
    });

    // Slider controls
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');

    function scrollStep() {
      return Math.min(accordion.clientWidth * 0.6, 400);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        accordion.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        accordion.scrollBy({ left: scrollStep(), behavior: 'smooth' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Intersection Observer for Animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.fade-in, .reveal');
  animatedElements.forEach((el) => observer.observe(el));

  // Award Cards Entrance Animation
  const awardCards = document.querySelectorAll('.award-card');
  const awardObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate-in');
        }, index * 150);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  awardCards.forEach(card => awardObserver.observe(card));

  // Anime Cards Entrance Animation
  const animeCards = document.querySelectorAll('[data-anime-card]');
  const animeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('reveal');
        }, index * 120);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animeCards.forEach(card => animeObserver.observe(card));

  // Mouse Glow Track
  const cursorGlow = document.getElementById('cursorGlow');
  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }
  });

  // 3D Tilt interaction (Hover/Desktop fine pointers only)
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover) {
    const allTiltCards = document.querySelectorAll('.award-card, [data-anime-card]');
    allTiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }
});
