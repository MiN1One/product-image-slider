export default ({ image, startCb, endCb }) => {
  if (!image) return;
  
  const img = new Image();

  img.src = image;
  startCb();

  if (img.complete) {
    endCb();
    img.onload = null;
  } else {
    img.onload = () => {
      endCb();
      img.onload = null;
    };
  }
};