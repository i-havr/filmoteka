import Pagination from 'tui-pagination';
// import 'tui-pagination/dist/tui-pagination.css';
import { getTrendMovies, getAppendMovies } from './gallery';
import moveUp from './move-up';
import refs from './refs';
import { Movies } from './fetch';
import { markupFilmoteka, APIKey } from './markup';
// import ShowMore from './show-more-btn';
import { showMore } from './gallery';

const movies = new Movies(APIKey);

// export const showMore = new ShowMore({ selector: '.show-more', hidden: true });

const nextOptions = {
  nextPage: 1,
  async addNextTrendingMovies() {
    try {
      this.nextPage += 1;
      const { results, total_pages } = await movies.getTrendingMovies(
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

export function makePaginationOptions(
  totalResults = 20000,
  currentPage = nextOptions.nextPage
) {
  return {
    totalItems: totalResults,
    itemsPerPage: 20,
    visiblePages: 5,
    page: currentPage,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton:
        '<a href="#" class="tui-page-btn tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</a>',
      disabledMoveButton:
        '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</span>',
      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };
}

const paginationOptions = makePaginationOptions();

export const paginationStart = new Pagination(
  refs.paginationContainer,
  paginationOptions
);

paginationStart.on('afterMove', updateMoviesList);

export async function updateMoviesList(event) {
  const currentPageStart = event.page;
  nextOptions.nextPage = currentPageStart;

  console.log('currentPageStart -->', currentPageStart);

  await getTrendMovies(currentPageStart);

  moveUp();
}

showMore.refs.blockShowMore.addEventListener('click', onShowMoreClick);

async function onShowMoreClick() {
  showMore.disable();

  await nextOptions.addNextTrendingMovies();

  paginationStart.off();
  paginationStart.on('afterMove', updateMoviesListByShowMore);
  paginationStart.movePageTo(nextOptions.nextPage);
  console.log('nextPage after showMore -->', nextOptions.nextPage);
  paginationStart.off();
  paginationStart.on('afterMove', updateMoviesList);
}

export function updateMoviesListByShowMore(event) {
  console.log('event.page -->', event.page);

  nextOptions.nextPage = event.page;
  console.log('nextPage in updateMoviesList -->', nextOptions.nextPage);

  getAppendMovies(event.page);
}
