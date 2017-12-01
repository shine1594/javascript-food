function Carousel({ images, selector, imageType, dotStyle, effect }) {
  this.images = images;

  this.options = {
    imageType,
    dotStyle: dotStyle || 'small',
    effect: effect || 'fade-in'
  }

  this.classNames = {
    buttonPrev: 'carousel__btn--prev',
    buttonNext: 'carousel__btn--next',
    itemContainer: 'carousel__items',
    pagination: 'carousel__pagination',
    dot: 'pagination__dot',
    dotActivated: 'pagination__dot--active'
  }

  this.container = document.querySelector(selector);
  this.itemContainer = this.container.querySelector(`.${this.classNames.itemContainer}`);
  this.pagination = this.container.querySelector(`.${this.classNames.pagination}`);
}

Carousel.prototype = {
  constructor: Carousel,

  effects: {
    current: null,
    fadeIn(el, duration) {
      el.style.opacity = 0;
      const valuePerFrame = 1000 / (60 * duration);

      const fade = () => {
        el.style.opacity = Number(el.style.opacity).valueOf() + valuePerFrame;

        if (el.style.opacity < 1) {
          this.current = requestAnimationFrame(fade);
        }
      }

      fade();
    },
    clear() {
      if (this.current) {
        cancelAnimationFrame(this.current);
      }

      this.current = null;
    }
  },
  init: function() {
    this.render();
    this.bindButtonEvent();
    this.bindPaginationEvent();

    this.effects.fadeIn(this.itemContainer.children[0], 300);
    this.pagination.children[0].classList.add(this.classNames.dotActivated);
  },
  render: function() {
    this.images.forEach((imageURL, index) => {
      const imageItem = this.getImageDOM({
        url: imageURL,
        type: this.options.imageType
      });

      const dotItem = this.getDotDOM({
        index,
        classes: `${this.classNames.dot} ${this.classNames.dot}--${this.options.dotStyle}`
      });

      this.itemContainer.insertAdjacentHTML('beforeend', imageItem);
      this.pagination.insertAdjacentHTML('beforeend', dotItem);
    });
  },
  getImageDOM: function({ url, type }) {
    return (type === 'background')
      ? `<li style="background-image: url('${url}')"></li>`
      : `<li><img src="${url}"></li>`
  },
  getDotDOM: function({ classes, index }) {
    return `<li class="${classes}" data-index="${index}"></li>`;
  },
  bindButtonEvent: function() {
    const buttonPrev = this.container.querySelector(`.${this.classNames.buttonPrev}`);
    const buttonNext = this.container.querySelector(`.${this.classNames.buttonNext}`);

    buttonPrev.addEventListener('click', (evt) => {
      const currentIndex = parseInt(this.itemContainer.dataset.currentIndex);
      const nextIndex = (currentIndex === 0)
        ? this.images.length - 1
        : currentIndex - 1;

      this.showItem(nextIndex);
    });

    buttonNext.addEventListener('click', (evt) => {
      const currentIndex = parseInt(this.itemContainer.dataset.currentIndex);
      const nextIndex = (currentIndex + 1) % this.images.length;

      this.showItem(nextIndex);
    });
  },
  bindPaginationEvent: function() {
    this.pagination.addEventListener('click', ({ target }) => {
      if (target.classList.contains(this.classNames.dot) === false) {
        return;
      }
      
      this.showItem(target.dataset.index);
    });
  },
  showItem: function(nextIndex) {
    const currentIndex = this.itemContainer.dataset.currentIndex;
    const items = this.itemContainer.children;
    const dots = this.pagination.children;

    items[currentIndex].style.opacity = 0;
    this.effects.clear();
    this.effects.fadeIn(items[nextIndex], 1000);

    dots[currentIndex].classList.remove(this.classNames.dotActivated);
    dots[nextIndex].classList.add(this.classNames.dotActivated);

    this.itemContainer.dataset.currentIndex = nextIndex;
  }
}
