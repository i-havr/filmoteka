import moveUp from './move-up';

const pageTop = () => {
  const scrollProgress = document.querySelector('.scroll-progress');
  const position = document.documentElement.scrollTop;

  if (position > 170) {
    scrollProgress.style.opacity = '1';
    scrollProgress.style.visibility = 'visible';
  } else {
    scrollProgress.style.opacity = '0';
    scrollProgress.style.visibility = 'hidden';
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
