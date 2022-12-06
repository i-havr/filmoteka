import { Loading } from 'notiflix';

export function addLoadingSpinner() {
  Loading.arrows({
    svgColor: 'var(--accent-font-color)',
    svgSize: '150px',
    backgroundColor: 'rgba(0,0,0,0.8)',
  });
}

export function removeLoadingSpinner() {
  Loading.remove();
}
