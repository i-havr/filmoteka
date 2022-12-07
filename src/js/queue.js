import { Movies } from './fetch';

const APIKey = 'e0e51fe83e5367383559a53110fae0e8';

const refs = {
    modal: document.querySelector('.modal')
}
try {
    refs.modal.addEventListener('click', addToQueue);
} catch (error) {
    console.log('error')
}
    

let queueMovie = [];
let queueMovieById = [];

async function addToQueue(event) {
  if (event.target.id !== 'modal__button-queue') {
    return;
  }
  
  const movies = new Movies(APIKey);
    try {
        // console.dir(event.target)
        const currentMovie = await movies.getMovieDetails(event.target.offsetParent.children[2].children[0].dataset.id);
        
    if (!queueMovieById.includes(currentMovie.id)) {
      queueMovieById.push(currentMovie.id);
      queueMovie.push(currentMovie);

      localStorage.setItem('queueId', JSON.stringify(queueMovieById));
      localStorage.setItem('queue', JSON.stringify(queueMovie));
    }
  } catch (error) {
    console.log(error.message);
  }
}

