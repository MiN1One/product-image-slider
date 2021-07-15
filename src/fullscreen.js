import CustomSwiper from './custom-swiper';

class FullScreen {
  isFullScreen = false;
  swiper;

  constructor({
    screenOpenEl,
    screenCloseEl,
    mainContainer,
    imageContainer,
    thumbnails,
    thumbnailsContainer,
    boundSwiper,
    onFullScreenChange
  }) {
    this.screenOpenEl = screenOpenEl;
    this.screenCloseEl = screenCloseEl;
    this.imageContainer = imageContainer;
    this.mainContainer = mainContainer;
    this.thumbnails = thumbnails;
    this.thumbnailsContainer = thumbnailsContainer;
    this.boundSwiper = boundSwiper;
    this.onFullScreenChange = onFullScreenChange;

    this.addListeners();
    this.initializeThumbnailsSwiper();
  }

  initializeThumbnailsSwiper() {
    if (!this.thumbnailsContainer && !this.thumbnails) {
      return;
    }

    this.swiper = new CustomSwiper(`.${this.thumbnailsContainer.className}`, {
      direction: 'vertical',
      slidesPerView: 4,
      preloadImages: true,
      updateOnImagesReady: true,
      mousewheel: true,
      simulateTouch: true
    });
  }

  addListeners() {
    if (!this.screenOpenEl || !this.screenCloseEl) return;

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.mainContainer.classList.remove('fullscreen--active');
        this.isFullScreen = false;
        
        document.documentElement.removeAttribute('style');
        this.onFullScreenChange && this.onFullScreenChange();
      }
    });

    this.screenCloseEl.addEventListener('click', this.toggleVisibility.bind(this));
    this.screenOpenEl.addEventListener('click', this.toggleVisibility.bind(this));
  }

  toggleVisibility() {
    if (this.isFullScreen) {
      this.closeFullscreen();

      this.isFullScreen = false;
    } else {
      this.openFullscreen();

      this.isFullScreen = true;
    }

    this.mainContainer.classList.toggle('fullscreen--active');

    this.onFullScreenChange && this.onFullScreenChange();
  }

  onChangeImageFromThumbnail(index) {
    this.boundSwiper.onClickThumbnail(index);

    this.renderMainViewImage();
  }

  setLoading(image, src) {
    if (!image) return;
    
    const loader = document.querySelector('.fullscreen .loader');

    loader.style.display = 'flex';
    image.src = src;

    if (image.complete) {
      loader.style.display = 'none';
      image.classList.remove('fullscreen__img--loading');
      image.onload = null;
    } else {
      image.onload = () => {
        loader.style.display = 'none';
        image.classList.remove('fullscreen__img--loading');
        image.onload = null;
      };
    }
  }

  renderThumbnails() {
    if (
      !this.thumbnailsContainer || 
      !this.thumbnails || 
      !this.thumbnails.length
    ) {
      return;
    }

    const wrapper = this.thumbnailsContainer.children[0];
    wrapper.innerHTML = '';

    this.thumbnails.forEach((el, i) => {
      const thumbnailItem = document.createElement('div');
      thumbnailItem.className = 'fullscreen__thumbnails-item swiper-slide';
      thumbnailItem.tabIndex = 0;

      thumbnailItem.addEventListener('click', this.onChangeImageFromThumbnail.bind(this, i));

      const img = new Image();
      img.src = el.src;
      img.className = 'fullscreen__img';
      img.alt = 'full-product-thumbnail';

      thumbnailItem.appendChild(img);

      wrapper.appendChild(thumbnailItem);
    });

    this.swiper && this.swiper.swiper.updateSlides();
  }

  renderMainViewImage() {
    if (!this.imageContainer || !this.mainContainer) return;
    
    const img = new Image();

    const activeImageCont = document.querySelector('.image-thumbnails__item--active');

    if (this.imageContainer.children.length) {
      this.imageContainer.removeChild(this.imageContainer.children[0]);
    }

    img.className = 'fullscreen__img fullscreen__img--main fullscreen__img--loading';
    img.alt = 'product-full-image';

    const imageSrc = activeImageCont.children[0].dataset.srcMax;
    this.setLoading(img, imageSrc);

    this.imageContainer.appendChild(img);
  }

  openFullscreen() {
    const html = document.documentElement;

    if (html.requestFullscreen) {
      html.requestFullscreen();
    } else if (html.webkitRequestFullscreen) {
      html.webkitRequestFullscreen();
    } else if (html.msRequestFullscreen) {
      html.msRequestFullscreen();
    }

    document.documentElement.style.overflow = 'hidden';
    this.renderMainViewImage();
    this.renderThumbnails();
  }

  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    document.documentElement.removeAttribute('style');
  }
}

export default FullScreen;