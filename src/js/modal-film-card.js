import { Movies } from './fetch';
import { APIKey } from './markup';
const bodyScrollLock = require('body-scroll-lock');
import foto from '../images/poster/poster-not-found-desk.jpg';

export default class ModalMovie {
  constructor(
    {
      containerMain,
      containerMyLib,
      btnClose,
      openModal,
      modalContent,
      backdrop,
      header,
    },
    IMAGE_URL,
    APIKey
  ) {
    this.containerMain = containerMain;
    this.containerMyLib = containerMyLib;
    this.btnClose = btnClose;
    this.openModal = openModal;
    this.modalContent = modalContent;
    this.backdrop = backdrop;
    this.header = header;
    this.IMAGE_URL = IMAGE_URL;
    this.APIKey = APIKey;
  }
  init() {
    this.addEventListeners();
  }
  addEventListeners() {
    const isHeaderMain = refs.header.classList.contains('header--home');
    if (isHeaderMain) {
      this.containerMain.addEventListener('click', this.onOpenModal.bind(this));
    } else {
      this.containerMyLib.addEventListener(
        'click',
        this.onOpenModal.bind(this)
      );
    }

    this.btnClose.addEventListener('click', this.onCloseModal.bind(this));
    this.backdrop.addEventListener(
      'click',
      this.toCloseModalClickBackdrop.bind(this)
    );
  }

  async fetchMovie(movie) {
    const movies = new Movies(this.APIKey);
    return await movies.getMovieDetails(movie);
  }

  onOpenModal(e) {
    if (e.target.nodeName === 'UL') {
      return;
    }
    this.openModal.classList.remove('is-hidden');
    const movieId = e.target.closest('.filmoteka__item').dataset.id;
    this.getMovieDetals(movieId);
    bodyScrollLock.disableBodyScroll(document.body);
    const isBackdrop = !this.backdrop.classList.contains('is-hidden');
    if (isBackdrop) {
      window.addEventListener(
        'keydown',
        this.toCloseModalClickEscape.bind(this)
      );
    }
  }

  getMovieDetals(movie) {
    this.fetchMovie(movie)
      .then(data => {
        this.onMakeMarkup(data);
      })
      .catch(error => {
        console.log(error.name);
        console.log(error.message);
      });
  }

  toCloseModalClickEscape(e) {
    const isEscape = e.code === 'Escape';
    if (isEscape) {
      this.onCloseModal();
      window.removeEventListener(
        'keydown',
        this.toCloseModalClickEscape.bind(this)
      );
    }
  }
  toCloseModalClickBackdrop(e) {
    const isClickBackdrop = e.target === this.backdrop;
    if (isClickBackdrop) {
      this.onCloseModal();
    }
  }
  onCloseModal() {
    this.openModal.classList.add('is-hidden');
    this.modalContent.innerHTML = '';
    bodyScrollLock.enableBodyScroll(document.body);
  }

  onMakeMarkup(data) {
    let {
      poster_path,
      title,
      vote_average,
      vote_count,
      popularity,
      original_title,
      genres,
      overview,
      id,
    } = data;
    // console.log(overview.length);
    // let text = '';
    // if (overview.length > 300) {
    //   text = overview.slice(0, 300);
    //   console.log(text);
    //   console.log(overview);
    // }
    let img = `${this.IMAGE_URL}${poster_path}`;

    if (poster_path === null) {
      img = foto;
    }

    genres = genres.map(item => item.name).join(', ');
    vote_average = vote_average.toFixed(1);
    popularity = popularity.toFixed(1);

    const markup = `
    <div data-id="${id}"><img class="movie-details__img" src="${img}"/></div>
    <div class="movie-details__thumb">
    <div class="movie-details__content"><h3 class="movie-details__title">${title}</h3>
    <table><tbody class="table"><tr>
      <td class="movie-details__name">Vote / Votes</td><td class="movie-details__slash"><span class="movie-details__vote movie-details__vote--average">${vote_average}</span> / <span class="movie-details__vote">${vote_count}</span></td>
    </tr><tr>
      <td class="movie-details__name">Popularity</td><td class="movie-details__value">${popularity}</td>
    </tr><tr>
      <td class="movie-details__name">Original Title</td><td class="movie-details__value">${original_title}</td>
    </tr><tr>
      <td class="movie-details__name">Genres</td><td class="movie-details__genres">${genres}</td>
    </tr></tbody></table>
    <h4 class="movie-details__about">ABOUT</h4>
    <p class="movie-details__text">${overview}</p></div>
    <div class="movie-details__buttons">
    <button class="button modal__button" type="button" id="modal__watched-button">Add to Watched</button>
    <button id="modal__button-queue" class="button" type="button">Add to Queue</button>
    <button class="button" type="button"></button>
    </div>
    </div>
    `;
    this.modalContent.insertAdjacentHTML('beforeend', markup);
  }
}

const getRef = x => document.querySelector(x);
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const refs = {
  containerMain: getRef('#filmoteka-list'),
  containerMyLib: getRef('.library__list'),
  btnClose: getRef('button[data-modal="close"]'),
  openModal: getRef('[data-modal="open"]'),
  modalContent: getRef('.movie-details'),
  backdrop: getRef('.backdrop'),
  header: getRef('.header'),
};

new ModalMovie(refs, IMAGE_URL, APIKey).init();
