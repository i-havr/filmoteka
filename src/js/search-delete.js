import { Movies } from './fetch';
import { markupFilmoteka, getGenres, APIKey } from './markup';
import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import clearFilmoteka from './clearFilmoteka';
import refs from './refs';
import { showMore } from './pagination';

// *********************************************
import Pagination from 'tui-pagination';
import {
  paginationStart,
  updateMoviesList,
  makePaginationOptions,
} from './pagination';

// *********************************************

const movies = new Movies(APIKey);

const SEARCH_STORAGE_KEY = 'search-query';

const nextOptions = {
  nextPage: 1,
  async addNextSearchingMovies() {
    try {
      this.nextPage += 1;
      const { results, total_pages } = await movies.searchMovies(
        SEARCH_STORAGE_KEY,
        this.nextPage
      );
      markupFilmoteka(results);
      showMore.enable();

      if (total_pages === this.nextPage) {
        showMore.hide();
      }
    } catch (error) {
      console.log(error.name, error.message);
    }
  },
};

let searchValue = '';

const isHeaderMain = refs.header.classList.contains('header--home');
if (isHeaderMain) {
  refs.searchForm.addEventListener('submit', onSubmitForm);
}

function onSubmitForm(evt) {
  evt.preventDefault();
  localStorage.removeItem(SEARCH_STORAGE_KEY);
  nextOptions.nextPage = 1;

  searchValue = evt.currentTarget.elements.searchQuery.value;
  localStorage.setItem(SEARCH_STORAGE_KEY, searchValue);
  clearFilmoteka();
  addLoadingSpinner();

  Start();
}

async function Start() {
  await getGenres();
  await getMovies1();
  removeLoadingSpinner();
}

async function getMovies1(page) {
  try {
    const { results, total_results } = await movies.searchMovies(
      searchValue,
      page
    );

    await getPaginationBySearch(total_results);

    if (results.length === 0) {
      // throw new Error(
      //   'Sorry, there are no movies matching your search query. Please try again.'
      // );
      onInvalidSearchQuery();
      return;
    }

    clearFilmoteka();

    if (results.length < 20) {
      showMore.hide();
    }

    markupFilmoteka(results);
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

// ************************************************

async function getPaginationBySearch(total_results) {
  const paginationOptions = makePaginationOptions(total_results);

  paginationStart.off('afterMove', updateMoviesList);

  const paginationBySearch = new Pagination(
    refs.paginationContainer,
    paginationOptions
  );

  paginationBySearch.on('afterMove', updateMoviesListBySearch);
}

async function updateMoviesListBySearch(event) {
  console.log('currentPageBySearch -->', event.page);

  nextOptions.nextPage = event.page;
  await getAppendSearchMovies(event.page);
}

async function getAppendSearchMovies(page) {
  try {
    const query = localStorage.getItem(SEARCH_STORAGE_KEY);

    const { results } = await movies.searchMovies(query, page);

    if (results.length < 20) {
      showMore.hide();
    }

    markupFilmoteka(results);
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
  }
}

showMore.refs.blockShowMore.addEventListener('click', onShowMoreClick);

function updateSearchList(event) {
  console.log('event.page -->', event.page);

  nextOptions.nextPage = event.page;
  console.log('nextPage in updateSearchList -->', nextOptions.nextPage);

  getAppendSearchMovies(event.page);
}

function onShowMoreClick() {
  showMore.disable();

  await nextOptions.addNextSearchingMovies(paginationStart._currentPage);

  paginationStart.off();
  paginationStart.on('afterMove', updateSearchList);
  paginationStart.movePageTo(nextOptions.nextPage);
  console.log('nextPage after showMore -->', nextOptions.nextPage);
  paginationStart.off();
  paginationStart.on('afterMove', updateMoviesList);
}
