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

// Automatically observe elements with the class 'fade-in' or 'reveal' if present
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.fade-in, .reveal');
  animatedElements.forEach((el) => observer.observe(el));
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll-triggered entrance animation using Intersection Observer
    const cards = document.querySelectorAll('.award-card');
    
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const awardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered delay based on card index
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    cards.forEach(card => awardObserver.observe(card));

    // 2. Interactive 3D tilt tracking on mouse hover
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
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
  });
  document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('[data-anime-card]');
  const cursorGlow = document.getElementById('cursorGlow');

  // 1. Mouse-following Background Glow (Cursor Track)
  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }
  });

  // 2. Entrance Stagger Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('reveal');
        }, index * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));

  // 3. Dynamic 3D Tilt & Localized Spotlight Effect on Cards
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables for localized hover glow inside card
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D Tilt angles
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
});
// Wrap tilt events to execute ONLY on desktop devices with hover support
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsHover) {
  cards.forEach(card => {
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
// Prevents the full-page bounce/rubber-band effect on touch devices
document.addEventListener('touchmove', function (event) {
  // If the target or its parents are not intended to scroll internally, prevent default bounce
  let isScrollable = false;
  let element = event.target;

  while (element && element !== document.body) {
    if (element.scrollHeight > element.clientHeight) {
      isScrollable = true;
      break;
    }
    element = element.parentElement;
  }

  if (!isScrollable) {
    event.preventDefault();
  }
}, { passive: false });
// Fixes vertical (top/bottom) rubber-band scrolling
(function disableVerticalRubberBand() {
  let startY = 0;

  document.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      startY = e.touches[0].clientY;
    }
  }, { passive: false });

  document.addEventListener('touchmove', function (e) {
    if (e.touches.length !== 1) return;

    const currentY = e.touches[0].clientY;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    const isPullingDown = currentY > startY && scrollTop <= 0;
    const isPushingUp = currentY < startY && (scrollTop + clientHeight >= scrollHeight - 1);

    // Prevent scrolling past top or bottom boundaries
    if (isPullingDown || isPushingUp) {
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  }, { passive: false });
})();