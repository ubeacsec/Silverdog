function createScript(property, source) {
  let scriptElement = document.createElement('script');
  scriptElement['property'] = source;
  return scriptElement;
}

function injectScript(script) {
  (document.head || document.documentElement).appendChild(script);
}

chrome
  .runtime
  .sendMessage({ msg: 'getStatus' }, function (response) {
    if (response.status) {
      let storage = chrome.storage.local;
      storage.get(['type', 'freq', 'q', 'gain'], function (items) {

        type = items.type || 'highshelf';
        freq = items.freq || '17999';
        q = items.q || '0';
        gain = items.gain || '-70';

        let actualCode = `
          var st_type = '${type}',
            st_freq = '${freq}',
            st_q = '${q}',
            st_gain = '${gain}';
          console.log('Settings loaded...');
        `;

        let script = createScript('textConetent', actualCode);
        injectScript(script);
        script.parentNode.removeChild(script);
      });

      let script = createScript('src', chrome.extension.getURL('intercept.js'));
      script.onload = function () {
        this.parentNode.removeChild(this);
      };
      injectScript(script);
    }
  });
