export default class ShowMore {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);
    hidden && this.hide();
    //   if (hidden) {
    //       this.hide();
    //   }
  }

  getRefs(selector) {
    const refs = {};
    refs.blockShowMore = document.querySelector(selector);
    refs.iconShowMore = refs.blockShowMore.querySelector('.show-more__icon');
    refs.textShowMore = refs.blockShowMore.querySelector('.show-more__text');

    return refs;
  }

  enable() {
    this.refs.iconShowMore.classList.remove('rotated');
    this.refs.textShowMore.style.opacity = '1';
    this.refs.textShowMore.textContent = 'Show more';
  }

  disable() {
    this.refs.iconShowMore.classList.add('rotated');
    this.refs.textShowMore.style.opacity = '0.5';
    this.refs.textShowMore.textContent = 'Wait...';
  }

  show() {
    this.refs.blockShowMore.style.display = 'flex';
  }

  hide() {
    this.refs.blockShowMore.style.display = 'none';
  }
}
