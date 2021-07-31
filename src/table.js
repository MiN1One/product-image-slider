export class DetailsTable {
  columnsLength = 0;
  rowsLength = 0;
  activeSizeOption;
  
  tableData = {};

  cartData = {
    totalPrice: 0,
    totalItemsCount: 0,
    items: {}
  };

  MATERIALS_FALLBACK = {
    options: {
      unique: {
        title: 'Unique',
        slug: 'unique'
      }
    }
  };

  constructor({
    variants,
    dataColumn,
    mainColumn,
    sizes,
    colors,
    tableElement,
    materials
  }) {
    // DATA
    this.variants = variants;
    this.colors = colors;
    this.sizes = sizes;
    this.materials = materials || this.MATERIALS_FALLBACK;

    // DOM ELEMENTS
    this.table = tableElement;
    this.dataColumn = dataColumn;
    this.mainColumn = mainColumn;

    // INITIALIZERS
    this.mediaSm = window.matchMedia('screen and (max-width: 34.375em)');
    this.mediaSm.onchange = this.alignColumnsWidth.bind(this);

    this.mediaMid = window.matchMedia('screen and (max-width: 48em)');
    this.mediaMid.onchange = this.alignColumnsWidth.bind(this);

    this.mediaTablet = window.matchMedia('screen and (max-width: 64em)');
    this.mediaTablet.onchange = this.alignColumnsWidth.bind(this);

    this.init();

    // this.hideHead();

    window.addEventListener('resize', this.alignRowsHeight.bind(this));
  }
  
  init(sizeOption) {
    if (!this.variants || !this.variants.length) {
      return;
    }

    this.activeSizeOption = sizeOption || Object.values(this.sizes.options)[0].slug;

    this.setTableData();
    this.setTableTitle();

    this.insertRows(this.mainColumn);
    this.insertRows(this.dataColumn);

    this.renderColorColumns();
    
    this.insertDataColumns();
    this.renderVariantsHead();
    this.renderVariants();

    this.alignColumnsWidth();
    this.alignRowsHeight();
  }

  hideHead() {
    if (Object.keys(this.sizes)?.length > 1) return;
    
    this.table.querySelector('.table-details__head').style.display = 'none';
  }

  setTableTitle(title) {
    title = title || this.sizes.options[this.activeSizeOption].title;
    const titleEl = this.table.querySelector('.table-details__head h5');

    if (titleEl.dataset.title === title) return;

    titleEl.innerHTML = title;
    titleEl.dataset.title = title;
  }

  setTableData() {
    const variants = [], materials = {};

    this.sizes.products[this.activeSizeOption].forEach(el => {
      for (let materialSlug in this.materials.options) {
        if (
          !('material' in el) || 
          el.material.slug === materialSlug || 
          materialSlug === 'unique'
        ) {
          materials[materialSlug] = {
            ...this.materials.options[materialSlug],
            price: el.price
          };

          variants.push({
            variant: el,
            column: Object.keys(materials).indexOf(materialSlug),
            row: Object.keys(this.colors.options).indexOf(el.color.slug)
          });
        }
      }
    });

    this.columnsLength = Object.keys(materials).length;
    this.rowsLength = Object.keys(this.colors.options).length;

    this.tableData = {
      variants,
      materials
    };
  }

  alignRowsHeight() {
    const mainRows = Array.from(this.mainColumn.children);

    mainRows.forEach((mainRow, index) => {
      const dataRow = this.dataColumn.children[index];
      
      const mainRowIsHigher = mainRow.offsetHeight > dataRow.offsetHeight;
      
      let dataRowHeight, mainRowHeight;

      if (mainRowIsHigher) {
        dataRowHeight = mainRow.offsetHeight;
        mainRowHeight = mainRow.offsetHeight;
      } else {
        mainRowHeight = dataRow.offsetHeight;
        dataRowHeight = dataRow.offsetHeight;
      }

      mainRow.style.minHeight = mainRowHeight + 'px';
      dataRow.style.minHeight = dataRowHeight + 'px';
    });
  }

  alignColumnsWidth() {
    const rows = Array.from(this.dataColumn.children);

    const COL_WIDTH = 250;
    const COL_WIDTH_SM = 225;
    const REFLECTIVE_CLASS = 'table-details--reflective';

    const fewColumns = this.columnsLength < 4;

    const adjustWidth = (row) => {
      const columns = Array.from(row.children);

      columns.forEach(column => {
        let cellWidth, mainColWidth, dataColWidth;
        
        if (
          this.mediaSm.matches ||
          (this.mediaMid.matches && this.columnsLength > 1) || 
          (this.mediaTablet.matches && !fewColumns)
        ) {
          this.table.classList.add(REFLECTIVE_CLASS);
          cellWidth = COL_WIDTH_SM + 'px';
          dataColWidth = '45%';
          mainColWidth = '55%';
        } else if (!this.mediaTablet.matches && !fewColumns) {
          cellWidth = COL_WIDTH + 'px';
          dataColWidth = '70%';
          mainColWidth = '30%';
          this.table.classList.add(REFLECTIVE_CLASS);
        } else {
          this.table.classList.remove(REFLECTIVE_CLASS);

          const dataWidth = this.columnsLength * COL_WIDTH / this.table.offsetWidth * 100;

          cellWidth = 100 / this.columnsLength + '%';
          dataColWidth = dataWidth + '%';
          mainColWidth = 100 - dataWidth + '%';
        }

        column.style.width = cellWidth;
        this.dataColumn.style.width = dataColWidth;
        this.mainColumn.style.width = mainColWidth;
      });
    }

    rows.forEach(row => adjustWidth(row));
  }

  renderColorColumns() {
    let index = 1;
    
    for (const [key, val] of Object.entries(this.colors.options)) {
      const templateCol = `
        <div class="table-details__column" data-color="${key}">
          <figure class="table-details__figure">
            <img 
              class="table-details__img" 
              alt="product" 
              src="${val.image.small}">
          </figure>
          <span class="table-details__product-title">${val.title}</span>
        </div>
      `;

      this.mainColumn.children[index].insertAdjacentHTML('afterbegin', templateCol);
      index++;
    }
  }

  renderVariantsHead() {
    const sizeTitle = this.sizes.options[this.activeSizeOption].title;

    Object.values(this.tableData.materials).forEach((material) => {
      const template = `
        <div 
          class="table-details__column table-details__column--main" 
          data-size="${this.activeSizeOption}" 
          data-material="${material.slug}"
        >
          <div class="table-details__col-top">
            <span class="table-details__product-title">
              ${material.title} / ${sizeTitle}
            </span>
            <span class="table-details__product-title table-details__product-title--price">
              $${(+material.price / 100).toString()}/ea
            </span>
          </div>
          <div class="table-details__group">
            <span class="table-details__cell">Qty</span>
            <span class="table-details__cell">Stock</span>
          </div>
        </div>
      `;
      
      this.dataColumn.children[0].insertAdjacentHTML('beforeend', template);
    });
  }

  renderVariants() {
    this.tableData.variants.forEach((variant) => {
      const row = this.dataColumn.children[variant.row + 1];
      const column = row.children[variant.column];

      const inputVal = this.cartData.items[variant.variant.id] || '';

      const template = `
        <div class="table-details__input-wrapper">
          <input 
            class="table-details__input" 
            type="number" 
            data-variant-id="${variant.variant.id}"
            value="${inputVal}">
        </div>
        <div class="table-details__label">
          ${variant.variant.quantity}<br/>
          ${variant.variant.quantity > 0 
            ? '<span class="table-details__label--success">In stock</span>' 
            : `
              <span class="table-details__label--danger">
                Out of stock<br/>
                <a>NOTIFY ME</a>
              </span>
            `
          }
        </div>
      `;
      
      column.insertAdjacentHTML('afterbegin', template);
      
      const inputEl = column.querySelector('input');
      inputEl.addEventListener('blur', this.onAddVariant.bind(this, variant.variant, inputEl));
    });
  }

  onAddVariant(variant, element) {
    if (+element.value <= 0 || element.value.trim() === '') {
      element.value = 0;
      delete this.cartData.items[variant.id];
    }

    element.value = variant.quantity < +element.value 
      ? variant.quantity 
      : element.value;

    this.cartData.items[variant.id] = +element.value;

    let totalPrice = 0, totalCount = 0;
    Object.entries(this.cartData.items).forEach(el => {
      const [id, value] = el;

      if (value) {
        const { price } = this.variants.find(({ id: varId }) => +id === +varId);

        totalCount += value;
        totalPrice += (+price / 100 * value);
      }
    });

    this.cartData.totalItemsCount = totalCount;
    this.cartData.totalPrice = totalPrice;

    this.updateTotals();
  }

  updateTotals() {
    const countEl = document.querySelector('.table-details__totalcount');
    const priceEl = document.querySelector('.table-details__totalprice');

    countEl.innerHTML = this.cartData.totalItemsCount;
    priceEl.innerHTML = '$' + this.cartData.totalPrice.toFixed(2);
  }

  insertDataColumns() {
    const rows = Array.from(this.dataColumn.children);
    
    rows.slice(1, rows.length).forEach((row) => {
      for (let i = 0; i < this.columnsLength; i++) {
        const colTemplate = '<div class="table-details__column"></div>';
        
        row.insertAdjacentHTML('afterbegin', colTemplate);
      }
    });
  }

  insertRows(container) {
    container.innerHTML = '';

    for (let i = 0; i < this.rowsLength + 1; i++) {
      let template = '<div class="table-details__row"></div>';

      container.insertAdjacentHTML('beforeend', template);
    }
  }
}