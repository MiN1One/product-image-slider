class DragZoom {
  scale = 1;
  maxScale = 5;
  holding = false;
  xCoor = 0;
  yCoor = 0;
  holdStart = { x: 0, y: 0 };

  constructor(container, zoomInEl, zoomOutEl) {
    this.zoomContainer = container;
    this.zoomInEl = zoomInEl;
    this.zoomOutEl = zoomOutEl;

    this.addListeners();
  }

  resetZoom() {
    this.scale = 1;
    this.holding = false;
    this.xCoor = 0;
    this.yCoor = 0;
    this.holdStart = { x: 0, y: 0 };

    this.transform();
  }

  addListeners() {
    if (!this.zoomContainer) return;

    this.zoomContainer.addEventListener('mousedown', this.onMouseHold.bind(this));
    this.zoomContainer.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.zoomContainer.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.zoomContainer.addEventListener('mousewheel', this.onMouseScroll.bind(this));

    this.zoomInEl && this.zoomInEl.addEventListener('click', (e) => this.onMouseScroll(e, 120));
    this.zoomOutEl && this.zoomOutEl.addEventListener('click', (e) => this.onMouseScroll(e, -120));
  }

  onMouseUp() {
    this.holding = false;
  }

  onMouseMove(e) {
    this.preventZoomOut();
    e.preventDefault();

    if (
      !this.holding ||
      this.xCoor > 0 || 
      this.yCoor > 0 ||
      this.scale < 1
    ) {
      return;
    }
    
    this.xCoor = (e.clientX - this.holdStart.x);
    this.yCoor = (e.clientY - this.holdStart.y);

    this.transform();
  }

  onMouseHold(e) {
    e.preventDefault();

    this.holdStart.x = e.clientX - this.xCoor;
    this.holdStart.y = e.clientY - this.yCoor;
    this.holding = true;
  }

  preventZoomOut() {
    if (this.xCoor > 0 || this.yCoor > 0 || this.scale < 1) {
      this.yCoor = 0;
      this.xCoor = 0;
      this.scale = 1;
    }

    this.transform();
  }

  onMouseScroll(e, zoom) {
    e.preventDefault();

    if (this.xCoor > 0 || this.yCoor > 0) {
      return;
    }

    let xs, ys, delta, mouseY, mouseX, zoomingIn;
    if (zoom) {
      mouseX = window.innerWidth / 2;
      mouseY = window.innerHeight / 2;
      delta = zoom;
    } else {
      mouseX = e.clientX;
      mouseY = e.clientY;
      delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
    }

    zoomingIn = delta > 0;

    xs = (mouseX - this.xCoor) / this.scale;
    ys = (mouseY - this.yCoor) / this.scale;

    if (this.scale >= this.maxScale && zoomingIn) {
      return;
    }

    zoomingIn ? this.scale *= 1.2 : this.scale /= 1.2;
    
    this.xCoor = mouseX - xs * this.scale;
    this.yCoor = mouseY - ys * this.scale;

    this.preventZoomOut();
    this.transform();
  }

  transform() {
    this.zoomContainer.classList.toggle('zoom-active', this.holding);
    this.zoomContainer.style.transform = `translate(${this.xCoor}px, ${this.yCoor}px) scale(${this.scale})`;
  }
}