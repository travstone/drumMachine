
// Drum Machine
// Currently implemented as ES5 class, but could be done differently
// Some of these methods could probably be static
// As it stands I think they're all testable since they're exposed 

function JS808() {

	var drumMachine = {
		tempo: 120,
		steps: 16,
		stepsPerBeat: 4,
		running: false,
		clockId: null,
		currentStep: 1,
		currentPattern: null,
		// A number of other selectors/jQuery objects 
		// could be cached like this
		$stepCounter: null,

		start: function() {
			console.log('Start clock');
			this.clock(true);
		},

		stop: function() {
			console.log('Stop clock');
			this.clock(false);
		},

		timeoutLength: function() {
			// Probably don't need a var here, just return the value
			var time = (60000 / this.tempo) / (this.steps / this.stepsPerBeat);
			return time;
		},

		blinkLength: function() {
			return this.timeoutLength();
		},

		// Possibly set this outside of the instance (make it static)
		clock: function(run) {
			var _self = this;
			if (run) {
				_self.running = true;
				_self.showCurrentStep();
				_self.triggerSound();
				// TBD: is it better to use setInterval instead of timeout/
				// This approach makes it easy to change the tempo, but I have
				// a hunch that we're losing a few (to tens of) ms each time
				// which isn't so good for keeping time
				_self.clockId = window.setTimeout(function() {
					_self.clock(true);
				}, _self.timeoutLength());

				_self.currentStep = (_self.currentStep === _self.steps) ? 1 : _self.currentStep + 1;

			} else {
				_self.running = false;
				if (_self.clockId) {
					window.clearTimeout(_self.clockId);
				}
			}
		},

		showCurrentStep: function() {
			// These selectors/jQuery objects could be cached
			var $counterEl = this.$stepCounter.find('td:nth-child('+(this.currentStep+1)+')');
			window.requestAnimationFrame(function() {
				$counterEl.addClass('activeStep');
			});
			window.setTimeout(function() {
				window.requestAnimationFrame(function() {
					$counterEl.removeClass('activeStep');
				});
			},this.blinkLength());
		},

		triggerSound: function() {
			// These selectors/jQuery objects could be cached
			var _self = this,
				$sounds = $('#sounds'),
				pattern = this.patterns[this.currentPattern],
				currentStepSel = _self.currentStep-1;

			$.each(pattern, function(idx, sound) {

				var $cels = $('#'+idx).find('td').not(':first-child'),
					$currentCel = $cels.eq(currentStepSel);

				if (sound[currentStepSel]) {
					// TODO: actually trigger the sound here; currently only highlighting the sound/step visually
					window.requestAnimationFrame(function() {
						$currentCel.find('label').addClass('hit');
					});
					window.setTimeout(function() {
						window.requestAnimationFrame(function() {
							$currentCel.find('label').removeClass('hit');
						});
					},_self.blinkLength());
				}

			});

		},

		// Using arrays here, and addressing via index
		// this approach may not work so well for patterns
		// that are shorter than the overall `steps` length
		// It should be possible to support amplitude by
		// giving a value less than 1 but greater than 0
		patterns: {
			pattern1: {
				sound1: [
					1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0
				],
				sound2: [
					0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0
				],
				sound3: [
					1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0
				],
				sound4: [
					0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0
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
					1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0
				],
				sound2: [
					0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0
				],
				sound3: [
					0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0
				],
				sound4: [
					0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0
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
					1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0
				],
				sound2: [
					0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0
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
			// These selectors/jQuery objects could be cached
			var $sounds = $('#sounds'),
				pattern = this.patterns[this.currentPattern];

			$sounds.find('input').each(function(idx3, el) {
				$(el).prop('checked',false);
			});

			$.each(pattern, function(idx, sound) {
				var $cels = $('#'+idx).find('td').not(':first-child');
				$cels.each(function(idx2,cel) {
					if (sound[idx2]) {
						$(cel).find('input').prop('checked',true);
					}
				});
			});
		},


		generateGrid: function() {
			var _self = this,
				$td = $('<td><input type="checkbox" name=""><label for=""></label></td>'),
				$trEls = $('#sounds').find('tr').not('#stepCounter');
			$trEls.each(function(idx, el) {
				var count = 0,
					sound = $(el).attr('id');
				for (count; count < _self.steps; count++) {
					$(el).append('<td><input type="checkbox" id="'+(sound + 'r' + count)+'" name="'+(sound + 'r' + count)+'"><label for="'+(sound + 'r' + count)+'"></label></td>')
				}
			})
		},

		// A lot of these selectors/jQuery objects could be cached
		init: function() {
			var _self = this;
			_self.$stepCounter = $('#stepCounter');

			_self.generateGrid();

			$('#tempo').val(_self.tempo).on('input change', function(e) {
				var $targ = $(e.currentTarget),
					val = $targ.val();
				_self.tempo = val;
				// The following gets a little squirrelly, so not used now
				// without it, makes for a bit of a delay at low tempos
				// window.clearTimeout(_self.clockId);
				// _self.clock(true);
			});
			$('#playPause').on('click', function(e) {
				var $targ = $(e.currentTarget),
					$module = $('.audioModule');
				if (_self.running) {
					_self.stop();
					$module.removeClass('playing');
					$targ.html('<i class="fas fa-play-circle"></i> Play');
				} else {
					_self.start();
					$module.addClass('playing');
					$targ.html('<i class="fas fa-pause-circle"></i> Pause');
				}
				$targ.blur();
			});
			$('#stop').on('click', function(e) {
				var $targ = $(e.currentTarget);
				_self.stop();
				_self.currentStep = 1;
				$('.audioModule').removeClass('playing');
				$('#playPause').html('<i class="fas fa-play-circle"></i> Play');
				$targ.blur();
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
					// the following gives the right index, but only because 
					// the first TD (0) isn't used for the pattern (it's the sound name)
					// which is to say: this approach is brittle
					step = $targ.parent().index() - 1;

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
	// return the drum machine object explicitly
	// I tend to favor the more verbose approach
	return drumMachine;

}

var dm = new JS808();
console.log(dm);

