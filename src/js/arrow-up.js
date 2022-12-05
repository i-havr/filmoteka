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

  scrollProgress.addEventListener('click', movesUp);

  function movesUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  scrollProgress.style.background = `conic-gradient(var(--accent-font-color) ${invisibleAreaView}%, var(--second-font-color) ${invisibleAreaView}%)`;
};

window.onscroll = pageTop;
window.onload = pageTop;
