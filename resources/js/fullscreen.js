class FullScreen {
  isFullScreen = false;

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
  }

  addListeners() {
    if (!this.screenOpenEl || !this.screenCloseEl) return;

    this.screenCloseEl.addEventListener('click', this.toggleVisibility.bind(this));
    this.screenOpenEl.addEventListener('click', this.toggleVisibility.bind(this));
  }

  toggleVisibility() {
    if (this.isFullScreen) {
      this.closeFullscreen();

      this.isFullScreen = false;
      document.documentElement.removeAttribute('style');
    } else {
      this.openFullscreen();

      this.isFullScreen = true;
      document.documentElement.style.overflow = 'hidden';
    }

    this.mainContainer.classList.toggle('fullscreen--active');

    this.onFullScreenChange && this.onFullScreenChange();
  }

  onChangeImageFromThumbnail(index) {
    this.boundSwiper.onClickThumbnail(index);

    this.renderMainViewImage();
  }

  renderThumbnails() {
    if (
      !this.thumbnailsContainer || 
      !this.thumbnails || 
      !this.thumbnails.length
    ) {
      return;
    }

    this.thumbnailsContainer.innerHTML = '';

    this.thumbnails.forEach((el, i) => {
      const figureContainer = document.createElement('figure');
      figureContainer.className = 'fullscreen__thumbnails-item';
      figureContainer.tabIndex = 0;

      figureContainer.addEventListener('click', this.onChangeImageFromThumbnail.bind(this, i));

      const img = new Image();
      img.src = el.src;
      img.className = 'fullscreen__img';
      img.alt = 'full-product-thumbnail';

      figureContainer.appendChild(img);

      this.thumbnailsContainer.appendChild(figureContainer);
    });
  }

  renderMainViewImage() {
    if (!this.imageContainer || !this.mainContainer) return;
    const img = new Image();

    const activeImageCont = document.querySelector('.image-thumbnails__item--active');

    if (this.imageContainer.children.length) {
      this.imageContainer.removeChild(this.imageContainer.children[0]);
    }

    img.src = activeImageCont.children[0].src;
    img.className = 'fullscreen__img fullscreen__img--main';
    img.alt = 'product-full-image';

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
  }
}