// Function to store URLs and titles
function storePageData(url, title) {
  chrome.storage.local.get({ history: [] }, (data) => {
    const history = data.history;
    const pageData = { url: url, title: title };
    
    // Avoid duplicates by checking if the URL is already stored
    if (!history.some(entry => entry.url === url)) {
      history.push(pageData);
      chrome.storage.local.set({ history: history });
    }
  });
}

// Listen for updated tabs and store URL and title
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const url = tab.url;
    const title = tab.title;
    
    // Check if we should track incognito mode based on user preference
    chrome.storage.local.get({ trackIncognito: false }, (data) => {
      if (url && (tab.incognito ? data.trackIncognito : true)) {  // Check incognito preference
        storePageData(url, title);  // Store both title and URL
      }
    });
  }
});

// Listen for messages from the popup to update incognito tracking preference
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "toggleIncognitoTracking") {
    chrome.storage.local.set({ trackIncognito: message.value }, () => {
      sendResponse({ status: "Incognito tracking is now " + (message.value ? "enabled" : "disabled") });
    });
    return true;  // Indicates asynchronous response
  }
});
