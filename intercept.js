console.log("Filter Running...");

var or_connect = AudioNode.prototype.connect; //Keep original connect method
var filtrs = new Array; //Store filters


function create_filter(context){
	var biquadFilter = context.createBiquadFilter();
	
	biquadFilter.type = st_type;
	biquadFilter.frequency.value = st_freq;
	biquadFilter.Q.value = st_q;
	biquadFilter.gain.value = st_gain;
	
	/*
	console.log("type: " + st_type);
	console.log("freq: " + st_freq);
	console.log("q: " + st_q);
	console.log("gain: " + st_gain);
	*/
	
	return biquadFilter;
}


//AudioNode.prototype.connect
AudioNode.prototype.connect = function(){
	obj_name = arguments[0].toString();
	//console.info(arguments);
	if (obj_name.indexOf("AudioDestinationNode") > -1){ //If end node, add our filter in-between
		//console.log(this);	
		//console.log(arguments);	
	
		filtr = create_filter(arguments[0].context);
		filtrs.push(filtr); //Keep filter in global array
		or_connect.apply(this, [filtrs[filtrs.length-1], arguments[1], arguments[2]]);
		or_connect.apply(filtr, [arguments[0], arguments[1], arguments[2]]);
		console.log("Filter added.");
	}else{
		//console.info(this);	
		//console.info(arguments);	
		or_connect.apply(this, arguments);
	}
	
}


	



var audio_elements = document.getElementsByTagName('audio');
var video_elements = document.getElementsByTagName('video');

if ((audio_elements.length > 0) || (video_elements.length>0)){
	var c0nt3x7 = new(window.AudioContext || window.webkitAudioContext);
	
	var tmp_source;

	/*Loop for audio*/
	var len = audio_elements.length;
	for (var i = 0; i < len; i++) {
		//console.log(audio_elements[i]);
		//filtr = create_filter(c0nt3x7, "highshelf", 17000, -120);
		//filters.push(filtr); //Keep filter in global array
		tmp_source = c0nt3x7.createMediaElementSource(audio_elements[i]);
		tmp_source.connect(c0nt3x7.destination); //Connect is overloaded already
		//filtr.connect(c0nt3x7.destination);
	}

	/*Loop for video*/
	len = video_elements.length;
	for (var i = 0; i < len; i++) {
		//console.log(video_elements[i]);
		//filtr = create_filter(c0nt3x7, "highshelf", 100, -120);
		//filters.push(filtr); //Keep filter in global array
		tmp_source = c0nt3x7.createMediaElementSource(video_elements[i]);
		tmp_source.connect(c0nt3x7.destination); //Connect is overloaded already
		//filtr.connect(c0nt3x7.destination);
	}
}