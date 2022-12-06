import { Movies } from './fetch';
import refs from './refs';

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

let GENRES = [0];

export function markupFilmoteka(dataArr) {
  const markup = dataArr.map(markupCard).join('');

  refs.filmotekaList.insertAdjacentHTML('beforeend', markup);
}

export function markupCard(imgObj) {
  const base_url = 'https://image.tmdb.org/t/p/';
  // const file_size = 'original';
  const file_size = 'w500';
  const URI = `${base_url}${file_size}${imgObj.poster_path}`;
  const date = new Date(imgObj.release_date);

  const genres = markupGenres(imgObj.genre_ids);

  return `<li class="grid__item filmoteka__item" data-id="${imgObj.id}">
			<div class="card" data-id="${imgObj.id}">
                <div class="card__img">
					<img src="${URI}" alt="${imgObj.title}">
				</div>
                    <div class="card__wrapper">
                        <h2 class="card__title title">${imgObj.title}</h2>
                        <p class="card__desc">${genres} | ${date.getFullYear()}
                        </p>
                    </div>
                </div>
			</li>
    `;
}

export function markupGenres(genre_ids) {
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
    console.log('GENRES ', GENRES);
  } catch (error) {
    console.log(error.message);
  }
}
