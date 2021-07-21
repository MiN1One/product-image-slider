export default class ImageZoom {
  // !------- NOTE -----
  // Ratio more than 2 can get BUGGY :))!

  ratio = 2;
  image;
  zoomContainer;

  constructor(container) {
    this.container = container;

    this.init();
  }

  attachEvents() {
    this.container.addEventListener("mousemove", this.onMouseEnter.bind(this));
    this.container.addEventListener("touchmove", this.onMouseEnter.bind(this));

    this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.container.addEventListener('touchend', this.onMouseLeave.bind(this));

    window.addEventListener('resize', this.setSize.bind(this));
  }

  setImage(imgSrc) {
    this.zoomContainer.style.backgroundImage = `url(${imgSrc})`;
  }

  setSize(img) {
    const { cx, cy } = this.getImageScaleByRatio();
    console.log('resized');

    const image = img || this.image;

    this.zoomContainer.style.backgroundSize = `${image.width * cx}px ${image.height * cy}px`;
  }

  init() {
    if (!this.container) return;

    this.attachEvents();

    this.image = this.container.querySelector('img');
    this.zoomContainer = this.container.querySelector('.image-preview__zoom');

    this.setImage(this.image.src || this.image.dataset.src);
    this.setSize();
  }

  getImageScaleByRatio() {
    const cx = this.zoomContainer.offsetWidth / (this.zoomContainer.offsetWidth / this.ratio);
    const cy = this.zoomContainer.offsetHeight / (this.zoomContainer.offsetHeight / this.ratio);

    return { cx, cy };
  }
  
  getCursorPosition(event) {
    event = event || window.event;
    const bounds = this.image.getBoundingClientRect();

    let mouseX = event.pageX - bounds.left;
    let mouseY = event.pageY - bounds.top;

    mouseX = mouseX - window.pageXOffset;
    mouseY = mouseY - window.pageYOffset;

    return { mouseX, mouseY };
  }

  onMouseEnter(event) {
    event.preventDefault();

    this.zoomContainer.classList.add('image-preview__zoom--active');

    const { mouseX, mouseY } = this.getCursorPosition(event);

    let x = mouseX;
    let y = mouseY;

    if (x > this.container.offsetWidth) x = this.container.offsetWidth;
    if (y > this.container.offsetHeight) y = this.container.offsetHeight;

    if (x < 0) x = 0;
    if (y < 0) y = 0;

    const { cx, cy } = this.getImageScaleByRatio();

    let positionX = x * cx;
    let positionY = y * cy;

    const widthScaled = this.container.offsetWidth * this.ratio;
    const heightScaled = this.container.offsetHeight * this.ratio;

    if (positionX > widthScaled) positionX = widthScaled;
    if (positionY > heightScaled) positionY = heightScaled;

    this.zoomContainer.style.backgroundPosition = `-${positionX / this.ratio}px -${positionY / this.ratio}px`;
  }
  
  onMouseLeave() {
    this.zoomContainer.classList.remove('image-preview__zoom--active');
    this.zoomContainer.style.removeProperty('background-position');
  }
}