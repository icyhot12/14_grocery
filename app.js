// variables
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit options
let editElement;
let editFlag = false;
let editId = '';

//event listeners
form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);

// functions
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id,value)
    displayAlert("item added to the list", 'success');
    // show container
    container.classList.add('show-container');
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBacktoDefault()
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert('value chaned', 'success');
    editLocalStorage(editId, value);
    setBacktoDefault();
  } else {
    displayAlert("please enter value", "danger")
  }
}

// delete function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 1) {
    container.classList.remove("show-container");
  }
  displayAlert('item removed', 'danger');
  setBacktoDefault();
  removeFromLocalStorage(id);
}

// edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editId = element.dataset.id;
  submitBtn.textContent = 'Edit'
}

// alert message
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove alert

  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 600)
}

// clear items
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    })
  };
  container.classList.remove('show-container')
  displayAlert('empty list', "danger");
  setBacktoDefault();
  localStorage.removeItem('list')
};

// set back to default
function setBacktoDefault() {
  grocery.value = '';
  editFlag = false;
  editId = '';
  submitBtn.textContent = 'Submit'
}

function addToLocalStorage(id, value) {
  // es6 - could be {id, value}
  // if the same it is not necessary to repeat id:id value:value
  // id - date id generation
  // value - text value from input
  const grocery = { id: id, value: value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items))
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter((item) => {
    if (item.id !== id) {
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
};

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value
    }
    return item;
  })
  localStorage.setItem('list', JSON.stringify(items))
};

function getLocalStorage() {
  return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value)
    })
    container.classList.add('show-container')
  }
}

function createListItem(id, value) {
  const element = document.createElement('article');
  //add class
  element.classList.add('grocery-item');
  //add id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr)
  element.innerHTML = `<p class="title">${value}</p>
      <div class="btn-container">
        <button type="button" class="edit-btn">
          <i class="fa-solid fa-pen-to-square fa-xl edit"></i>
        </button>
        <button type="button" class="delete-btn">
          <i class="fa-solid fa-trash fa-xl trash"></i>
        </button>
      </div>`;
  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');
  deleteBtn.addEventListener('click', deleteItem);
  editBtn.addEventListener('click', editItem);
  list.appendChild(element);
}