class ImageZoom {
  imageElements;

  constructor(containers) {
    this.imageContainers = !(containers instanceof Array) ? [containers] : containers;

    this.getImages();
    this.attachEvents();
  }

  attachEvents() {
    if (!this.imageElements) return;

    this.imageContainers.forEach((el, i) => {
      el.addEventListener('touchmove', (e) => this.onZoomIn(e, i));
      el.addEventListener('mousemove', (e) => this.onZoomIn(e, i));
      el.addEventListener('mouseleave', () => this.onZoomOut(i));
    });
  }

  createZoomContainer() {
    const div = document.createElement('div');
    div.className = 'image-preview__zoomimage';

    return div;
  }

  getCursorPosition(event, element) {
    const bounds = element.getBoundingClientRect();

    const
      x = (event.pageX - bounds.left) - window.pageXOffset,
      y = (event.pageY - bounds.top) - window.pageXOffset;

    return { x, y };
  }

  onZoomIn(event, index) {

    const 
      activeImageElement = this.imageElements[index],
      activeImageContainer = this.imageContainers[index],
      zoomedImage = activeImageElement.zoomContainer;

    const { width: imageWidth, height: imageHeight } = activeImageElement.element;

    const { x, y } = this.getCursorPosition(event, activeImageContainer);

    const 
      positionLeft = x - zoomedImage.offsetWidth / 2,
      positionTop = y - zoomedImage.offsetHeight / 2;

    let
      xPercents = (x / imageWidth) * 100,
      yPercents = (y / imageHeight) * 100;

    if (x > 0.01 * imageWidth) {
      xPercents += 0.15 * xPercents;
    }

    if (y >= 0.01 * imageHeight) {
      yPercents += 0.15 * yPercents;
    }

    zoomedImage.style.backgroundImage = `url(${activeImageElement.src})`;
    
    zoomedImage.style.left = `${positionLeft}px`;
    zoomedImage.style.top = `${positionTop}px`;
    
    zoomedImage.style.backgroundPosition = `${xPercents}% ${yPercents}%`;
  }
  
  onZoomOut(index) {
    this.imageElements[index].zoomContainer.removeAttribute('style');
  }

  getImages() {
    if (!this.imageContainers || !this.imageContainers.length) {
      return;
    }

    const elements = [];
    this.imageContainers.forEach(el => {

      for (const child of el.children) {

        if (child.tagName === 'IMG') {

          const zoomedImage = this.createZoomContainer();
          el.appendChild(zoomedImage);

          elements.push({
            element: child,
            src: child.src || child.dataset.src,
            zoomContainer: zoomedImage
          });

        }
      }

    });

    this.imageElements = elements;
  }
}