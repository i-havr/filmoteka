import { Movies } from './fetch';
import { APIKey } from './apikey';

initGenres();
function initGenres() {
  updateGenresInLS();
}

async function updateGenresInLS() {
  if (localStorage.getItem('genres')) return;
  // console.log('updateGenresInLS');

  const movies = new Movies(APIKey);
  try {
    const genres = await movies.getGenres();
    localStorage.setItem('genres', JSON.stringify(genres));
  } catch (error) {
    console.log(error.message);
  }
}

//Повертає рядок жанрів для карток Фільмотеки
//genre_ids - масив айдішок жанрів
export function markupGenres(genre_ids) {
  if (!genre_ids.length) {
    return 'No information';
  }

  const allGenres = getGenres();
  let genres = [];

  // genre_ids.map(genre_id => {
  for (let i = 0; i < genre_ids.length; i++) {
    if (i > 2) {
      genres.splice(i - 1, 1, 'Other');
      break;
    }
    for (let j = 0; j < allGenres.length; j++) {
      const genre = allGenres[j];
      if (genre.id === genre_ids[i]) {
        genres.push(genre.name);
        continue;
      }
    }
  }

  return genres.join(', ');
}

//Повертає рядок жанрів для карток Бібліотеки
//genres - масив об'єктів жанрів [{id: 16, name: 'Animation'}...]
export function markupGenresLibrary(genres) {
  if (!genres.length) {
    genres = [
      {
        id: 0,
        name: 'No information',
      },
    ];
  }
  if (genres.length > 3) {
    genres = genres.slice(0, 2);
    genres.push({
      id: 0,
      name: 'Other',
    });
  }

  return genres.map(item => item.name).join(', ');
}

//Повертає масив об'єктів жанрів {id: 16, name: 'Animation'}
function getGenres() {
  if (!localStorage.getItem('genres')) {
    document.location.reload();
    return;
  }

  try {
    return JSON.parse(localStorage.getItem('genres'));
  } catch (error) {
    console.log('error ', error.message);
  }
}
