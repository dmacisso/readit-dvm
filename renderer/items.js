const { shell } = require('electron');
const fs = require('fs');

// DOM nodes
let items = document.getElementById('items');

// Get readerJS content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// Listen for "done" message from reader window
window.addEventListener('message', (e) => {
  // Check for correct message
  if (e.data.action === 'delete-reader-item') {
    // Delete item at given index
    this.delete(e.data.itemIndex);

    // close reader window.
    e.source.close();
  }
});

// Delete Item
exports.delete = (itemIndex) => {
  // Remove item from the DOM
  items.removeChild(items.childNodes[itemIndex]);

  // Remove from storage
  this.storage.splice(itemIndex, 1);

  //Persist storage
  this.save();

  // Select previous item or new top item
  if (this.storage.length) {
    // Get new selected item
    let = newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;

    // Select item at new index
    document
      .getElementsByClassName('read-item')
      [newSelectedItemIndex].classList.add('selected');
  }
};

// Get index of an item.
exports.getSelectedItem = () => {
  // Get the selected node
  let currentItem = document.getElementsByClassName('read-item selected')[0];

  // Get item Index
  let itemIndex = 0;
  let child = currentItem;
  while ((child = child.previousElementSibling) != null) itemIndex++;

  // Return selected item and Index
  return { node: currentItem, index: itemIndex };
};

// Persist storage array
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage));
};

// set item as selected
exports.select = (e) => {
  // Remove selected item class
  this.getSelectedItem().node.classList.remove('selected');

  // Add class 'selected' to clicked item
  e.currentTarget.classList.add('selected');
};

// Move to the newly selected ite
exports.changeSelection = (direction) => {
  // Get selected item
  let currentItem = this.getSelectedItem();

  // handle up/down direction
  if (direction === 'ArrowUp' && currentItem.node.previousElementSibling) {
    currentItem.node.classList.remove('selected');
    currentItem.node.previousElementSibling.classList.add('selected');
  } else if (direction === 'ArrowDown' && currentItem.node.nextElementSibling) {
    currentItem.node.classList.remove('selected');
    currentItem.node.nextElementSibling.classList.add('selected');
  }
};

// open selected item in native browser
exports.openNative = () => {
  // only if we have items
  if (!this.storage.length) return;
  // get selected item
  let selectedItem = this.getSelectedItem();

  // get selected item's url
  let contentURL = selectedItem.node.dataset.url;

  // open is user's default browser
  shell.openExternal(contentURL)

}


// open selected item
exports.open = () => {
  // only if we have items
  if (!this.storage.length) return;
  // get selected item
  let selectedItem = this.getSelectedItem();

  // get selected item's url
  let contentURL = selectedItem.node.dataset.url;
  // open proxy BrowserWindow

  let readerWin = window.open(
    contentURL,
    '',
    `
  maxWidth=2000,
  maxHeight=2000,
  width=1200,
  height=800,
  backgroundColor=#dedede,
  nodeIntegration=0,
  contextIsolation=1
  `
  );

  // Inject JavaScript with specific item index (selectedItem.index)
  readerWin.eval(readerJS.replace('{{index}}', selectedItem.index));
};

// Add new items
exports.addItem = (item, isNew = false) => {
  // Create a new DOM node
  let itemNode = document.createElement('div');

  // Assign "read-item" class.
  itemNode.setAttribute('class', 'read-item');

  // Set item url as data attribute
  itemNode.setAttribute('data-url', item.url);

  // Add inner HTML
  itemNode.innerHTML = `<img src="${item.screenshot}" alt="" srcset=""><h2>${item.title}</h2>`;

  // Append new node to "items" node..
  items.appendChild(itemNode);

  // Attach click handler to select
  itemNode.addEventListener('click', this.select);

  // Attach doubleclick handler to open an item
  itemNode.addEventListener('dblclick', this.open);

  // If this item is the first item, select
  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected');
  }

  // Add item to storage and persist
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

// Add item from storage when app loads
this.storage.forEach((item) => {
  this.addItem(item);
});
