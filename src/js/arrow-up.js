import moveUp from './move-up';

const pageTop = () => {
  const scrollProgress = document.querySelector('.scroll-progress');
  const position = document.documentElement.scrollTop;

  if (position > 170) {
    scrollProgress.style.display = 'flex';
  } else {
    scrollProgress.style.display = 'none';
  }

  const calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const invisibleAreaView = Math.round((position * 100) / calcHeight);

  scrollProgress.addEventListener('click', moveUp);

  scrollProgress.style.background = `conic-gradient(var(--accent-font-color) ${invisibleAreaView}%, var(--second-font-color) ${invisibleAreaView}%)`;
};

window.onscroll = pageTop;
window.onload = pageTop;
