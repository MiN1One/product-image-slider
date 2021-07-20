export default class VariantSelection {
  constructor({
    variants,
    container,
    sizeVariants,
    boundSwiperMain,
    boundSwiperThumbnails,
    colorVariants,
    colorsContainer,
    sizesContainer,
    onChangeColor
  }) {
    this.colorsContainer = colorsContainer;
    this.sizesContainer = sizesContainer;

    this.variants = variants;
    this.sizeVariants = sizeVariants;
    this.colorVariants = colorVariants;
    this.container = container;
    this.boundSwiperThumbnails = boundSwiperThumbnails;
    this.boundSwiperMain = boundSwiperMain;
    this.onChangeColor = onChangeColor;

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
    if (!this.colorVariants) return;

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

      this.colorsContainer.insertAdjacentHTML('afterbegin', colorElement);
    }

    Array.from(this.colorsContainer.querySelectorAll('[data-color]'))
      .forEach((el) => {
        const slug = el.dataset.color;
        const color = this.colorVariants[slug];
        
        el.addEventListener('click', () => this.onSelectByColor(color, slug))
      });
  }
  
  onSelectByColor(colorObj, slug) {
    const { swiper: swiperMain } = this.boundSwiperMain;
    const { swiper: swiperThumbnails } = this.boundSwiperThumbnails;
    const { image: { normal, small, max } } = colorObj;

    swiperMain.slideTo(swiperMain.slides.length, 700);
    this.boundSwiperThumbnails.thumbToggleActiveItem(swiperMain.activeIndex);

    const lastMainSlide = swiperMain.slides[swiperMain.slides.length - 1];

    const mainImage = lastMainSlide.querySelector('img');
    const mainImageWrapper = lastMainSlide.querySelector('a');

    mainImageWrapper.href = normal;

    // this.onChangeColor(normal);

    if (mainImage.src === '') {
      mainImage.dataset.src = normal;
    } else {
      mainImage.setAttribute('src', normal);
    }

    swiperMain.lazy.load();

    const thumbnailImage = swiperThumbnails.slides[swiperThumbnails.slides.length - 1].querySelector('img');
    thumbnailImage.setAttribute('src', small);
    thumbnailImage.dataset.srcMax = max;

    this.animateUI(slug);
    swiperMain.update();
  }
}