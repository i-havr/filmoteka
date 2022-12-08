import { addLoadingSpinner, removeLoadingSpinner } from './loading-spinner';
import { Movies } from './fetch';
import clearFilmoteka from './clear-filmoteka';
import { markupFilmoteka, getGenres, APIKey } from './markup';
import refs from './refs';
import ShowMore from './show-more-btn';

const movies = new Movies(APIKey);
const showMore = new ShowMore({ selector: '.show-more', hidden: true });

let searchValue = 'cat';
const isHeaderMain = refs.header.classList.contains('header--home');
if (isHeaderMain) {
  refs.searchForm.addEventListener('submit', onSubmitForm);
}

function onSubmitForm(evt) {
  evt.preventDefault();
  searchValue = evt.currentTarget.elements.searchQuery.value;
  clearFilmoteka();
  startGallery();
}

startGallery();

async function startGallery() {
  addLoadingSpinner();

  await getGenres();
  await getTrendMovies();

  removeLoadingSpinner();
}

// Page from pagination
export async function getTrendMovies(page) {
  // const movies = new Movies(APIKey);

  try {
    const { results, total_pages } = await movies.getTrendingMovies(page);
    console.log('results ', results);

    if (results.length === 0) {
      throw new Error(
        'Sorry, there are no movies matching your search query. Please try again.'
      );
    }

    clearFilmoteka();
    showMore.hide();

    markupFilmoteka(results);

    if (total_pages > 20 && page !== total_pages) {
      console.log(total_pages);
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
