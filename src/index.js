import CustomSwiper from './custom-swiper';
import DragFullScreenZoom from './drag-zoom';
import FullScreen from './fullscreen';
import VariantSelection from './variant-selection';
import { DetailsTable } from './table';
import ProductData from './product-data';

document.addEventListener('DOMContentLoaded', () => {
  const productData = new ProductData({
    productImages,
    variants,
    variantImages,
    variantsQuantity,
    optionsList
  });
  console.log(productData);

  // MAIN CAROUSEL
  const mainSlider = new CustomSwiper('.image-preview__images', {
    slidesPerView: 1, 
    lazy: true
  });
  mainSlider.renderSlides(productData.productImages);

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
  thumbnailSlider.renderThumbanails(productData.productImages);
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

  // TABLE
  const table = new DetailsTable({
    variants: window.variants,
    dataColumn: document.querySelector('.table-details__data-col'),
    mainColumn: document.querySelector('.table-details__main-col'),
    tableElement: document.querySelector('.table-details'),
    sizes: productData.optionsData.size,
    colors: productData.optionsData.color,
    materials: productData.optionsData.material
  });
  
  // PRODUCT VARIANTS
  new VariantSelection({
    colorsContainer: document.querySelector('.color-filter-container'),
    sizesContainer: document.querySelector('.size-tabs-container'),
    variants: productData.variants,
    sizeVariants: productData.optionsData.size.options,
    colorVariants: productData.optionsData.color.options,
    boundSwiperMain: mainSlider,
    boundSwiperThumbnails: thumbnailSlider,
    onSelectSize: (sizeSlug) => table.init(sizeSlug)
  });
});