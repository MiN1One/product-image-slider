// import Swiper from 'swiper';

class CustomSwiper {
  constructor (container, options) {
    this.container = container;

    this.swiper = new Swiper(container, {

      simulateTouch: false,
      preloadImages: false,
      ...options,
      breakpoints: {
        ...options?.breakpoints,
        100: {
          simulateTouch: true,
        }
      },
      updateOnImagesReady: true,
      navigation: {
        nextEl: `${container} .btn-slider--next`,
        prevEl: `${container} .btn-slider--prev`,
        disabledClass: 'btn--disabled'
      }
      
    });

    this.swiper.on('lazyImageReady', () => this.swiper.update());
  }

  renderSlides(images) {
    const slides = images.map(el => {
      return `
        <div class="swiper-slide image-preview__image-item">
          <a href="${el.normal}">
            <img 
              width="100%"
              height="100%"
              data-src="${el.normal}" 
              alt="product-image"
              class="swiper-lazy">
            <div class="loader">
              <div class="loader__spinner"></div>
            </div>
          </a>
        </div>
      `;
    });

    this.swiper.appendSlide(slides);
    this.swiper.lazy.load();
  }

  static attachChangeHandler(swiperMain, swiperThumbnailsCustom) {
    swiperMain.on(
      'slideChange', 
      () => swiperThumbnailsCustom.thumbToggleActiveItem(swiperMain.activeIndex)
    );
  }

  renderThumbanails(images) {
    if (!images.length) return;

    const thumbs = images.map(el => {
      return `
        <div class="image-thumbnails__item swiper-slide" tabindex="0">
          <img
            height="100%"
            width="100%"
            data-src-max="${el.max}"
            src="${el.normal}" 
            alt="product-thumbnail">
        </div>
      `;
    });
    
    this.swiper.appendSlide(thumbs);
    this.swiper.lazy.load();
  }

  thumbToggleActiveItem(activeIndex = this.swiper.active) {
    this.swiper.slides.forEach((el, i) => {

      if (activeIndex === i) {
        el.classList.add('image-thumbnails__item--active');
      } else {
        el.classList.remove('image-thumbnails__item--active');
      }

    });
  }

  onClickThumbnail(swiper, index) {
    swiper.slideTo(index, 300);

    this.thumbToggleActiveItem(index);
  }

  attachThumbnailClickHandler(swiperToControl) {
    if (!this.swiper.slides.length) return;

    this.swiper.slides.forEach((el, i) => {
      el.addEventListener('click', this.onClickThumbnail.bind(this, swiperToControl, i));
    });

    this.thumbToggleActiveItem(swiperToControl.activeIndex);
  }
}

export default CustomSwiper;