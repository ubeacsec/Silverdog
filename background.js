var active = true;

function setIcon() {
  if (active === false) {
    chrome.browserAction.setIcon({ path: 'icon_disabled.png' });
  } else if (active === true) {
    chrome.browserAction.setIcon({ path: 'icon_enabled.png' });
  }
}

function changeState() {
  if (active === false) {
    active = true;
  } else if (active === true) {
    active = false;
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
