const refs = {
  openLink: document.querySelector('.footer__link'),
  modal: document.querySelector('#my-modal'),
  backdrop: document.querySelector('#my-backdrop'),
  close: document.querySelector('#my-close-button'),
};

refs.openLink.addEventListener('click', onOpen);
refs.close.addEventListener('click', onClose);
refs.backdrop.addEventListener('click', onClose);

function onOpen(e) {
  e.preventDefault();
  refs.backdrop.classList.toggle('hidden');
}

function onClose() {
  refs.backdrop.classList.toggle('hidden');
}


