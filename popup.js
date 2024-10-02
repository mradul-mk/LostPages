// Fetch the current incognito tracking status on load and update the toggle button
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get({ trackIncognito: false }, (data) => {
    const toggleButton = document.getElementById('toggleIncognito');
    toggleButton.textContent = data.trackIncognito ? "Disable Incognito Tracking" : "Enable Incognito Tracking";
  });
});

// Toggle incognito tracking when the button is clicked
document.getElementById('toggleIncognito').addEventListener('click', () => {
  chrome.storage.local.get({ trackIncognito: false }, (data) => {
    const newValue = !data.trackIncognito;
    chrome.runtime.sendMessage({ command: "toggleIncognitoTracking", value: newValue }, (response) => {
      alert(response.status);  // Inform the user of the status change
      document.getElementById('toggleIncognito').textContent = newValue ? "Disable Incognito Tracking" : "Enable Incognito Tracking";
    });
  });
});

// Search the stored history for matching titles
document.getElementById('search').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  chrome.storage.local.get({ history: [] }, (data) => {
    const results = data.history.filter(page => page.title.toLowerCase().includes(query));
    displayResults(results);
  });
});

// Display the results with titles as clickable links
function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';  // Clear previous results

  if (results.length === 0) {
    resultsDiv.innerHTML = "<p>No matching pages found</p>";
    return;
  }

  results.forEach(page => {
    const div = document.createElement('div');
    div.classList.add('history-item');
    
    // Create a clickable link with the title
    const link = document.createElement('a');
    link.href = page.url;
    link.target = "_blank";
    link.textContent = page.title || "No Title";  // Fallback to "No Title" if title is missing

    div.appendChild(link);
    resultsDiv.appendChild(div);
  });
}
