import { Movies } from './fetch';
import clearFilmoteka from './clearFilmoteka';
import { markupFilmoteka, getGenres } from './markup';
import refs from './refs';

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

let searchValue = 'cat';

refs.searchForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(evt) {
  evt.preventDefault();
  searchValue = evt.currentTarget.elements.searchQuery.value;
  clearFilmoteka();
  Start();
}

Start();

async function Start() {
  await getGenres();

  await getMovies();
}

// Page from pagination
export async function getMovies(page) {
  const movies = new Movies(APIKey);

  try {
    const { results } = await movies.getTrendingMovies(page);
    console.log('results ', results);

    if (results.length === 0) {
      throw new Error(
        'Sorry, there are no movies matching your search query. Please try again.'
      );
    }

    clearFilmoteka();

    markupFilmoteka(results);
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
  }
}
