// CRAZY TABLE STYLING

const styleTables = () => {
  const mainColumn = document.querySelector('.table-details__main-col');
  const dataColumn = document.querySelector('.table-details__data-col');

  const columnsLength = dataColumn.children[0].children.length;

  Array.from(mainColumn.children).forEach((el, i) => {
    const adjacentCol = dataColumn.children[i];

    if (el.offsetHeight > adjacentCol.offsetHeight) {
      adjacentCol.style.height = `${el.offsetHeight}px`;
    } else {
      el.style.height = `${adjacentCol.offsetHeight}px`;
    }

  });

  const mediaTablet = window.matchMedia('(max-width: 64em)');
  mediaTablet.onchange = adjustColumnDimensions;

  function adjustColumnDimensions() {

    Array.from(dataColumn.children).forEach(el => {
      Array.from(el.children).forEach(column => {

        if (mediaTablet.matches && columnsLength > 3) {
          column.style.width = `200px`;
          mainColumn.classList.add('table-details__main-col--scroll');
        } else {
          column.style.width = `${100 / columnsLength}%`;
          mainColumn.classList.remove('table-details__main-col--scroll');
        }
        
      }); 
    })
  };

  adjustColumnDimensions();
};

export default styleTables;