"use strict";

const NUM_PRODUCT = 18;
const DISCOUNT = 1.15;
const MIN_PRICE = 5000;
const MAX_PRICE = 20000;

const getRandNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandEl = (array) => array[Math.floor(Math.random() * array.length)];

const calcDiscount = (price) => Math.floor((price * DISCOUNT) / 100) * 100;

const roundPrice = (number) => Math.floor(number / 100) * 100;


function generateProdCards() {
  const names = [
    "bosch-2000",
    "bosch-3000",
    "bosch-6000",
    "bosch-9000",
    "makita-td-110",
  ];
  const brands = [
    "BOSCH", 
    "Makita", 
    "Vagner", 
    "Mega", 
    "Proline"
  ];
  const titles = [
    "Перфоратор BOSCH BFG 2000",
    "Перфоратор BOSCH BFG 3000",
    "Перфоратор BOSCH BFG 6000",
    "Перфоратор BOSCH BFG 9000",
    "Шуруповерт Makita TD-110",
  ];
  const categories = [
    "Перфораторы", 
    "Шуруповёрты", 
    "Ключи", 
    "Отвертки"
  ];
  const flag = [
    "new", 
    "promo", 
    ""
  ];
  const products = [];

  for (let i = 0; i < NUM_PRODUCT; i++) {
    const product = {};

    product.url = "img/catalog/" + getRandEl(names) + ".jpg";
    product.brand = getRandEl(brands);
    product.title = getRandEl(titles);
    product.price = roundPrice(getRandNum(MIN_PRICE, MAX_PRICE));
    product.category = getRandEl(categories);
    product.discount = calcDiscount(product.price);
    product.flag = getRandEl(flag);
    product.isElectric = getRandEl([true, false]);

    products.push(product);
  }

  return products;
}

const productCards = generateProdCards();

console.log(productCards);


function removeTemplateCards() {
  const template = document.getElementById('catalog-item');
  while (template.nextElementSibling) {
    template.nextElementSibling.remove();
  }
}

function createProductElement(product) {
  const template = document.getElementById('catalog-item');
  const clone = template.content.cloneNode(true);

  clone.querySelector('.image img').src = product.url;
  clone.querySelector('.item-title').textContent = product.title;
  clone.querySelector('.price').textContent = product.price + ' Р.';

  if (product.discount > 0) {
    clone.querySelector('.discount').textContent = 'Скидка: ' + product.discount + ' Р.';
  }

  return clone;
}

function createFlagElement(flag) {
  const flagElement = document.createElement('div');
  flagElement.classList.add('flag');
  flagElement.classList.add('flag-' + flag);

  const spanElement = document.createElement('span');
  spanElement.classList.add('visually-hidden');

  if (flag === 'new') {
    spanElement.textContent = 'Новинка';
  } else if (flag === 'promo') {
    spanElement.textContent = 'Акция';
  }

  flagElement.appendChild(spanElement);
  return flagElement;
}

function renderProductCards() {
  const catalogList = document.querySelector('.catalog-list');
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 6; i++) {
    const product = productCards[i];
    const productElement = createProductElement(product);

    if (product.flag) {
      const flagElement = createFlagElement(product.flag);
      productElement.querySelector('.catalog-item').insertBefore(flagElement, productElement.querySelector('.catalog-item').firstChild);
    }

    fragment.appendChild(productElement);
  }

  catalogList.appendChild(fragment);
}

removeTemplateCards();
renderProductCards();


let sortMethod = 'price'; 
let direction = 'ascending'; 
const DEBOUNCE_INTERVAL = 500; 

const sortingUpButton = document.querySelector('.sorting-up-button');
const sortingDownButton = document.querySelector('.sorting-down-button');

sortingUpButton.addEventListener('click', handleSortAscending);
sortingDownButton.addEventListener('click', handleSortDescending);

function handleSortAscending() {
  if (!sortingUpButton.disabled) {
    direction = 'ascending';
    sortProductCards();
    disableSortingButtons();
  }
}

function handleSortDescending() {
  if (!sortingDownButton.disabled) {
    direction = 'descending';
    sortProductCards();
    disableSortingButtons();
  }
}

function sortProductCards() {
  productCards.sort(function(a, b) {
    const valueA = a[sortMethod];
    const valueB = b[sortMethod];

    if (direction === 'ascending') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  renderProductCards();
}

function disableSortingButtons() {
  sortingUpButton.disabled = true;
  sortingDownButton.disabled = true;
  setTimeout(enableSortingButtons, DEBOUNCE_INTERVAL);
}

function enableSortingButtons() {
  sortingUpButton.disabled = false;
  sortingDownButton.disabled = false;
}

function clearProductCards() {
  const catalogList = document.querySelector('.catalog-list');
  while (catalogList.firstChild) {
    catalogList.firstChild.remove();
  }
}

function renderProductCards() {
  clearProductCards();

  const catalogList = document.querySelector('.catalog-list');
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 6; i++) {
    const product = productCards[i];
    const productElement = createProductElement(product);

    if (product.flag) {
      const flagElement = createFlagElement(product.flag);
      productElement.querySelector('.catalog-item').insertBefore(flagElement, productElement.querySelector('.catalog-item').firstChild);
    }

    fragment.appendChild(productElement);
  }

  catalogList.appendChild(fragment);
}

removeTemplateCards();
renderProductCards();


const basketLink = document.querySelector('.basket.add-product');
const bookmarksLink = document.querySelector('.bookmarks');
const basketCounter = basketLink.querySelector('span');
let counter = 0;
let bookmarksCounter = 0;

function handleBuyButtonClick() {
  counter++;
  basketCounter.textContent = counter;
  updateBasketColor();
}

function handleBookmarkButtonClick() {
  bookmarksCounter++;
  bookmarksLink.querySelector('span').textContent = bookmarksCounter;
}

function updateBasketColor() {
  if (counter > 0) {
    basketLink.classList.add('add-product-highlighted');
  } else {
    basketLink.classList.remove('add-product-highlighted');
  }
}

function addEventListeners() {
  const catalogItems = document.querySelectorAll('.catalog-item');
  catalogItems.forEach(function(item) {
    const buyButton = item.querySelector('.buy');
    const bookmarkButton = item.querySelector('.bookmark');

    buyButton.addEventListener('click', handleBuyButtonClick);
    bookmarkButton.addEventListener('click', handleBookmarkButtonClick);
  });
}

function removeEventListeners() {
  const catalogItems = document.querySelectorAll('.catalog-item');
  catalogItems.forEach(function(item) {
    const buyButton = item.querySelector('.buy');
    const bookmarkButton = item.querySelector('.bookmark');

    buyButton.removeEventListener('click', handleBuyButtonClick);
    bookmarkButton.removeEventListener('click', handleBookmarkButtonClick);
  });
}

addEventListeners();


const button = document.querySelector('.contacts-button');
const modal = document.querySelector('.modal-write');
const closeButton = modal.querySelector('.modal-close');

function openModal(event) {
  event.preventDefault(); 
  modal.classList.add('modal-show'); 
  closeButton.addEventListener('click', closeModal); 
  document.addEventListener('keydown', handleEscKey); 
}

function closeModal() {
  modal.classList.remove('modal-show');
  closeButton.removeEventListener('click', closeModal);
  document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

button.addEventListener('click', openModal);


let slider = document.querySelector('.range__bar');
let skrollMin = document.querySelector('.skroll_min');
let skrollMax = document.querySelector('.skroll_max');

let minPriceInput = document.querySelector('#min-price');
let maxPriceInput = document.querySelector('#max-price');

let minPrice = parseInt(minPriceInput.value);
let maxPrice = parseInt(maxPriceInput.value);

let isMinSliderDragging = false;
let isMaxSliderDragging = false;

function updatePriceInputs() {
  minPriceInput.value = minPrice;
  maxPriceInput.value = maxPrice;
}

function updateSlider() {
  let minPosition = (minPrice - 0) / (30000 - 0) * 100;
  let maxPosition = (maxPrice - 0) / (30000 - 0) * 100;

  skrollMin.style.left = minPosition + '%';
  skrollMax.style.left = maxPosition + '%';
}

function handleMinSliderMove(event) {
  if (!isMinSliderDragging) return;

  let sliderRect = slider.getBoundingClientRect();
  let minPosition = (event.clientX - sliderRect.left) / slider.offsetWidth * 100;
  let maxPosition = (maxPrice - 0) / (30000 - 0) * 100 - 1;

  let newPosition = Math.max(0, Math.min(minPosition, maxPosition));

  minPrice = Math.round(newPosition / 100 * (30000 - 0) + 0);
  updatePriceInputs();
  updateSlider();
}

function handleMaxSliderMove(event) {
  if (!isMaxSliderDragging) return;

  let sliderRect = slider.getBoundingClientRect();
  let minPosition = (minPrice - 0) / (30000 - 0) * 100 + 1;
  let maxPosition = (event.clientX - sliderRect.left) / slider.offsetWidth * 100;

  let newPosition = Math.max(minPosition, Math.min(maxPosition, 100));

  maxPrice = Math.round(newPosition / 100 * (30000 - 0) + 0);
  updatePriceInputs();
  updateSlider();
}

function handleMinSliderMouseDown(event) {
  isMinSliderDragging = true;
}

function handleMaxSliderMouseDown(event) {
  isMaxSliderDragging = true;
}

function handleMinSliderMouseUp() {
  isMinSliderDragging = false;
}

function handleMaxSliderMouseUp() {
  isMaxSliderDragging = false;
}

minPriceInput.addEventListener('input', function() {
  minPrice = parseInt(minPriceInput.value);
  if (minPrice < 0) {
    minPrice = 0;
  } else if (minPrice > maxPrice) {
    minPrice = maxPrice;
  }
  updatePriceInputs();
  updateSlider();
});

maxPriceInput.addEventListener('input', function() {
  maxPrice = parseInt(maxPriceInput.value);
  if (maxPrice > 30000) {
    maxPrice = 30000;
  } else if (maxPrice < minPrice) {
    maxPrice = minPrice;
  }
  updatePriceInputs();
  updateSlider();
});

updateSlider();

skrollMin.addEventListener('mousedown', handleMinSliderMouseDown);
skrollMax.addEventListener('mousedown', handleMaxSliderMouseDown);

document.addEventListener('mousemove', handleMinSliderMove);
document.addEventListener('mousemove', handleMaxSliderMove);
document.addEventListener('mouseup', handleMinSliderMouseUp);
document.addEventListener('mouseup', handleMaxSliderMouseUp);
