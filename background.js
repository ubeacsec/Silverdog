var active = true;

function setIcon() {
  if (active) {
    chrome.browserAction.setIcon({ path: 'icon_enabled.png' });
  } else {
    chrome.browserAction.setIcon({ path: 'icon_disabled.png' });
  }
}

function changeState() {
  if (active) {
    active = false;
  } else {
    active = true;
  }

  setIcon();
}

chrome
  .runtime
  .onMessage
  .addListener(function (request, sender, sendResponse) {
    if (request.msg === 'getStatus') {
      sendResponse({ status: active });
      return true;
    }
  });

chrome
  .browserAction
  .onClicked
  .addListener(changeState);

chrome
  .tabs
  .onUpdated
  .addListener(function () {
    chrome
      .tabs
      .executeScript(null, { file: 'intercept.js' });
  });

setIcon();
