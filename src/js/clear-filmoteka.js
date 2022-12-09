import refs from './refs';

export default () => {
  const isHeaderMain = refs.header.classList.contains('header--home');
  if (isHeaderMain) {
    refs.filmotekaList.innerHTML = '';
  }
};
