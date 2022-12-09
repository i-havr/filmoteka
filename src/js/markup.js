import refs from './refs';
import foto from '../images/poster/poster-not-found-main.jpg';
import { markupGenres, markupGenresLibrary } from './genres';

// Відмальовка карток в Фільмотеки
export function markupFilmoteka(dataArr) {
  const markup = dataArr.map(markupCard).join('');
  const isHeaderMain = refs.header.classList.contains('header--home');
  if (isHeaderMain) {
    refs.filmotekaList.insertAdjacentHTML('beforeend', markup);
  }
}

// Відмальовка карток в Бібліотеці
export function markupMyLibrary(dataArr) {
  const markup = dataArr.map(markupCardLibrary).join('');

  refs.libraryList.insertAdjacentHTML('beforeend', markup);
}

export function markupCard(imgObj) {
  const base_url = 'https://image.tmdb.org/t/p/';
  const file_size = 'w500';
  let URI = `${base_url}${file_size}${imgObj.poster_path}`;
  if (imgObj.poster_path === null) {
    URI = foto;
  }
  let date = new Date(imgObj.release_date).getFullYear();

  if (Number.isNaN(Number(date))) {
    date = 'No information';
  }
  const genres = markupGenres(imgObj.genre_ids);

  return `<li class="grid__item filmoteka__item" data-id="${imgObj.id}">
			<div class="card" data-id="${imgObj.id}">
                <div class="card__img">
					<img src="${URI}" loading="lazy" alt="${imgObj.title}">
				</div>
                    <div class="card__wrapper">
                        <h2 class="card__title title">${imgObj.title}</h2>
                        <p class="card__desc">${genres} | ${date}
                        </p>
                    </div>
                </div>
			</li>
    `;
}

export function markupCardLibrary(imgObj) {
  const base_url = 'https://image.tmdb.org/t/p/';
  const file_size = 'w500';

  let URI = `${base_url}${file_size}${imgObj.poster_path}`;
  if (imgObj.poster_path === null) {
    URI = foto;
  }
  let date = new Date(imgObj.release_date).getFullYear();

  if (Number.isNaN(Number(date))) {
    date = 'No information';
  }
  const genres = markupGenresLibrary(imgObj.genres);

  return `<li class="grid__item filmoteka__item" data-id="${imgObj.id}">
			<div class="card" data-id="${imgObj.id}">
                <div class="card__img">
					<img src="${URI}" loading="lazy" alt="${imgObj.title}">
				</div>
                    <div class="card__wrapper">
                        <h2 class="card__title title">${imgObj.title}</h2>
                        <p class="card__desc">${genres} | ${date}
                        <span class="card__vote">
                            ${imgObj.vote_average.toFixed(1)}
                        </span>
                        </p>
                    </div>
                </div>
			</li>
    `;
}
