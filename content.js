  
chrome.runtime.sendMessage({msg: "getStatus"}, function(response) {
   if (response.status==true){
   
		var storage = chrome.storage.local;

		storage.get(['type', 'freq', 'q', 'gain'], function(items) {
		
		if (items.type){
			type = items.type;
		}else{
			type = "highshelf"
		}
		
		if (items.freq){
			freq = items.freq;
		}else{
			freq = "17999"
		}
		
		
		if (items.q){
			q = items.q;
		}else{
			q = "0";
		}
		
		if (items.gain){
			gain = items.gain;
		}else{
			gain = "-70";
		}

		
		var actualCode = ['var st_type ="' + type + '"',
						  'var st_freq =' + freq,
						  'var st_q =' + q,
						  'var st_gain =' + gain,
						  'console.log("Settings loaded...");'].join('\n');

		var script = document.createElement('script');
		script.textContent = actualCode;
		(document.head||document.documentElement).appendChild(script);
		script.parentNode.removeChild(script);    
		  
	  });
	   
			var s = document.createElement('script');

			s.src = chrome.extension.getURL('intercept.js');
			s.onload = function() {
				this.parentNode.removeChild(this);
			};
			(document.head || document.documentElement).appendChild(s);
}
});   




