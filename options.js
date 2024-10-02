// options.js

document.addEventListener('DOMContentLoaded', () => {
    const trackIncognitoCheckbox = document.getElementById('trackIncognito');
  
    // Load the current setting
    chrome.storage.local.get({ trackIncognito: false }, (data) => {
      trackIncognitoCheckbox.checked = data.trackIncognito;
    });
  
    // Save the setting when changed
    trackIncognitoCheckbox.addEventListener('change', (e) => {
      chrome.storage.local.set({ trackIncognito: e.target.checked });
    });
  });
  