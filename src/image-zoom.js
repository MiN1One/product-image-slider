export default class ImageZoom {
  ratio = 3;
  image;
  zoomContainer;

  constructor(container, ratio) {
    this.container = container;
    this.ratio = ratio || this.ratio;

    this.init();
  }

  attachEvents() {
    this.container.addEventListener("mousemove", this.onMouseEnter.bind(this));
    this.container.addEventListener("touchmove", this.onMouseEnter.bind(this));

    this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.container.addEventListener('touchend', this.onMouseLeave.bind(this));
  }

  setImage(imgSrc = this.image.src || this.image.dataset.src) {
    this.zoomContainer.style.backgroundImage = `url(${imgSrc})`;
  }

  setSize() {
    this.zoomContainer.style.backgroundSize = `contain`;
    this.zoomContainer.style.backgroundPosition = `center center`;
    this.zoomContainer.style.width = `${100 * this.ratio}%`;
    this.zoomContainer.style.height = `${100 * this.ratio}%`;
  }

  init() {
    if (!this.container) return;

    this.attachEvents();

    this.image = this.container.querySelector('img');
    this.zoomContainer = this.container.querySelector('.image-preview__zoom');

    this.setImage();
    this.setSize();
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
    this.image.classList.add('image-preview__image--hide');

    const { mouseX, mouseY } = this.getCursorPosition(event);

    console.log(parseInt(mouseX), parseInt(mouseY));

    let x = mouseX;
    let y = mouseY;

    if (x > this.container.offsetWidth) x = this.container.offsetWidth;
    if (y > this.container.offsetHeight) y = this.container.offsetHeight;

    if (x < 0) x = 0;
    if (y < 0) y = 0;

    this.zoomContainer.style.left = `-${x * (this.ratio - 1)}px`;
    this.zoomContainer.style.top = `-${y * (this.ratio - 1)}px`;
    
    // Grab effect
    // this.zoomContainer.style.left = `-${this.zoomContainer.offsetWidth / this.ratio - x}px`;
    // this.zoomContainer.style.top = `-${this.zoomContainer.offsetHeight / this.ratio - y}px`;
  }
  
  onMouseLeave() {
    this.zoomContainer.style.removeProperty('top');
    this.zoomContainer.style.removeProperty('left');
    this.image.classList.remove('image-preview__image--hide');
    this.zoomContainer.classList.remove('image-preview__zoom--active');
  }
}