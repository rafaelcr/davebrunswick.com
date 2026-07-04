document.getElementById('year').textContent = new Date().getFullYear();

const header = document.getElementById('site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
onScroll();
window.addEventListener('scroll', onScroll);

const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const carousel = document.getElementById('services-carousel');

if (carousel) {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  const cards = Array.from(track.children);

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Ir al servicio ${i + 1}`);
    dot.addEventListener('click', () => {
      goTo(i);
      restartAutoplay();
    });
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  let index = 0;
  let autoplayId = null;
  let scrollSyncTimeout = null;

  function updateDots() {
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + cards.length) % cards.length;
    const trackRect = track.getBoundingClientRect();
    const targetRect = cards[index].getBoundingClientRect();
    track.scrollTo({
      left: track.scrollLeft + (targetRect.left - trackRect.left),
      behavior: 'smooth',
    });
    updateDots();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function stopAutoplay() {
    clearInterval(autoplayId);
    autoplayId = null;
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(next, 4500);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  prevBtn.addEventListener('click', () => {
    prev();
    restartAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    next();
    restartAutoplay();
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('touchstart', stopAutoplay, { passive: true });
  carousel.addEventListener('touchend', () => {
    setTimeout(startAutoplay, 3000);
  });
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  track.addEventListener('scroll', () => {
    clearTimeout(scrollSyncTimeout);
    scrollSyncTimeout = setTimeout(() => {
      const trackRect = track.getBoundingClientRect();
      let closest = 0;
      let closestDistance = Infinity;
      cards.forEach((card, i) => {
        const distance = Math.abs(card.getBoundingClientRect().left - trackRect.left);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = i;
        }
      });
      index = closest;
      updateDots();
    }, 120);
  });

  updateDots();
  startAutoplay();
}
