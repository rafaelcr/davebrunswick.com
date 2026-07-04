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
