import CustomSwiper from './custom-swiper';
import DragFullScreenZoom from './drag-zoom';
import FullScreen from './fullscreen';

document.addEventListener('DOMContentLoaded', () => {

  const thumbElements = Array.from(document.querySelectorAll('.image-thumbnails__item'));

  // MAIN CAROUSEL
  const swiperOptions = { slidesPerView: 1, lazy: true };
  const mainSlider = new CustomSwiper('.image-preview__images', swiperOptions, thumbElements);
  mainSlider.attachThumbnailClickHandler();

  const params = {
    screenOpenEl: document.querySelector('.btn-zoom'), 
    mainContainer: document.querySelector('.fullscreen'), 
    screenCloseEl: document.querySelector('.fullscreen__btn-close'),
    imageContainer: document.querySelector('.fullscreen__figure'),
    thumbnails: Array.from(document.querySelectorAll('.image-thumbnails__item img')),
    thumbnailsContainer: document.querySelector('.fullscreen__thumbnails'),
    boundSwiper: mainSlider
  };

  // THUMBNAILs SWIPER
  new CustomSwiper('.image-thumbnails', {
    simulateTouch: true,
    mousewheel: true,
    slidesPerView: 5,
    breakpoints: {
      200: { slidesPerView: 3 },
      420: { slidesPerView: 4 }
    }
  });

  // FULL SCREEN ZOOM
  const zoomInEl = document.querySelector('.fullscreen__btn-zoom--in');
  const zoomOutEl = document.querySelector('.fullscreen__btn-zoom--out');
  
  const zoom = new DragFullScreenZoom(params.imageContainer, zoomInEl, zoomOutEl);

  // FULL SCREEN
  params['onFullScreenChange'] = zoom.resetZoom.bind(zoom);
  new FullScreen(params);
  
  // IMAGE ZOOM
  $('.image-preview__image-item.swiper-slide').easyZoom();
});