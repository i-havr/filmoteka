import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import { Movies } from './fetch';
import clearFilmoteka from './clear-filmoteka';
import { markupFilmoteka } from './markup';
// import { getGenres } from './genres';
import { APIKey } from './apikey';
import refs from './refs';
import ShowMore from './show-more-btn';

const movies = new Movies(APIKey);
export const showMore = new ShowMore({ selector: '.show-more', hidden: true });

// let searchValue = 'cat';
const isHeaderMain = refs.header.classList.contains('header--home');

if (isHeaderMain) {
  startGallery();
  // refs.searchForm.addEventListener('submit', onSubmitForm);
}

// function onSubmitForm(evt) {
//   evt.preventDefault();
//   searchValue = evt.currentTarget.elements.searchQuery.value;
//   clearFilmoteka();
//   startGallery();
// }

async function startGallery() {
  addLoadingSpinner();

  refs.paginationContainer.classList.remove('visually-hidden');
  await getTrendMovies();

  removeLoadingSpinner();
}

// Page from pagination
export async function getTrendMovies(page = 1) {
  try {
    const { results, total_pages } = await movies.getTrendingMovies(page);

    if (results.length === 0) {
      refs.subtitle.classList.remove('visually-hidden');
      throw new Error(
        'Sorry, there are no movies matching your search query. Please try again.'
      );
    }

    clearFilmoteka();
    showMore.hide();

    markupFilmoteka(results);

    if (total_pages > 20 && page !== total_pages) {
      showMore.show();
      showMore.enable();
    }
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
  }
}

export async function getAppendMovies(page) {
  try {
    const { results } = await movies.getTrendingMovies(page);

    if (results.length < 20) {
      showMore.hide();
    }

    markupFilmoteka(results);
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
  }
}
