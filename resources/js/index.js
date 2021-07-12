document.addEventListener('DOMContentLoaded', () => {

  const thumbElements = Array.from(document.querySelectorAll('.image-thumbnails__item'));

  // MAIN CAROUSEL
  const swiperOptions = { slidesPerView: 1 };
  const swiper = new CustomSwiper('.swiper-container', swiperOptions, thumbElements);

  swiper.attachThumbnailClickHandler();

  // FULL SCREEN
  const params = {
    screenOpenEl: document.querySelector('.btn-zoom'), 
    mainContainer: document.querySelector('.fullscreen'), 
    screenCloseEl: document.querySelector('.fullscreen__btn-close'),
    imageContainer: document.querySelector('.fullscreen__figure'),
    thumbnails: Array.from(document.querySelectorAll('.image-thumbnails__item img')),
    thumbnailsContainer: document.querySelector('.fullscreen__thumbnails')
  };

  new FullScreen(params);
  
  // IMAGE ZOOM
  $('.swiper-slide').easyZoom();
});