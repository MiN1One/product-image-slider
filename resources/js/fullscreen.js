class FullScreen {
  isFullScreen = false;

  constructor({
    screenOpenEl,
    screenCloseEl,
    mainContainer,
    imageContainer,
    thumbnails,
    thumbnailsContainer
  }) {
    this.screenOpenEl = screenOpenEl;
    this.screenCloseEl = screenCloseEl;
    this.imageContainer = imageContainer;
    this.mainContainer = mainContainer;
    this.thumbnails = thumbnails;
    this.thumbnailsContainer = thumbnailsContainer;

    this.addListener();
  }

  addListener() {
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

    this.mainContainer.classList.toggle('visible');
  }

  renderThumbnails() {
    if (!this.thumbnailsContainer || !this.thumbnails || !this.thumbnails.length) {
      return;
    }

    this.thumbnailsContainer.innerHTML = '';

    this.thumbnails.forEach(el => {
      const img = new Image();
      img.src = el.src;
      img.className = 'fullscreen__thumb';
      img.alt = 'full-product-thumb';

      this.thumbnailsContainer.appendChild(img);
    });
  }

  renderImage() {
    if (!this.imageContainer || !this.mainContainer) return;

    const img = new Image();

    const activeImageCont = document.querySelector('.image-thumbnails__item.thumb-active');

    if (this.imageContainer.children.length) {
      this.imageContainer.removeChild(this.imageContainer.children[0]);
    }

    img.src = activeImageCont.children[0].src;
    img.className = 'fullscreen__img';
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

    this.renderImage();
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