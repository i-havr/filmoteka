// import * as basicLightbox from 'basiclightbox';

// const instance = basicLightbox.create(document.querySelector('#template'));

const refs = {
  openLink: document.querySelector('#students'),
  modal: document.querySelector('#my-modal'),
  backdrop: document.querySelector('#my-backdrop'),
  close: document.querySelector('#my-close-button'),
};

refs.openLink.addEventListener('click', onOpen);
refs.close.addEventListener('click', onClose);

function onOpen(e) {
  e.preventDefault();
  refs.backdrop.classList.toggle('hidden');
  console.log('я туць');
}

function onClose() {
  refs.backdrop.classList.toggle('hidden');
}
