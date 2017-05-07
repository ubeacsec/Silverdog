(function () {
  var extensionName = 'SilverDog';

  var orConnect = AudioNode.prototype.connect;
  var filteredSources = [];
  var filters = [];

  /**
   * Fire initial call.
   */
  chrome
    .runtime
    .sendMessage({ sync: 'init' });

  /**
   * Sign up for messaged from the background script.
   */
  chrome
    .runtime
    .onMessage
    .addListener(function (request, sender, sendResponse) {
      if (request.state) {
        console.log(`${extensionName}: Looking for audio elements...`);
        searchForAudioContent();
      } else {
        console.log(`${extensionName}: Extension is currently disabled.`);
      }
    });

  function searchForAudioContent() {
    let audioElements = document.getElementsByTagName('audio');
    Array.from(audioElements).forEach(createAndConnectSource, audioElements);
    let videoElements = document.getElementsByTagName('video');
    Array.from(videoElements).forEach(createAndConnectSource, videoElements);
  }

  function createAndConnectSource(element, i) {
    if (!filteredSources.includes(this[i])) {
      let windowContext = new (window.AudioContext || window.webkitAudioContext);

      console.log(`${extensionName}: A new audio element has been found.`);
      console.log(this[i]);

      try {
        windowContext
          .createMediaElementSource(this[i])
          .connect(windowContext.destination);
      } catch(err) {
        console.log(`${extensionName}: Audio element could not be filtered.`);
      }

      filteredSources.push(this[i]);
    } else {
      console.log(`${extensionName}: Audio element has already been filtered.`);
    }
  }

  function createFilter(context) {
    let biquadFilter = context.createBiquadFilter();

    let storage = chrome.storage.local;
    storage.get(['type', 'freq', 'q', 'gain'], function (items) {
      biquadFilter.type = items.type || 'highshelf';
      biquadFilter.frequency.value = items.freq || '17999';
      biquadFilter.Q.value = items.q || '0';
      biquadFilter.gain.value = items.gain || '-70';
    });

    return biquadFilter;
  }

  AudioNode.prototype.connect = function () {
    let name = arguments[0].toString();

    if (name.indexOf('AudioDestinationNode') > -1) {
      let filter = createFilter(arguments[0].context);
      filters.push(filter);

      orConnect.apply(this, [filters[filters.length - 1], arguments[1], arguments[2]]);
      orConnect.apply(filter, [arguments[0], arguments[1], arguments[2]]);

      console.log(`${extensionName}: Ultrasound audio filter added.`);
    } else {	
      orConnect.apply(this, arguments);
    }
  };
})();
