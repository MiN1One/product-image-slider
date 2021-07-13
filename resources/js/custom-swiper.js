class CustomSwiper {
  constructor (container, options, elements) {
    this.swiper = new Swiper(container, {
      ...options,
      simulateTouch: false,
      lazy: true,
      preloadImages: false,
      navigation: {
        nextEl: `${container} .btn-slider--next`,
        prevEl: `${container} .btn-slider--prev`,
        disabledClass: 'btn--disabled'
      }
    });

    this.thumbNailElements = elements;
    this.listenForSlideChange();
  }

  listenForSlideChange() {
    if (!this.thumbNailElements || !this.thumbNailElements.length) {
      return;
    }

    this.swiper.on('slideChange', this.thumbToggleActiveItem.bind(this));
  }

  thumbToggleActiveItem() {
    this.thumbNailElements.forEach((el, i) => {
      if (this.swiper.activeIndex === i) {
        el.classList.add('image-thumbnails__item--active');
      } else {
        el.classList.remove('image-thumbnails__item--active');
      }
    });
  }

  onClickThumbnail(index) {
    this.swiper.slideTo(index, 0);
  }

  attachThumbnailClickHandler() {
    if (this.thumbNailElements.length) {
      this.thumbNailElements.forEach((el, i) => {
        el.addEventListener('click', this.onClickThumbnail.bind(this, i));
      });

      this.thumbToggleActiveItem();
    }
  }
}