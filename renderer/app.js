const { ipcRenderer } = require('electron');
const items = require('./items');

// DOM nodes
const showModal = document.getElementById('show-modal'),
  closeModal = document.getElementById('close-modal'),
  modal = document.getElementById('modal');
addItem = document.getElementById('add-item');
itemURL = document.getElementById('url');
search = document.getElementById('search');

// Open modal from Menu
ipcRenderer.on('menu-show-modal', () => {
  showModal.click();
});

// open selected item from Menu

ipcRenderer.on('menu-open-item', () => {
  items.open();
});

// delete selected item from Menu
ipcRenderer.on('menu-delete-item', () => {
  let selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
});

// Open item in native browser from menu
ipcRenderer.on('menu-open-item-native', () => {
  items.openNative();
});

// Focus the search input from the menu h
ipcRenderer.on('menu-focus-search', () => {
  search.focus();
});

// Filter Items with  'search
search.addEventListener('keyup', (e) => {
  Array.from(document.getElementsByClassName('read-item')).forEach((item) => {
    // hide items that don't match the search value
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? 'flex' : 'none';
  });
});

// Navigate item selection with up/down arrows
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key);
  }
});

// Disable and Enable Modal Buttons
const ToggleModalButtons = () => {
  // Check state of buttons
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = 'Add Item';
    closeModal.style.display = 'inline';
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = 'Adding...';
    closeModal.style.display = 'none';
  }
};

// Show Modal
showModal.addEventListener('click', (e) => {
  modal.style.display = 'flex';
  itemURL.focus();
});

// Hide Modal
closeModal.addEventListener('click', (e) => {
  modal.style.display = 'none';
});

// Handle new items being added
addItem.addEventListener('click', (e) => {
  // Check URL exists
  if (itemURL.value) {
    // Send new item url to main process
    ipcRenderer.send('new-item', itemURL.value);

    // Disable Buttons
    ToggleModalButtons();
  }
});

//Listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
  // Add new item to "items" node
  items.addItem(newItem, true);

  // Enable Buttons
  ToggleModalButtons();

  //  Hide the modal and clear the input value
  modal.style.display = 'none';
  itemURL.value = '';
});

// Listen for key event
itemURL.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addItem.click();
});
