

// Drum Machine
// Currently implemented as ES5 class, but could be done differently

function JS808() {

	var drumMachine = {
		tempo: 120,
		steps: 16,
		stepsPerBeat: 2,
		running: false,
		clockId: null,
		currentStep: 1,
		currentPattern: null,

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
			return this.timeoutLength();
		},

		clock: function(run) {
			var _self = this;
			if (run) {
				//console.log('Start clock');
				_self.running = true;
				_self.showCurrentStep();
				_self.triggerSound();

				_self.clockId = window.setTimeout(function() {
					_self.clock(true);
				}, _self.timeoutLength());

				_self.currentStep = (_self.currentStep === _self.steps) ? 1 : _self.currentStep + 1;

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
			var _self = this,
				$sounds = $('#sounds'),
				pattern = this.patterns[this.currentPattern],
				currentStepSel = _self.currentStep-1;

			$.each(pattern, function(idx, sound) {

				var $cels = $('#'+idx).find('td').not(':first-child'),
					$currentCel = $cels.eq(currentStepSel);

				if (sound[currentStepSel]) {
					// TODO (ts): actually trigger the sound here; currently only highlighting the sound/step visually
					window.requestAnimationFrame(function() {
						$currentCel.attr('style','background: red;');
					});
					window.setTimeout(function() {
						window.requestAnimationFrame(function() {
							$currentCel.attr('style', '');
						});
					},_self.blinkLength());
				}

			});

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
					1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0
				],
				sound4: [
					0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0
				],
				sound5: [
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				sound6: [
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				]
			},
			pattern2: {
				sound1: [
					1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0
				],
				sound2: [
					0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0
				],
				sound3: [
					1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0
				],
				sound4: [
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				sound5: [
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				sound6: [
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				]
			},
			pattern3: {
				sound1: [
					1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0
				],
				sound2: [
					0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0
				],
				sound3: [
					1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0
				],
				sound4: [
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				sound5: [
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				],
				sound6: [
					0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
				]
			},
		},


		drawPattern: function() {
			var $sounds = $('#sounds'),
				pattern = this.patterns[this.currentPattern];

			$sounds.find('input').each(function(idx3, el) {
				$(el).prop('checked',false);
			});

			$.each(pattern, function(idx, sound) {
				var $cels = $('#'+idx).find('td').not(':first-child');

				$cels.each(function(idx2,cel) {
					//console.log(idx2,cel);
					if (sound[idx2]) {
						$(cel).find('input').prop('checked',true);//html('<div class="soundNote">X</div>');
					}
				});
			});
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
				var $targ = $(e.currentTarget);
				if (_self.running) {
					_self.stop();
					$targ.text('Play');
				} else {
					_self.start();
					$targ.text('Pause');
				}
			});
			$('#stop').on('click', function(e) {
				_self.stop();
				_self.currentStep = 1;
				$('#playPause').text('Play');
			});
			$('#patternSelect').on('change', function(e) {
				var $targ = $(e.currentTarget),
					val = $targ.val();
				_self.currentPattern = val;
				_self.drawPattern();
			})

			$('table td input').on('change', function(e) {
				var $targ = $(e.currentTarget),
					val = $targ.prop('checked'),
					sound = $targ.closest('tr').attr('id'),
					step = $targ.parent().index() - 1; // this gives the right index, but only because the first TD (0) isn't used for the pattern

				if (val) {
					_self.patterns[_self.currentPattern][sound][step] = 1;
				} else {
					_self.patterns[_self.currentPattern][sound][step] = 0;
				}

			});


			_self.currentPattern = 'pattern1';
			_self.drawPattern();

		}


	}

	// init the object automatically; maybe not?
	drumMachine.init();

	return drumMachine;

}

var dm = new JS808();

