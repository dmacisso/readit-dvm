// Modules
const { Menu, shell } = require('electron');

// Module function to create main app menu

module.exports = (appWin) => {
  // Menu template
  let template = [
    {
      label: 'Items',
      submenu: [
        {
          label: 'Add New',
          accelerator: 'CmdOrCtrl+o',
          click: () => {
            // appWin is a reference to mainWindow.webContents called from main.js
            appWin.send('menu-show-modal'); // ipc channel name
          },
        },
        {
          label: 'Read Item',
          accelerator: 'CmdOrCtrl+Enter',
          click: () => {
            appWin.send('menu-open-item'); // ipc channel name
          },
        },
        {
          label: 'Delete Item',
          accelerator: 'CmdOrCtrl+Backspace',
          click: () => {
            appWin.send('menu-delete-item'); // ipc channel name
          },
        },
        {
          label: 'Open in Browser',
          accelerator: 'CmdOrCtrl+Shift+Enter',
          click: () => {
            appWin.send('menu-open-item-native'); // ipc channel name
          },
        },
        {
          label: 'Search Items',
          accelerator: 'CmdOrCtrl+s',
          click: () => {
            appWin.send('menu-focus-search'); // ipc channel name
          },
        },
      ],
    },
    {
      role: 'editMenu',
    },
    {
      role: 'windowMenu',
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn more',
          click: () => {
            shell.openExternal(
              'https://github.com/stackacademytv/master-electron'
            );
          },
        },
        {
          label: 'Source Code',
          click: () => {
            shell.openExternal('https://github.com/dmacisso/readit-dvm');
          },
        },
      ],
    },
  ];

  // Create Mac app Menu
  if (process.platform === 'darwin') template.unshift({ role: 'appMenu' });

  // Build menu

  let menu = Menu.buildFromTemplate(template);

  // Set as main app menu
  Menu.setApplicationMenu(menu);
};
