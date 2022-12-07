import { Movies } from './fetch';

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

const refs = {
  libraryList: document.querySelector('#library-list'),
  filmotekaList: document.querySelector('#filmoteka-list'),
  filmotekaItem: document.querySelector('.filmoteka__item'),
  watchedBtn: document.querySelector('#watched-btn'),
  myLibLink: document.querySelector('#mylib-link'),
  queueBtn: document.querySelector('#queue-btn'),
  modalCard: document.querySelector('.modal'),
  modalContent: document.querySelector('.modal__content'),
};

let GENRES = [0];

// Слухачі подій

try {
  refs.modalCard.addEventListener('click', addWatched);
} catch (error) {}

try {
  refs.watchedBtn.addEventListener('click', addLibraryListWatched);
} catch (error) {}
try {
  refs.queueBtn.addEventListener('click', removeLibraryListWatched);
} catch (error) {}

Start();
async function Start() {
  await getGenres();

  await checkWatched();

  await addLibraryListWatched();
}

// Формування переліку жанрів
async function getGenres() {
  const movies = new Movies(APIKey);
  try {
    GENRES = await movies.getGenres();
    console.log('GENRES ', GENRES);
  } catch (error) {
    console.log(error.message);
  }
}

//  Витяг з LocalStorage
let watchedFilm = [];
let watchedFilmId = [];
async function checkWatched() {
  if (localStorage.getItem('watched')) {
    watchedFilm = JSON.parse(localStorage.getItem('watched'));
    watchedFilmId = JSON.parse(localStorage.getItem('watchedId'));
  }
}

// ---------
// async function openModal(event) {
//   console.log(watchedFilmId.includes(JSON.parse(event.path[3].dataset.id)));
//   const modalWatchedBtn = document.querySelector('#modal__watched-button');
//   console.dir(refs.modalContent.children[2]);

//   if (watchedFilmId.includes(JSON.parse(event.path[3].dataset.id))) {
//     console.log(modalWatchedBtn);
//     refs.modalWatchedBtn.textContent = 'remove Watched';
//     refs.modalWatchedBtn.classList.remove('modal__button');
//     refs.modalWatchedBtn.classList.add('modal__button--active');
//     return;
//   } else {
//     refs.modalWatchedBtn.textContent = 'add to Watched';
//     refs.modalWatchedBtn.classList.add('modal__button');
//     refs.modalWatchedBtn.classList.remove('modal__button--active');
//     return;
//   }
// }

// Запис в LocalStorage
async function addWatched(event) {
  if (
    event.target.nodeName !== 'BUTTON' ||
    event.target.id !== 'modal__watched-button'
  ) {
    return;
  }
  const movies = new Movies(APIKey);

  if (event.target.classList[1] === 'modal__button--active') {
    event.target.textContent = 'add to Watched';
    event.target.classList.add('modal__button');
    event.target.classList.remove('modal__button--active');

    const namberFilm = watchedFilmId.indexOf(
      JSON.parse(event.target.offsetParent.children[2].children[0].dataset.id)
    );

    await watchedFilmId.splice(namberFilm, 1);
    await watchedFilm.splice(namberFilm, 1);
    await localStorage.removeItem('watchedId');
    await localStorage.removeItem('watched');

    await localStorage.setItem('watchedId', JSON.stringify(watchedFilmId));
    await localStorage.setItem('watched', JSON.stringify(watchedFilm));
    return;
  }

  if (event.target.offsetParent.children[2].children[0].dataset.id) {
    event.target.textContent = 'remove Watched';
    event.target.classList.remove('modal__button');
    event.target.classList.add('modal__button--active');
  }

  try {
    const film = await movies.getMovieDetails(
      event.target.offsetParent.children[2].children[0].dataset.id
    );
    if (!watchedFilmId.includes(film.id)) {
      watchedFilmId.push(film.id);
      watchedFilm.push(film);

      localStorage.setItem('watchedId', JSON.stringify(watchedFilmId));
      localStorage.setItem('watched', JSON.stringify(watchedFilm));
    }
  } catch (error) {
    console.log(error.message);
  }
}

// Створення контенту My library watched
async function addLibraryListWatched() {
  try {
    refs.libraryList.innerHTML = '';
    refs.watchedBtn.classList.add('button--active');
    refs.queueBtn.classList.remove('button--active');
  } catch (error) {}

  if (localStorage.getItem('watched')) {
    for (const film of watchedFilm) {
      try {
        refs.libraryList.insertAdjacentHTML('beforeend', markupCard(film));
      } catch (error) {}
    }
  }
}

// Створення однієї картки
function markupCard(imgObj) {
  const URI = `https://image.tmdb.org/t/p/w500${imgObj.poster_path}`;
  const date = new Date(imgObj.release_date);
  const genres = markupGenres(imgObj.genres);

  return `<li class="grid__item filmoteka__item" data-id="${imgObj.id}">
			<div class="card" data-id="${imgObj.id}">
                <div class="card__img">
					<img src="${URI}" alt="${imgObj.title}">
				</div>
                    <div class="card__wrapper">
                        <h2 class="card__title title">${imgObj.title}</h2>
                        <p class="card__desc">${genres} | ${date.getFullYear()}
                        <span class="card__vote">
                            ${imgObj.vote_average.toFixed(1)}
                        </span>
                        </p>
                    </div>
                </div>
			</li>`;
}

// Створення жанрів в одну картку
function markupGenres(genre_ids) {
  let genres = [];
  for (const genre of genre_ids) {
    genres.push(genre.name);
  }
  return genres.join(', ');
}

// Видалення переглянутого контенту
function removeLibraryListWatched() {
  refs.libraryList.innerHTML = '';

  refs.watchedBtn.classList.remove('button--active');
  refs.queueBtn.classList.add('button--active');
}
