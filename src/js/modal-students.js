const bodyScrollLock = require('body-scroll-lock');

const refs = {
  modal: document.querySelector('#my-modal'),
  openLink: document.querySelector('.footer__link'),
  backdrop: document.querySelector('#my-backdrop'),
  close: document.querySelector('#my-close-button'),
  header: document.querySelector('.header'),
};

const isHeaderMain = refs.header.classList.contains('header--home');

if (isHeaderMain) {
  refs.openLink.addEventListener('click', onOpen);
  refs.close.addEventListener('click', onClose);
  refs.backdrop.addEventListener('click', onClose);
}

function onOpen(e) {
  e.preventDefault();
  bodyScrollLock.disableBodyScroll(document.body);
  refs.modal.classList.toggle('hidden');
}

function onClose(e) {
  bodyScrollLock.enableBodyScroll(document.body);
  refs.modal.classList.toggle('hidden');
}
