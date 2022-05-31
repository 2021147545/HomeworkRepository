let counter = 1

fetch('products.json')
  .then( response => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then( json => initialize(json) )
  .catch( err => console.error(`Fetch problem: ${err.message}`) );

window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        load();
    }
}

function initialize(products) {

  const category = document.querySelector('#category');
  const searchTerm = document.querySelector('#searchTerm');
  const searchBtn = document.querySelector('button');
  const main = document.querySelector('main');

  let lastCategory = category.value;
  let lastSearch = '';

  let categoryGroup = [];
  let finalGroup = [];

  finalGroup = products;
  updateDisplay();

  searchBtn.addEventListener('click', selectCategory);

  function selectCategory(e) {
    e.preventDefault();
    counter = 1;
    categoryGroup = [];
    finalGroup = [];

    if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();

      if (category.value === 'All') {
        categoryGroup = products;
        selectProducts();
      } else {
        const lowerCaseType = category.value.toLowerCase();
        categoryGroup = products.filter( product => product.type === lowerCaseType );

        for(let r = 0; r<products.length; r++){
          if(products[r].type === lowerCaseType){
            categoryGroup.push(products[r]);
          }
        }

        selectProducts();
      }
    }
  }

  function selectProducts() {
    if (searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
    } else {
      const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      //finalGroup = categoryGroup.filter( product => product.name.includes(lowerCaseSearchTerm));
      for(let r = 0; r<categoryGroup.length; r++){
        if(categoryGroup[r].name.indexOf(lowerCaseSearchTerm) !== -1){
          finalGroup.push(categoryGroup[r]);
        }
      }
    }
    updateDisplay();
  }

  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    if (finalGroup.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No results to display!';
      main.appendChild(para);
    } else {
      load();
    }
  }

  function fetchBlob(product) {
    const url = product.image;
    fetch(url)
      .then( response => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.blob();
      })
      .then( blob => {showProduct(URL.createObjectURL(blob), product.name, product.price, product.info)})
      .catch( err => console.error(`Fetch problem: ${err.message}`) );
  }

  function showProduct(imageURL, productname, productprice, productinfo) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    
    div.className = 'item_display';
    div.id = productname + '/' + productprice + '/' + productinfo;
    div.addEventListener('click', explain);
    
    img.src = imageURL;
    img.alt = productname;
    img.className = 'newitem';
    
    main.appendChild(div);
    div.appendChild(img);
  }

  function load(){
    for(let r=(counter-1)*6; i < counter*6; i++){
      if(i>=finalGroup.length){
        break;
      }
      fetchBlob(finalGroup[r]);
    }
    if ((counter-1)*6 >= finalGroup.length){
      counter = finalGroup.length;
    }
    else{
      counter += 1;
    }
  }
}