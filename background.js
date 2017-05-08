(function () {
  let isEnabled = false;

  /**
   * Method to toggle the state of the extension.
   */
  function toggleState() {
    isEnabled = !isEnabled;
    chrome.browserAction.setIcon({ path: isEnabled ? 'icon_enabled.png' : 'icon_disabled.png' });
    console.log(`SilverDog is now globally ${isEnabled ? 'enabled' : 'disabled'}.`);
  }

  /**
   * Method to notify the content script.
   * @param {number} tabId The id of the the notification is intended to.
   * @param {string} origin The origin of the notification.
   */
  function notifyContent(tabId, origin) {
    chrome
      .tabs
      .sendMessage(tabId, {
        origin: origin,
        state: isEnabled
      });
  }

  chrome
    .browserAction
    .onClicked
    .addListener(toggleState);

  /**
   * Notify the content sript when it requests thats.
   */
  chrome
    .runtime
    .onMessage
    .addListener(function (message, sender) {
      notifyContent(sender.tab.id, message.origin);
    });

  /**
   * Notify the content sript when a tab is updated.
   */
  chrome
    .tabs
    .onUpdated
    .addListener(function (tabId) {
      notifyContent(tabId, 'backgroundScript');
    });

  toggleState();
})();
