import { Movies } from './fetch';

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

const refs = {
  libraryList: document.querySelector('#library-list'),
  filmotekaList: document.querySelector('#filmoteka-list'),
  watchedBtn: document.querySelector('#watched-btn'),
  myLibLink: document.querySelector('#mylib-link'),
  queueBtn: document.querySelector('#queue-btn'),
};

let GENRES = [0];

// Слухачі подій
try {
  refs.filmotekaList.addEventListener('click', addWatched);
} catch (error) { }
try {
  refs.watchedBtn.addEventListener('click', addLibraryListWatched);
} catch (error) { }
try {
  refs.queueBtn.addEventListener('click', removeLibraryListWatched);
} catch (error) { }

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

// Запис в LocalStorage
async function addWatched(event) {
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  //   console.dir(event.target.parentElement.parentElement.attributes[1].value);
  const movies = new Movies(APIKey);
  try {
    const film = await movies.getMovieDetails(
      event.target.parentElement.parentElement.attributes[1].value
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
  refs.libraryList.innerHTML = '';
  refs.watchedBtn.classList.add('button--active');
  refs.queueBtn.classList.remove('button--active');

  if (localStorage.getItem('watched')) {
    for (const film of watchedFilm) {
      try {
        refs.libraryList.insertAdjacentHTML('beforeend', markupCard(film));
      } catch (error) {
        console.log(error);
      }
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
