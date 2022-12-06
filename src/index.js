import './sass/index.scss';

import { Movies } from './js/fetch';
import './js/modal-film-card';
import './js/modal-students';
import './js/gallery';
import './js/search';
import './js/pagination';
import './js/watched';
import './js/arrow-up';
import './js/theme';

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

// Приклад використання запитів до API
async function test() {
  const movies = new Movies(APIKey);

  //   await movies.getGenres();
  console.log('getGenres ->', await movies.getGenres());

  //   await movies.getTrendingMovies();
  console.log('getTrendingMovies ->', await movies.getTrendingMovies());
  console.log('getTrendingMovies page 5 ->', await movies.getTrendingMovies(5));

  //   await movies.searchMovies('cat', 2);
  console.log('searchMovies ->', await movies.searchMovies('cat'));
  console.log('searchMovies page 2 ->', await movies.searchMovies('cat', 2));

  //   await movies.getMovieDetails(10588);
  console.log(
    'getMovieDetails id=10588 ->',
    await movies.getMovieDetails(10588)
  );

  //   await movies.getMovieTrailers(10588);
  console.log('getMovieTrailers ->', await movies.getMovieTrailers(10588));
}

test();
