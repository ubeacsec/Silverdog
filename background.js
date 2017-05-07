let isEnabled = false;

function toggleState() {
  isEnabled = !isEnabled;
  chrome.browserAction.setIcon({ path: isEnabled ? 'icon_enabled.png' : 'icon_disabled.png' });
  console.log(`SilverDog is now globally ${isEnabled ? 'enabled' : 'disabled'}.`);
}

function notifyContent(tabId, source) {
  chrome
    .tabs
    .sendMessage(tabId, {
      sync: source,
      state: isEnabled
    });
}

chrome
  .browserAction
  .onClicked
  .addListener(toggleState);

/**
 * Handle initial requests from content sripts.
 */
chrome
  .runtime
  .onMessage
  .addListener(function (request, sender, sendResponse) {
    notifyContent(sender.tab.id, request.sync);
  });

/**
 * Notify content sripts when content is updated.
 */
chrome
  .tabs
  .onUpdated
  .addListener(function (tabId) {
    notifyContent(tabId, 'onUpdate');
  });

toggleState();
