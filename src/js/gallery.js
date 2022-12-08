import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import { Movies } from './fetch';
import clearFilmoteka from './clear-filmoteka';
import { markupFilmoteka } from './markup';
// import { getGenres } from './genres';
import { APIKey } from './apikey';
import refs from './refs';

let searchValue = 'cat';
const isHeaderMain = refs.header.classList.contains('header--home');

if (isHeaderMain) {
  startGallery();
  refs.searchForm.addEventListener('submit', onSubmitForm);
}

function onSubmitForm(evt) {
  evt.preventDefault();
  searchValue = evt.currentTarget.elements.searchQuery.value;
  clearFilmoteka();
  startGallery();
}

async function startGallery() {
  addLoadingSpinner();

  // await getGenres();
  await getTrendMovies();

  removeLoadingSpinner();
}

// Page from pagination
export async function getTrendMovies(page) {
  const movies = new Movies(APIKey);

  try {
    const { results } = await movies.getTrendingMovies(page);

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
