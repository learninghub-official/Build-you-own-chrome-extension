document.addEventListener('DOMContentLoaded', function () {
    // Fetch all open tabs when the popup is opened
    chrome.tabs.query({}, function (tabs) {
      const tabListContainer = document.getElementById('tabs-list');
      tabListContainer.innerHTML = ''; // Clear any existing tab list
  
      // Loop through each tab and create a checkbox for it
      tabs.forEach((tab) => {
        const tabWrapper = document.createElement('div');
        tabWrapper.classList.add('checkbox-wrapper');
  
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('tab-checkbox');
        checkbox.checked = true; // Default to checked (user can uncheck tabs to keep open)
        checkbox.id = `tab-${tab.id}`;
  
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = tab.title;
  
        tabWrapper.appendChild(checkbox);
        tabWrapper.appendChild(label);
        tabListContainer.appendChild(tabWrapper);
      });
  
      // Check and enable/disable the "Close Unselected Tabs" button on load
      toggleCloseButtonState(tabs);
  
      // Add event listeners to checkboxes to update button state
      const checkboxes = document.querySelectorAll('.tab-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          toggleCloseButtonState(tabs); // Re-check the state every time a checkbox changes
        });
      });
    });
  
    // Function to toggle the state of the "Close Unselected Tabs" button
    function toggleCloseButtonState(tabs) {
      const closeButton = document.getElementById('close-tabs-button');
      closeButton.disabled = tabs.every((tab) => {
        const checkbox = document.getElementById(`tab-${tab.id}`);
        return checkbox && checkbox.checked; // Disable button if all tabs are checked
      });
    }
  
    // Add event listener to handle closing unselected tabs
    document.getElementById('close-tabs-button').addEventListener('click', function () {
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach((tab) => {
          const checkbox = document.getElementById(`tab-${tab.id}`);
          if (checkbox && !checkbox.checked) {
            chrome.tabs.remove(tab.id); // Close the unselected tabs
          }
        });
      });
    });
  });