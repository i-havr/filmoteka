import Pagination from 'tui-pagination';
// import 'tui-pagination/dist/tui-pagination.css';
import { getTrendMovies, getAppendMovies } from './gallery';
// import { getMovies1 } from './search';
import moveUp from './move-up';
import refs from './refs';
import { Movies } from './fetch';
import { markupFilmoteka } from './markup';
import ShowMore from './show-more-btn';

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

const movies = new Movies(APIKey);

export const showMore = new ShowMore({ selector: '.show-more', hidden: true });

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

const container = document.getElementById('pagination');

console.log(nextOptions.nextPage);

export function makePaginationOptions(totalResults = 20000) {
  return {
    totalItems: totalResults,
    itemsPerPage: 20,
    visiblePages: 5,
    page: nextOptions.nextPage,
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

  await getTrendMovies(currentPageStart);

  moveUp();
}

showMore.refs.blockShowMore.addEventListener('click', onShowMoreClick);

export function updateMoviesList2(event) {
  console.log('event.page -->', event.page);

  nextOptions.nextPage = event.page;
  console.log('nextPage in updateMoviesList -->', nextOptions.nextPage);

  getAppendMovies(event.page);
}

async function onShowMoreClick() {
  showMore.disable();

  await nextOptions.addNextTrendingMovies(paginationStart._currentPage);

  paginationStart.off();
  paginationStart.on('afterMove', updateMoviesList2);
  paginationStart.movePageTo(nextOptions.nextPage);
  console.log('nextPage after showMore -->', nextOptions.nextPage);
  paginationStart.off();
  paginationStart.on('afterMove', updateMoviesList);
}
