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

  let dots = [];
  let index = 0;
  let autoplayId = null;
  let scrollSyncTimeout = null;
  let resizeTimeout = null;

  function getVisibleCount() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    if (!cardWidth) return 1;
    const count = Math.round((track.clientWidth + gap) / (cardWidth + gap));
    return Math.max(1, Math.min(count, cards.length));
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function updateDots() {
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function updateArrows() {
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === getMaxIndex();
  }

  function buildDots() {
    const maxIndex = getMaxIndex();
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxIndex; i += 1) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Ir a la página ${i + 1}`);
      dot.addEventListener('click', () => {
        goTo(i);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
    dots = Array.from(dotsContainer.children);
    index = Math.min(index, maxIndex);
    updateDots();
    updateArrows();
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, getMaxIndex()));
    const trackRect = track.getBoundingClientRect();
    const targetRect = cards[index].getBoundingClientRect();
    track.scrollTo({
      left: track.scrollLeft + (targetRect.left - trackRect.left),
      behavior: 'smooth',
    });
    updateDots();
    updateArrows();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function autoplayTick() {
    if (index >= getMaxIndex()) {
      goTo(0);
    } else {
      next();
    }
  }

  function stopAutoplay() {
    clearInterval(autoplayId);
    autoplayId = null;
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(autoplayTick, 4500);
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
      updateArrows();
    }, 120);
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(buildDots, 150);
  });

  buildDots();
  startAutoplay();
}
