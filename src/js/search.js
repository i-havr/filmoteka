import { Movies } from './fetch';
import { markupFilmoteka, getGenres } from './markup';
import clearFilmoteka from './clearFilmoteka';
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

async function Start() {
  await getGenres();

  await getMovies();
}

async function getMovies() {
  const movies = new Movies(APIKey);

  try {
    const { results } = await movies.searchMovies(searchValue);

    if (results.length === 0) {
      // throw new Error(
      //   'Sorry, there are no movies matching your search query. Please try again.'
      // );
      onInvalidSearchQuery();
      return;
    }

    clearFilmoteka();

    markupFilmoteka(results);
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
  }
}

function onInvalidSearchQuery() {
  const notification = `<p class="search__info">
          Search result was not successful. Please try another key word
        </p>;`;
  document
    .querySelector('.search')
    .insertAdjacentHTML('beforeend', notification);

  const removeNotification = () => {
    setTimeout(() => {
      document.querySelector('.search__info').remove();
    }, 3000);
  };

  removeNotification();
}
