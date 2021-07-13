document.addEventListener('DOMContentLoaded', () => {

  const thumbElements = Array.from(document.querySelectorAll('.image-thumbnails__item'));

  // MAIN CAROUSEL
  const swiperOptions = { slidesPerView: 1 };
  const swiper = new CustomSwiper('.image-preview__images', swiperOptions, thumbElements);
  swiper.attachThumbnailClickHandler();

  const params = {
    screenOpenEl: document.querySelector('.btn-zoom'), 
    mainContainer: document.querySelector('.fullscreen'), 
    screenCloseEl: document.querySelector('.fullscreen__btn-close'),
    imageContainer: document.querySelector('.fullscreen__figure'),
    thumbnails: Array.from(document.querySelectorAll('.image-thumbnails__item img')),
    thumbnailsContainer: document.querySelector('.fullscreen__thumbnails'),
    boundSwiper: swiper
  };

  // FULL SCREEN ZOOM
  const zoomInEl = document.querySelector('.fullscreen__btn-zoom--in');
  const zoomOutEl = document.querySelector('.fullscreen__btn-zoom--out');
  const zoom = new DragZoom(params.imageContainer, zoomInEl, zoomOutEl);

  // FULL SCREEN
  params['onFullScreenChange'] = zoom.resetZoom.bind(zoom);
  new FullScreen(params);
  
  // IMAGE ZOOM
  $('.swiper-slide').easyZoom();
});