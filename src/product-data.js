class ProductData {
  optionsData = {};

  constructor({
    productImages,
    variants,
    variantImages,
    variantsQuantity,
    optionsList
  }) {

    this.productImages = productImages;
    this.variants = variants;
    this.variantImages = variantImages;
    this.variantsQuantity = variantsQuantity;
    this.optionsList = optionsList;

    this.filterProductImages();
    this.initOptionsData();
    this.fillVariantsData();
  }

  filterProductImages() {
    this.productImages = this.productImages.filter(el => {
      const isVariantImage = this.variantImages.findIndex(varImg => {
        return (varImg.normal === el.normal && varImg.max === el.max);
      }) > -1;
  
      return !isVariantImage;
    });

    // Add one color variant image to product images
    this.productImages[this.productImages.length] = this.variantImages.length && this.variantImages[0];
  }
  
  setQuantity(variant) {
    this.variantsQuantity.forEach(q => {
      if (q.id === variant.id)
        variant['quantity'] = q.inventory;
    });
  }

  initOptionsData() {
    this.optionsList.forEach((el, i) => {
      const key = el.toLowerCase();

      this.optionsData[key] = {};
      this.optionsData[key]['options'] = {};
      this.optionsData[key]['products'] = {};
      this.optionsData[key]['optionIndex'] = i;
    });
  }

  setOptionsData(variant) {
    const productTitle = variant.title.split(' / ');

    for (let key in this.optionsData) {
      const { optionIndex } = this.optionsData[key];
  
      const optionTitle = productTitle[optionIndex];
      const slug = this.createSlug(optionTitle);
  
      let products = this.optionsData[key].products;
      
      products[slug] = slug in products ? [ ...products[slug], variant ] : [variant];
      
      this.optionsData[key].options[slug] = {
        title: optionTitle,
        image: key === 'color' ? variant.image : undefined,
        slug
      };

      variant[key] = this.optionsData[key].options[slug];
    }
  }

  fillVariantsData() {
    this.variants = this.variants.map((el, i) => {
      
      el['image'] = variantImages.length && variantImages[i];

      this.setOptionsData(el);
      this.setQuantity(el);
    
      return el;
    });
  };
  
  createSlug(str) {
    return str
    .split(' ')
    .join('-')
    .split('(')
    .join('')
    .split(')')
    .join('')
    .split("'")
    .join('')
    .toLowerCase();
  }
}

export default ProductData;