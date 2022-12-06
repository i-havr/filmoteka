import { Movies } from './fetch';
import { markupFilmoteka, getGenres } from './markup';
import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import clearFilmoteka from './clearFilmoteka';
import refs from './refs';

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

let searchValue = 'cat';

refs.searchForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(evt) {
  evt.preventDefault();
  searchValue = evt.currentTarget.elements.searchQuery.value;
  clearFilmoteka();
  addLoadingSpinner();

  Start();
}

async function Start() {
  await getGenres();

  await getMovies();

  removeLoadingSpinner();
}

async function getMovies() {
  const movies = new Movies(APIKey);

  try {
    const { results } = await movies.searchMovies(searchValue);

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
