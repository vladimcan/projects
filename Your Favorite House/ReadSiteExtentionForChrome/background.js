chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      /* alert("Work background ..."); */
      chrome.tabs.create({"url": 'localhost:3000/write'});
      
    }
  }
);

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/* let color = '#ffff00';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
}); */

/* chrome.action.onClicked.addListener((tab) => {
  console.log("start at localhost");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
}); */