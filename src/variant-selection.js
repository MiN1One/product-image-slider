import imagePreloader from "./imagePreloader";

export default class VariantSelection {
  constructor({
    variants,
    sizeVariants,
    boundSwiperMain,
    boundSwiperThumbnails,
    colorVariants,
    colorsContainer,
    sizesContainer,
    onSelectSize
  }) {
    // DOM ELEMENTS
    this.colorsContainer = colorsContainer;
    this.sizesContainer = sizesContainer;

    // DATA
    this.variants = variants;
    this.sizeVariants = sizeVariants;
    this.colorVariants = colorVariants;

    // ATTACHED SWIPERS
    this.boundSwiperThumbnails = boundSwiperThumbnails;
    this.boundSwiperMain = boundSwiperMain;

    // CALLBACKS 
    this.onSelectSize = onSelectSize;

    // INITIALIZERS
    this.renderColorOptions();
    this.renderSizeOptions();
    this.hideOptions();
  }

  hideOptions() {
    if (Object.keys(this.sizeVariants)?.length <= 1) {
      this.sizesContainer.style.display = 'none';
    }

    if (Object.keys(this.colorVariants)?.length <= 1) {
      this.colorsContainer.style.display = 'none';
    }
  }

  renderSizeOptions() {
    if (!this.sizesContainer || !this.sizeVariants) {
      return;
    }

    const container = this.sizesContainer.querySelector('.sizes');

    for (const [key, val] of Object.entries(this.sizeVariants)) {
      const template = `
        <li data-size=${key}>
          ${val.title}
        </li>
      `;

      container.insertAdjacentHTML('beforeend', template);
    }

    Array.from(container.children).forEach(el => {
      const slug = el.dataset.size;

      el.addEventListener('click', this.onSelectBySize.bind(this, slug));
    });
  }

  animateUIForColor(colorSlug) {
    Array.from(this.colorsContainer.querySelectorAll('[data-color]')).forEach(el => {
      if (colorSlug === el.dataset.color) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  renderColorOptions() {
    if (!this.colorVariants || !this.colorsContainer) return;

    const container = this.colorsContainer.querySelector('.container');

    for (const [key, val] of Object.entries(this.colorVariants)) {
      const colorElement = `
        <div class="color" data-color="${key}">
          <div>
            <div class="color-circle ${key}"></div>
          </div>
          <div class="color-tooltip">
            ${val.title.toUpperCase()}
            <div class="color-arrow">
              <i class="color-caret"></i>
            </div>
          </div>
        </div>
      `;

      container.insertAdjacentHTML('afterbegin', colorElement);
    }

    Array.from(this.colorsContainer.querySelectorAll('[data-color]'))
      .forEach((el) => {
        const slug = el.dataset.color;
        
        el.addEventListener('click', this.onSelectByColor.bind(this, slug))
      });
  }

  onSelectBySize(sizeSlug) {
    if (sizeSlug === this.activeSize) return;

    this.activeSize = sizeSlug;

    this.onSelectSize && this.onSelectSize(sizeSlug);
  }

  setActiveColorTitle(colorSlug) {
    if (!colorSlug) return;

    const activeColor = this.colorVariants[colorSlug].title?.toUpperCase();
    
    this.colorsContainer.querySelector('.active-color-title').innerHTML = activeColor;
  }
  
  onSelectByColor(slug) {
    const { swiper: swiperMain } = this.boundSwiperMain;
    const { swiper: swiperThumbnails } = this.boundSwiperThumbnails;
    const { image: { normal, small, max } } = this.colorVariants[slug];

    swiperMain.slideTo(swiperMain.slides.length, 700);
    this.boundSwiperThumbnails.thumbToggleActiveItem(swiperMain.activeIndex);

    const lastMainSlide = swiperMain.slides[swiperMain.slides.length - 1];

    const mainImage = lastMainSlide.querySelector('img');

    const zoomObj = this.boundSwiperMain.slidesImageZoom[swiperMain.slides.length - 1];

    imagePreloader({
      image: normal,
      startCb: () => {
        mainImage.classList.remove('swiper-lazy-loaded');
        mainImage.classList.add('swiper-lazy-loading');
      },
      endCb: () => {
        mainImage.classList.add('swiper-lazy-loaded');
        mainImage.classList.remove('swiper-lazy-loading');
        mainImage.setAttribute('src', normal);
      }
    });

    zoomObj.setImage(normal);
    zoomObj.setSize();

    swiperMain.lazy.load();

    const thumbnailImage = swiperThumbnails.slides[swiperThumbnails.slides.length - 1].querySelector('img');
    thumbnailImage.setAttribute('src', small);
    thumbnailImage.dataset.srcMax = max;

    this.setActiveColorTitle(slug);
    this.animateUIForColor(slug);

    swiperMain.update();
  }
}