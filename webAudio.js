
// Generic Web Audio functions


function AudioSystem() {


	var audioSystem = {

		audioCtx: new (window.AudioContext || window.webkitAudioContext)(),
		sounds: {
			sound1: {
				name: 'sound1',
				location: 'sounds/BassShort.wav',
				buffer: null
			},
			sound2: {
				name: 'sound2',
				location: 'sounds/Snare1.wav',
				buffer: null
			},
			sound3: {
				name: 'sound3',
				location: 'sounds/ClosedHat.wav',
				buffer: null
			},
			sound4: {
				name: 'sound4',
				location: 'sounds/OpenHatMid.wav',
				buffer: null
			}
		},

		playSound: function(name) {
			var _self = this,
				currentSound;
			if (_self.sounds[name]) {
				currentSound = _self.audioCtx.createBufferSource();
				currentSound.buffer = _self.sounds[name].buffer;
				currentSound.connect(_self.audioCtx.destination);
				currentSound.start(0);
			}
		},

		makeRequest: function(name) {
			var request = new XMLHttpRequest(),
				_self = this;
			request.open('GET', _self.sounds[name].location, true);
			request.responseType = 'arraybuffer';
			request.onload = function() {
			var audioData = request.response;
			_self.audioCtx.decodeAudioData(audioData, function(buffer) {
				_self.sounds[name].buffer = buffer;
			  },
			  function(e){ console.log("Error with decoding audio data" + e.err); });
			}
			request.send();
		},

		getData: function() {
			var _self = this;
			$.each(_self.sounds, function(name, sound) {
				_self.makeRequest(name);
			});
		},

		init: function() {
			this.getData();
		}

	};

	audioSystem.init();

	return audioSystem;

}

