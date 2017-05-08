(function () {
  const extensionName = 'SilverDog';

  const detectionStatus = {
    audioFound: 'A new audio element has been found.',
    audioFiltered: 'Ultrasound audio filter added.',
    error: 'Audio element could not be filtered.'
  };

  let connect = AudioNode.prototype.connect,
    audioElements = document.getElementsByTagName('audio'),
    videoElements = document.getElementsByTagName('video'),
    filteredSources = [],
    filters = [];

  /**
   * Logger method.
   * @param {string} information The information to be logged to the console.
   */
  function log(information) {
    console.log(`${extensionName}: ${information}`);
  }

  /**
   * Method to handle messages sent by the background script.
   * @param {any} message A message object containing the origin and the current state.
   */
  function handleMessage(message) {
    if (message.state) {
      Array.from(audioElements).forEach(createAndConnectSource, audioElements);
      Array.from(videoElements).forEach(createAndConnectSource, videoElements);
    }
  }

  /**
   * Method to be called on each audio and video element, to add an audio filter.
   * @param {node} element The current element of the iteration.
   * @param {number} i The index of the current element.
   */
  function createAndConnectSource(element, i) {
    if (!filteredSources.includes(this[i])) {
      let windowContext = new (window.AudioContext || window.webkitAudioContext);

      log(detectionStatus['audioFound']);
      console.log(this[i]);

      try {
        windowContext
          .createMediaElementSource(this[i])
          .connect(windowContext.destination);
        filteredSources.push(this[i]);

      } catch(err) {
        log(detectionStatus['error']);

      }
    }
  }

  /**
   * Method to create an audio filter.
   * @param {AudioContext} context The audio context object.
   * @returns {BiquadFilterNode} The audio filter.
   */
  function createFilter(context) {
    let biquadFilter = context.createBiquadFilter();

    chrome.storage.local.get(['type', 'freq', 'q', 'gain'], function (items) {
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

      connect.apply(this, [filters[filters.length - 1], arguments[1], arguments[2]]);
      connect.apply(filter, [arguments[0], arguments[1], arguments[2]]);

      log(detectionStatus['audioFiltered']);
    } else {	
      connect.apply(this, arguments);
    }
  };

  /**
   * Send a bounce-back message to the background scrip at every frame.
   * This will be sent back right away.
   */
  chrome
    .runtime
    .sendMessage({ origin: 'contentScript' });

  /**
   * Subscribe to messages from the background script.
   */
  chrome
    .runtime
    .onMessage
    .addListener(handleMessage);

})();
