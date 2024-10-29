console.log("utf8/scripts/background.js:LOADED");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.sync.get("settings", function(result) {
    let utf8_enable = true;
    if (chrome.runtime.lastError) {
      console.log('Error loading setting:', settings, chrome.runtime.lastError);
      utf8_enable = true;
    }

    let settingValue = result.settings;
    if (JSON.stringify(settingValue) === "{}") {
      utf8_enable = true;
    }
    try {
      utf8_enable = settingValue["setting1-state"];
    } catch {
      utf8_enable = true;
    }

    if (utf8_enable && changeInfo.status === "complete") {
      chrome.tabs.sendMessage(tabId, { action: "run" });
    }
  });
});
