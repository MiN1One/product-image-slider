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
  }) {
    this.colorsContainer = colorsContainer;
    this.sizesContainer = sizesContainer;

    this.variants = variants;
    this.sizeVariants = sizeVariants;
    this.colorVariants = colorVariants;

    this.boundSwiperThumbnails = boundSwiperThumbnails;
    this.boundSwiperMain = boundSwiperMain;

    this.renderColorOptions();

    if (this.sizeVariants && this.sizeVariants.length) {
      this.renderSizeOptions();
    }
  }

  renderSizeOptions() {
    
  }

  animateUI(colorSlug) {
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
        <div class="color" data-color=${key}>
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
        const color = this.colorVariants[slug];
        
        el.addEventListener('click', () => this.onSelectByColor(color, slug))
      });
  }

  setActiveColorTitle(colorSlug) {
    if (!colorSlug) return;

    const activeColor = this.colorVariants[colorSlug].title?.toUpperCase();
    
    this.colorsContainer.querySelector('.active-color-title').innerHTML = activeColor;
  }
  
  onSelectByColor(colorObj, slug) {
    const { swiper: swiperMain } = this.boundSwiperMain;
    const { swiper: swiperThumbnails } = this.boundSwiperThumbnails;
    const { image: { normal, small, max } } = colorObj;

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
    this.animateUI(slug);

    swiperMain.update();
  }
}