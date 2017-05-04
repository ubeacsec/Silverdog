var isEnabled = false;

function toggleState() {
  isEnabled = !isEnabled;
  chrome.browserAction.setIcon({ path: isEnabled ? 'icon_enabled.png' : 'icon_disabled.png' });
}

chrome
  .browserAction
  .onClicked
  .addListener(toggleState);

chrome
  .runtime
  .onMessage
  .addListener(function (request, sender, sendResponse) {
    if (request.msg === 'getStatus') {
      sendResponse({ status: isEnabled });
      return true;
    }
  });

chrome
  .tabs
  .onUpdated
  .addListener(function () {
    chrome
      .tabs
      .executeScript(null, { file: 'intercept.js' });
  });

toggleState();
