import { Movies } from './fetch';
import refs from './refs';
import foto from '../images/poster/poster-not-found-main.jpg';

export const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

let GENRES = [0];

export function markupFilmoteka(dataArr) {
  const markup = dataArr.map(markupCard).join('');
  const isHeaderMain = refs.header.classList.contains('header--home');
  if (isHeaderMain) {

    refs.filmotekaList.insertAdjacentHTML('beforeend', markup);
  }
}
export function markupCard(imgObj) {
  const base_url = 'https://image.tmdb.org/t/p/';
  // const file_size = 'original';
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

export function markupGenres(genre_ids) {
  if (genre_ids.length === 0) {
    return 'No information';
  }
  let genres = [];

  for (let i = 0; i < genre_ids.length; i++) {
    for (let j = 0; j < GENRES.length; j++) {
      const genre = GENRES[j];
      if (genre.id === genre_ids[i]) {
        genres.push(genre.name);
        continue;
      }
    }
  }

  return genres.join(', ');
}

export async function getGenres() {
  const movies = new Movies(APIKey);
  try {
    GENRES = await movies.getGenres();
    // console.log('GENRES ', GENRES);
  } catch (error) {
    console.log(error.message);
  }
}
