// Create button in remote content to mark as done.

let readitClose = document.createElement('div');
readitClose.innerText = 'Done';

// Style the button
readitClose.style.position = 'fixed';
readitClose.style.bottom = '15px';
readitClose.style.right = '15px';
readitClose.style.padding = '5px 10px';
readitClose.style.fontSize = '20px';
readitClose.style.fontWeight = 'bold';
readitClose.style.background = 'dodgerblue';
readitClose.style.color = '#fff';
readitClose.style.borderRadius = '5px';
readitClose.style.cursor = 'default';
readitClose.style.boxShadow = '2px 2px 2px rgba(0, 0, 0, 0.2)';
readitClose.style.zIndex = '9999';

// Attach a click handler
readitClose.onclick = (e) => {
  // Message parent (opener) window
  window.opener.postMessage({
    action: 'delete-reader-item',
    itemIndex: {{index}}
  }, '*')
};

// Append to remote contents body
document.getElementsByTagName('body')[0].append(readitClose);
