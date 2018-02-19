

function JS808() {

	var drumMachine = {
		tempo: 100,
		steps: 16,
		stepsPerBeat: 2,
		running: false,
		clockId: null,
		currentStep: 1,

		$stepCounter: null,

		start: function() {
			this.clock(true);
		},

		stop: function() {
			this.clock(false);
		},

		timeoutLength: function() {
			var time = (60000 / this.tempo) / (this.steps / this.stepsPerBeat);
			return time;
		},

		blinkLength: function() {
			return this.timeoutLength();// / 2;
		},

		clock: function(run) {
			var _self = this;
			if (run) {
				//console.log('Start clock');
				_self.running = true;
				_self.showCurrentStep();
				_self.triggerSound();
				_self.currentStep = (_self.currentStep === _self.steps) ? 1 : _self.currentStep + 1;
				_self.clockId = window.setTimeout(function() {
					_self.clock(true);
				}, _self.timeoutLength());

			} else {
				_self.running = false;
				if (_self.clockId) {
					console.log('Stop clock');
					window.clearInterval(_self.clockId);
				}
			}
		},

		showCurrentStep: function() {
			var $counterEl = this.$stepCounter.find('td:nth-child('+(this.currentStep+1)+')');//   document.querySelector('#stepCounter td:nth-child('+(this.currentStep+1)+')');
			window.requestAnimationFrame(function() {
				$counterEl.attr('style','background: red;');
			});
			window.setTimeout(function() {
				window.requestAnimationFrame(function() {
					$counterEl.attr('style', '');
				});
			},this.blinkLength());
		},

		triggerSound: function() {
			
			// do something else
		},


		patterns: {
			pattern1: {
				sound1: [
					1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0
				],
				sound2: [
					0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0
				],
				sound3: [
					0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0
				]
			}
		},


		drawPattern: function(pattern) {
			var $sounds = $('#sounds'),
				pattern = this.patterns[pattern];
			$.each(pattern, function(idx, sound) {
				var count = 0,
					$cels = $('#'+idx).find('td').not(':first-child');

				$cels.each(function(idx2,cel) {
					console.log(idx2,cel);
					if (sound[idx2]) {
						$(cel).html('<div class="soundNote">X</div>');
					}
				})
			})	
		},


		init: function() {
			var _self = this;
			_self.$stepCounter = $('#stepCounter');
			$('#tempo').val(_self.tempo).on('input change', function(e) {
				var $targ = $(e.currentTarget),
					val = $targ.val();
				_self.tempo = val;	
			});
			$('#playPause').on('click', function(e) {
				if (_self.running) {
					_self.stop();
				} else {
					_self.start();
				}
			});
			_self.drawPattern('pattern1');
		}


	}

	drumMachine.init();

	return drumMachine;

}

var dm = new JS808();

console.log(dm);

// dm.start();
// window.setTimeout(function() {
// 	dm.stop();
// }, 6000);
