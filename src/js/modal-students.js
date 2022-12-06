const refs = {
  openLink: document.querySelector('#students'),
  modal: document.querySelector('#my-modal'),
  backdrop: document.querySelector('#my-backdrop'),
};

refs.openLink.addEventListener('click', onClick);

function onClick(e) {
  e.preventDefault();
  refs.modal.classList.toggle('hidden');
  refs.backdrop.classList.toggle('hidden');
  console.log('я туць');
}
