import { Movies } from './fetch';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basiclightbox.min.css';
import { APIKey } from './markup';

export default class ModalMovie {
  constructor(
    { container, btnClose, openModal, modalContent },
    IMAGE_URL,
    APIKey
  ) {
    this.container = container;
    this.btnClose = btnClose;
    this.openModal = openModal;
    this.modalContent = modalContent;
    this.IMAGE_URL = IMAGE_URL;
    this.APIKey = APIKey;
  }
  init() {
    this.addEventListeners();
  }
  addEventListeners() {
    this.container.addEventListener('click', this.onOpenModal.bind(this));
    this.btnClose.addEventListener('click', this.onCloseModal.bind(this));
    window.addEventListener('keydown', this.onEscape.bind(this));
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
  }

  getMovieDetals(movie) {
    this.fetchMovie(movie)
      .then(data => {
        this.onMarkup(data);
      })
      .catch(error => {
        console.log(error);
      });
  }
  onEscape(e) {
    const isEscape = e.code === 'Escape';
    if (isEscape) {
      this.onCloseModal();
      window.removeEventListener('keydown', this.onEscape.bind(this));
    }
  }
  onCloseModal() {
    this.openModal.classList.add('is-hidden');
    this.modalContent.innerHTML = '';
  }

  onMarkup(data) {
    let {
      poster_path,
      title,
      vote_average,
      vote_count,
      popularity,
      original_title,
      genres,
      overview,
      video,
      id,
    } = data;

    genres = genres.map(item => item.name).join(', ');
    vote_average = vote_average.toFixed(1);
    popularity = popularity.toFixed(1);

    const markup = `
    <div><img class="movie-details__img" src="${IMAGE_URL}${poster_path}"/></div>
    <div class="movie-details__thumb">
    <div class="movie-details__content"><h3 class="movie-details__title">${title}</h3>
    <table><tbody class="table"><tr>
      <td class="movie-details__name">Vote / Votes</td><td class="movie-details__slash"><span class="movie-details__vote movie-details__vote--average">${vote_average}</span> / <span class="movie-details__vote">${vote_count}</span></td>
    </tr><tr>
      <td class="movie-details__name">Popularity</td><td class="movie-details__value">${popularity}</td>
    </tr><tr>
      <td class="movie-details__name">Original Title</td><td class="movie-details__value">${original_title}</td>
    </tr><tr>
      <td class="movie-details__name">Genre</td><td class="movie-details__genres">${genres}</td>
    </tr></tbody></table>
    <h4 class="movie-details__about">ABOUT</h4>
    <p class="movie-details__text">${overview}</p></div>
    <div class="movie-details__buttons">
    <button class="button" type="button"></button>
    <button class="button" type="button"></button>
    <button class="button" type="button"></button>
    </div>
    </div>
    `;
    this.modalContent.insertAdjacentHTML('beforeend', markup);

    if (video) {
      this.startListenTrailerClick(id);
    }
  }

  startListenTrailerClick(id) {
    const trailerRun = this.modalContent.querySelector('[data-trailer]');

    trailerRun.addEventListener('click', async () => {
      const movies = new Movies(this.APIKey);
      const { results } = await movies.getMovieTrailers(id);

      const youTubeVideo = results.find(vid => vid.site === 'YouTube');

      const instance = basicLightbox.create(`
        <iframe src="https://www.youtube.com/embed/${youTubeVideo.key}" width="560" height="315" frameborder="0"></iframe>
      `);

      instance.show();
    });
  }
}

const getRef = x => document.querySelector(x);
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const refs = {
  container: getRef('#filmoteka-list'),
  btnClose: getRef('button[data-modal="close"]'),
  openModal: getRef('[data-modal="open"]'),
  modalContent: getRef('.movie-details'),
};

new ModalMovie(refs, IMAGE_URL, APIKey).init();
