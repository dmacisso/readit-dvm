// Modules
const { dialog } = require('electron');

// Electron-Updater Module
const { autoUpdater } = require('electron-updater');

// Configure log debugging
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// Disable auto downloading of updates;
autoUpdater.autoDownload = false;

// Single export to check for and apply any available updates

module.exports = () => {
  // Check for available updates (GH Releases)
  autoUpdater.checkForUpdates();

  // Listen for update found
  autoUpdater.on('update-available', () => {
    // prompt user to download or postpone updates
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update available',
        message:
          'A new version of dvm-readit is available. Do you want to update now?',
        buttons: ['Update', 'No'],
      })
      .then((result) => {
        let buttonIndex = result.response;
        // if button 0 (update), start the downloading to update
        if (buttonIndex === 0) autoUpdater.downloadUpdate();
      });
  });
  // Listen for update downloaded
  autoUpdater.on('update-downloaded', () => {
    // prompt user to install update
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'Install and restart now?',
        buttons: ['Yes', 'Later'],
      })
      .then((result) => {
        let buttonIndex = result.response;
        // if button 0 (Ywa), install and restart
        if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
      });
  });
};
