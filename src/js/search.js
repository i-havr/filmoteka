import { Movies } from './fetch';
import { markupFilmoteka } from './markup';
import { APIKey } from './apikey';
import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import clearFilmoteka from './clear-filmoteka';
import refs from './refs';
import Pagination from 'tui-pagination';
import {
  paginationStart,
  updateMoviesList,
  makePaginationOptions,
} from './pagination';
import moveUp from './move-up';
import { showMore } from './gallery';

const SEARCH_STORAGE_KEY = 'search-query';

const movies = new Movies(APIKey);

let searchValue = 'cat';
const isHeaderMain = refs.header.classList.contains('header--home');
if (isHeaderMain) {
  refs.searchForm.addEventListener('submit', onSubmitForm);
}

async function onSubmitForm(evt) {
  evt.preventDefault();
  localStorage.removeItem(SEARCH_STORAGE_KEY);

  searchValue = evt.currentTarget.elements.searchQuery.value;
  localStorage.setItem(SEARCH_STORAGE_KEY, searchValue);
  clearFilmoteka();
  addLoadingSpinner();

  startSearch();
}

async function startSearch() {
  await getMoviesBySearch();
  showMore.hide();
  removeLoadingSpinner();
}

async function getMoviesBySearch(page = 1) {
  try {
    const { results, total_results } = await movies.searchMovies(
      searchValue,
      page
    );

    await getPaginationBySearch(total_results, page);

    if (!results.length) {
      onInvalidSearchQuery();
      return;
    }

    clearFilmoteka();

    markupFilmoteka(results);

    moveUp();
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
  }
}

function onInvalidSearchQuery() {
  const notification = document.querySelector('#message');

  notification.classList.remove('is-hidden');

  const removeNotification = () => {
    setTimeout(() => {
      notification.classList.add('is-hidden');
    }, 3000);
  };

  removeNotification();
}

// Pagination
async function getPaginationBySearch(total_pages, page) {
  const paginationOptions = makePaginationOptions(total_pages, page);
  const paginationBySearch = new Pagination(
    refs.paginationContainer,
    paginationOptions
  );

  paginationStart.off('afterMove', updateMoviesList);
  paginationBySearch.on('afterMove', updateMoviesListBySearch);

  moveUp();
}

async function updateMoviesListBySearch(event) {
  const currentPageBySearch = event.page;

  await getMoviesBySearch(currentPageBySearch);
}
