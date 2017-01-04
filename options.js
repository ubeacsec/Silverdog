// Usually we try to store settings in the "sync" area since a lot of the time
// it will be a better user experience for settings to automatically sync
// between browsers.
//
// However, "sync" is expensive with a strict quota (both in storage space and
// bandwidth) so data that may be as large and updated as frequently as the CSS
// may not be suitable.
var storage = chrome.storage.local;

// Get at the DOM controls used in the sample.
var resetButton = document.querySelector('input.reset');
var submitButton = document.querySelector('input.submit');
var infoButton = document.querySelector('input.info');

var inp_type = document.getElementById('type');
var inp_freq = document.getElementById('freq');
var inp_q = document.getElementById('q');
var inp_gain = document.getElementById('gain');

// Load any setting that may have previously been saved.
loadChanges();


submitButton.addEventListener('click', saveChanges);
resetButton.addEventListener('click', reset);
//infoButton.addEventListener('click', refreshFilterType);


function refreshFilterType() {
	var currentFilterType = document.getElementById('type').value;
	var asText = document.getElementById('type').value;
	var value = "";

	switch (currentFilterType) {
		case "lowpass":
			value = ("A lowpass filter allows frequencies below the cutoff frequency to pass through and attenuates frequencies above the cutoff. It implements a standard second-order resonant lowpass filter with 12dB/octave rolloff.<br/><br/>" +
			"<strong>Frequency</strong>: The cutoff frequency<br/>" +
			"<strong>Q</strong>: Controls how peaked the response will be at the cutoff frequency. A large value makes the response more peaked. Please note that for this filter type, this value is not a traditional Q, but is a resonance value in decibels.<br/>" +
			"<strong>Gain</strong>: Not used in this filter type");
			break;
		case "highpass":
			value = ("A highpass filter is the opposite of a lowpass filter. Frequencies above the cutoff frequency are passed through, but frequencies below the cutoff are attenuated. It implements a standard second-order resonant highpass filter with 12dB/octave rolloff.<br/><br/>" +
			"<strong>Frequency</strong>: The cutoff frequency below which the frequencies are attenuated<br/>" +
			"<strong>Q</strong>: Controls how peaked the response will be at the cutoff frequency. A large value makes the response more peaked. Please note that for this filter type, this value is not a traditional Q, but is a resonance value in decibels..<br/>" +
			"<strong>Gain</strong>: Not used in this filter type");
			break;
		case "bandpass":
			value = ("A bandpass filter allows a range of frequencies to pass through and attenuates the frequencies below and above this frequency range. BANDPASS implements a second-order bandpass filter.<br/><br/>" +
			"<strong>Frequency</strong>: The center of the frequency band<br/>" +
			"<strong>Q</strong>: Controls the width of the band. The width becomes narrower as the Q value increases.<br/>" +
			"<strong>Gain</strong>: Not used in this filter type");
			break;
		case "lowself":
			value = ("The lowshelf filter allows all frequencies through, but adds a boost (or attenuation) to the lower frequencies. LOWSHELF implements a second-order lowshelf filter.<br/><br/>" +
			"<strong>Frequency</strong>: The cutoff frequency above which the frequencies are attenuated<br/>" +
			"<strong>Q</strong>: Not used in this filter type.<br/>" +
			"<strong>Gain</strong>: The boost, in dB, to be applied. If the value is negative, the frequencies are attenuated.");
			break;
		case "highshelf":
			value = ("The highshelf filter is the opposite of the lowshelf filter and allows all frequencies through, but adds a boost to the higher frequencies. HIGHSHELF implements a second-order highshelf filter<br/><br/>" +
			"<strong>Frequency</strong>: The lower limit of the frequences where the boost (or attenuation) is applied.<br/>" +
			"<strong>Q</strong>: Not used in this filter type.<br/>" +
			"<strong>Gain</strong>: The boost, in dB, to be applied. If the value is negative, the frequencies are attenuated.");
			break;
		case "peaking":
			value = ("The peaking filter allows all frequencies through, but adds a boost (or attenuation) to a range of frequencies.<br/><br/>" +
			"<strong>Frequency</strong>: The center frequency of where the boost is applied.<br/>" +
			"<strong>Q</strong>: Controls the width of the band of frequencies that are boosted. A large value implies a narrow width.<br/>" +
			"<strong>Gain</strong>: The boost, in dB, to be applied. If the value is negative, the frequencies are attenuated.");
			break;
		case "notch":
			value = ("The notch filter (also known as a band-stop or band-rejection filter) is the opposite of a bandpass filter. It allows all frequencies through, except for a set of frequencies.<br/><br/>" +
			"<strong>Frequency</strong>: The center frequency of where the notch is applied.<br/>" +
			"<strong>Q</strong>: Controls the width of the band of frequencies that are attenuated. A large value implies a narrow width.<br/>" +
			"<strong>Gain</strong>: Not used in this filter type");
			break;
		case "allpass":
			value = ("An allpass filter allows all frequencies through, but changes the phase relationship between the various frequencies. ALLPASS implements a second-order allpass filter.<br/><br/>" +
			"<strong>Frequency</strong>: The frequency where the center of the phase transition occurs. Viewed another way, this is the frequency with maximal group delay.<br/>" +
			"<strong>Q</strong>: Controls how sharp the phase transition is at the center frequency. A larger value implies a sharper transition and a larger group delay.<br/>" +
			"<strong>Gain</strong>: Not used in this filter type");
			break;
	};

	message(asText + " filter info:<p>" + value);

}
	

function saveChanges() {
  var type = inp_type.value;
  var freq = inp_freq.value;
  var gain = inp_gain.value;
  var q = inp_q.value;



  // Save it using the Chrome extension storage API.
  storage.set({'type': type, 'freq': freq, 'q':q, 'gain':gain}, function() {
    // Notify that we saved.
    message('Settings saved');
  });
}

function loadChanges() {
  storage.get(['type', 'freq', 'q', 'gain'], function(items) {

	if (items.type){
		inp_type.value = items.type;
    }else{
		inp_type.value = "highshelf"
	}
	
	if (items.freq){
		inp_freq.value = items.freq;
    }else{
		inp_freq.value = "18000"
	}
	
	
	if (items.q){
		inp_q.value = items.q;
	}else{
		inp_q.value = "0";
	}
	
	if (items.gain){
		inp_gain.value = items.gain;
	}else{
		inp_gain.value = "-70";
	}

      
  });
}

function reset() {
  // Remove the saved value from storage.
  storage.remove('type', function(items) {});
  storage.remove('freq', function(items) {});
  storage.remove('q', function(items) {});
  storage.remove('gain', function(items) {});
    inp_type.value = "highshelf";
    inp_freq.value = "18000";
    inp_q.value = "0";
    inp_gain.value = "-70";
  
}

function message(msg) {
  //var message = document.querySelector('.message');
  //message.innerHTML = msg;
/* 
 setTimeout(function() {
    message.innerText = '';
  }, 5000);
 */
}
