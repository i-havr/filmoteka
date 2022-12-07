import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import { Movies } from './fetch';
import clearFilmoteka from './clearFilmoteka';
import { markupFilmoteka, getGenres, APIKey } from './markup';
import refs from './refs';

let searchValue = 'cat';
const isHeaderMain = refs.header.classList.contains('header--home');
if (isHeaderMain) {
  refs.searchForm.addEventListener('submit', onSubmitForm);
}

function onSubmitForm(evt) {
  evt.preventDefault();
  searchValue = evt.currentTarget.elements.searchQuery.value;
  clearFilmoteka();
  Start();
}

Start();

async function Start() {
  addLoadingSpinner();

  await getGenres();
  await getTrendMovies();

  removeLoadingSpinner();
}

// Page from pagination
export async function getTrendMovies(page) {
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
