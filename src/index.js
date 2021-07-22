import CustomSwiper from './custom-swiper';
import DragFullScreenZoom from './drag-zoom';
import FullScreen from './fullscreen';
import VariantSelection from './variant-selection';
import styleTables from './table';

document.addEventListener('DOMContentLoaded', () => {
  // MAIN CAROUSEL
  const swiperOptions = { slidesPerView: 1, lazy: true };

  const mainSlider = new CustomSwiper('.image-preview__images', swiperOptions);
  mainSlider.renderSlides(window.images);

  // THUMBNAILS SWIPER
  const thumbnailSlider = new CustomSwiper('.image-thumbnails', {
    simulateTouch: true,
    mousewheel: true,
    slidesPerView: 5,
    breakpoints: {
      200: { slidesPerView: 3 },
      420: { slidesPerView: 4 }
    }
  });
  thumbnailSlider.renderThumbanails(window.images);
  thumbnailSlider.attachThumbnailClickHandler(mainSlider.swiper);

  // SWIPER ACTIVE INDEX FIX
  CustomSwiper.attachChangeHandler(mainSlider.swiper, thumbnailSlider);

  const params = {
    screenOpenEl: document.querySelector('.btn-zoom'), 
    mainContainer: document.querySelector('.fullscreen'), 
    screenCloseEl: document.querySelector('.fullscreen__btn-close'),
    imageContainer: document.querySelector('.fullscreen__figure'),
    thumbnails: Array.from(document.querySelectorAll('.image-thumbnails__item img')),
    thumbnailsContainer: document.querySelector('.fullscreen__thumbnails'),
    boundSwiperMain: mainSlider,
    boundSwiperThumbnails: thumbnailSlider
  };

  // FULL SCREEN ZOOM
  const zoomInEl = document.querySelector('.fullscreen__btn-zoom--in');
  const zoomOutEl = document.querySelector('.fullscreen__btn-zoom--out');
  const zoom = new DragFullScreenZoom(params.imageContainer, zoomInEl, zoomOutEl);

  // FULL SCREEN
  params['onFullScreenChange'] = zoom.resetZoom.bind(zoom);
  new FullScreen(params);
  
  // PRODUCT VARIANTS
  new VariantSelection({
    colorsContainer: document.querySelector('.color-filter-container .container'),
    sizesContainer: document.querySelector('.size-tabs-container .sizes'),
    variants: window.variants,
    sizeVariants: window.sizes,
    colorVariants: window.colors,
    boundSwiperMain: mainSlider,
    boundSwiperThumbnails: thumbnailSlider
  });

  styleTables();
});