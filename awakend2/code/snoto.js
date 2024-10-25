class KLGLOTT88Oscillator {
	constructor(sampleRate = 44100) {
	  this.sampleRate = sampleRate;
	  this.phase = 0;
	  this.frequency = 100;
	  this.targetFrequency = 100;
	  this.smoothingFactor = 0.008; // Set to a smaller value
	  this.setParameters(0.9, 0.5, 1);
	  this.updateParameters();
	  this.currentOq = 0.6;
	  this.targetOq = 0.6;
	  this.oqSmoothingFactor = 0.001; // Adjust the smoothing factor
	  this.currentSq = 0.5;
	  this.targetSq = 0.5;
	  this.sqSmoothingFactor = 0.001; // Smoothing factor for Sq
	}
  
	setFrequency(frequency) {
	  this.targetFrequency = frequency;
	}
  
	setParameters(oq = 0.6, sq = 3, av = 0.8) {
	  this.targetOq = constrain(oq, 0.4, 0.8);
	//   this.targetSq = map(this.targetOq, 0.01, 0.99, 0.1, 3); // Sq to mapping
	  this.targetSq = 3;
	  this.av = av; // Amplitude of voicing
	  this.updateParameters();
	}
  
	updateFrequency() {
	  this.frequency += (this.targetFrequency - this.frequency) * this.smoothingFactor;
	  this.updateParameters();
	}
  
	updateParameters() {
	  this.period = this.sampleRate / this.frequency;
	  this.nk = Math.floor(this.period * this.currentOq);
	  const sqSum = this.currentSq + 1;
	  this.a = 27 * this.currentSq / (4 * this.nk * sqSum * sqSum);
	  this.b = 27 * this.currentSq / (4 * this.nk * this.nk * sqSum * sqSum);
	}
  
	generate() {
	  this.updateFrequency();
	  let sample;
	  if (this.phase < this.nk) {
		sample = this.av * (this.a * this.phase - this.b * this.phase * this.phase);
	  } else {
		sample = 0;
	  }
	
	  this.phase += 1;
	  if (this.phase >= this.period) {
		this.phase -= this.period;
	  }
	
	  // Oq smoothing
	  this.currentOq += (this.targetOq - this.currentOq) * this.oqSmoothingFactor;
	
	  // Sq smoothing
	  this.currentSq += (this.targetSq - this.currentSq) * this.sqSmoothingFactor;
	
	  // Update parameters
	  this.updateParameters();
	
	  return sample;
	}
}


class Vowel {
    constructor(f1, f2, f3, name, f1min, f1max, f2min, f2max, windowWidth, windowHeight) {
        this.f1 = f1;
        this.f2 = f2;
        this.f3 = f3;
        this.name = name;
        this.x = map(this.f1, f1min, f1max, 0, windowWidth);
        this.y = map(this.f2, f2min, f2max, windowHeight, 0);
    }
}

class SnMusic {
	constructor() {
		this.klglott88Osc;
		this.audioContext;
		this.scriptNode;
		this.isPlaying = false;

		// Collage 
		this.collageObjectCount = 21;
		// this.collageObjects = [];
		// this.collageIndexPlaying = 0;
		// this.collagePickedObj;
		// this.collageMinInterval = 0.1;  // Minimum interval (seconds)
        // this.collageMaxInterval = 8;  // Maximum interval (seconds)
        // this.collageIntervalInSeconds = 3;  // Initial interval
        // this.collageSoundLoopProbability = 0.8;
        // this.collageSoundLoop = new p5.SoundLoop(this.onSoundLoop.bind(this), this.collageIntervalInSeconds);
		
		// this.collageGain = new p5.Gain();
		// this.collageGain.connect();
		// this.collageGain.amp(0);

		// this.collageAttackTime = 2;
		// this.collageReleaseTime = 1.7;

		// this.collageBasePitch = 1;

		// Vowel
		this.vowels = [];
		this.vowelOsc;
		this.vowelNoise;
		this.vowelFiltf1, this.vowelFiltf2, this.vowelFiltf3;
		this.vowelEnv;		
		this.vowelCurrentPitch = 0;
		this.vowelTargetPitch = 0;
		this.vowelCurrentF1 = 0;
		this.vowelTargetF1 = 0;
		this.vowelCurrentF2 = 0;
		this.vowelTargetF2 = 0;
		this.vowelCurrentF3 = 0;
		this.vowelTargetF3 = 0;
		this.isVowelPlaying = false;
		this.vowelPlayTimeout = null;
        this.isVowelPlaying = false;

		this.vowelAttackTime = 0.2; // Time to reach maximum volume (seconds)
		this.vowelReleaseTime = 0.1; // Time to reach zero volume (seconds)
		this.vowelF1min = 300;
		this.vowelF1max = 1200;
		this.vowelF2min = 2400;
		this.vowelF2max = 800;
		this.vowelF3min = 2000;
		this.vowelF3max = 3000;
		this.vowelBaseF3 = random(this.vowelF3min, this.vowelF3max);
		
		// Range for random formant variation
        this.formantRandomRange = 100; // Hz
        // Formant change speed
        this.formantSmoothingFactor = 0.2; // Value between 0 and 1. Smaller is smoother
		this.vowelGain = new p5.Gain();
		this.vowelGain.amp(1);
		this.vowelGain.connect();

		this.vowelFiltf1 = new p5.BandPass();
		this.vowelFiltf2 = new p5.BandPass();
		this.vowelFiltf3 = new p5.BandPass();
		this.vowelFiltf1.disconnect();
		this.vowelFiltf2.disconnect();
		this.vowelFiltf3.disconnect();
	
		this.vowelFiltf1.res(9);
		this.vowelFiltf2.res(11);
		this.vowelFiltf3.res(11);

		this.vowelFiltf1.amp(1);
		this.vowelFiltf2.amp(0.7);
		this.vowelFiltf3.amp(0.4);
	
		this.vowelGain.setInput(this.vowelFiltf1);
		this.vowelGain.setInput(this.vowelFiltf2);
		this.vowelGain.setInput(this.vowelFiltf3);
		
		this.vowelEnv = new p5.Envelope();
		this.vowelEnv.setADSR(this.vowelAttackTime, 0.1, 1, this.vowelReleaseTime);
		this.vowelEnv.setRange(1, 0);
		this.vowelEnv.connect(this.vowelGain.input.gain);
	

		// this.vowelCurrentPitch = this.vowelTargetPitch = (this.vowelPitchMin + this.vowelPitchMax) / 2;
		this.vowelCurrentF1 = this.vowelTargetF1 = (this.vowelF1min + this.vowelF1max) / 2;
		this.vowelCurrentF2 = this.vowelTargetF2 = (this.vowelF2min + this.vowelF2max) / 2;
		this.vowelCurrentF3 = this.vowelTargetF3 = this.vowelBaseF3;
	
		this.vowelFiltf1.freq(this.vowelCurrentF1);
		this.vowelFiltf2.freq(this.vowelCurrentF2);
		this.vowelFiltf3.freq(this.vowelCurrentF3);

		this.currentVowelVolume = 1.0;
		this.targetVowelVolume = 4.0;
		this.volumeSmoothingFactor = 0.01; // Adjust this value to control smoothing speed
		this.volumeFluctuationAmount = 0.3; // 揺らぎの最大量（0.0 - 1.0）
		// this.baseVowelVolume = 1.0; // 基本の母音音量

		//VowelNoiseOsc
		this.vowelNoise = new p5.Noise('pink');
		this.vowelNoise.amp(0.07);
		this.vowelNoise.disconnect();
		this.vowelNoise.connect(this.vowelFiltf1);
		this.vowelNoise.connect(this.vowelFiltf2);
		this.vowelNoise.connect(this.vowelFiltf3);

		this.vowelNoise.start();


		// klglott88
		this.klglott88GainNode = null;
		this.klglott88Volume = 4;
		// this.baseOq = 0.4; // Basic Open quotient value
		this.oqRange = 0.6; // Open quotient range by noise		
		this.currentOq = 0; // Initial value
		this.oqFluctuationDepth = 0.1; // Depth of fluctuation of oq
		// Perlin noise
		this.baseNoiseIncrement = 0.03;//random(0.0001, 0.01);//0.001
		this.fastNoiseIncrement = 0.4;//random(0.1, 1);

		this.noiseOffset = 0;
		this.noiseIncrement = this.baseNoiseIncrement; // Noise change speed
		this.noiseMin = 0.0; // Minimum noise value
		this.noiseMax = 1; // Maximum noise value
		this.noiseValue = 0;

		
        this.halfHeight = windowHeight / 2;

        // Background
        this.background = null;
        this.backgroundBaseVolume = 1; // Basic volume
        this.backgroundGain = new p5.Gain();
        this.backgroundGain.disconnect();
        this.backgroundGain.amp(this.backgroundBaseVolume); // Set basic volume
        this.backgroundVolume = 1; // Multiplier (initial value is 1)
        this.targetBackgroundVolume = 1; // Target multiplier
        this.backgroundVolumeLerpFactor = 0.05; // Smoothness of volume change

		this.backgroundPitchMultiplier = 1; // Normal pitch
		this.backgroundPitchTarget = 1;
		this.backgroundPitchChangeSpeed = 0.005; // Pitch change speed		

        // music
        this.music = null;
        this.musicGain = new p5.Gain();
        this.musicGain.disconnect();
        this.musicGain.amp(0.9); 

		this.musicAttackTime = 2.6;
		this.musicReleaseTime = 0.6;

        this.musicEnv = new p5.Envelope();
        this.musicEnv.setADSR(this.musicAttackTime, 0.1, 1, this.musicReleaseTime); // Set values for attack, decay, sustain, and release
        this.musicEnv.setRange(1, 0); // Set maximum and minimum volume
		
        this.musicEnv.connect(this.musicGain);

		this.maxMusicVolume = 0.8;//0.8;// // Maximum volume for music
        this.musicVolume = 0; // Initial volume (muted at page load)
        this.targetMusicVolume = 0; // Target volume
        this.musicVolumeLerpFactor = 0.032; // Smoothness of volume change
        // this.musicFadeTime = 0.3; // Fade-in/out time (seconds)
		
		this.musicPitchMultiplier = 1; // Initial value (3/4 speed)
		this.musicPitchTarget = 1; // Initial target speed
		this.musicPitchChangeSpeed = 0.15; // Speed change speed		
	
		// // Master filter settings
		// this.masterFilt = new p5.HighPass();
		// this.masterFilt.connect();
		// this.masterFilt.res(8);
		// this.defaultCutoff = 3000; // Default cutoff frequency
		// this.maxCutoff = 20; // Maximum cutoff frequency (inaudible)
		// this.currentCutoff = this.defaultCutoff;
		// this.targetCutoff = this.defaultCutoff;
		// this.cutoffSmoothingFactor = 0.01; // Smoothing factor (between 0.0 and 1.0)
		// this.masterFilt.freq(this.currentCutoff);
		this.musicGain.connect();
		this.backgroundGain.connect();

		// pitch
		this.currentPitch = 0;
        this.targetPitch = 0;
		// MIDI note number range
		this.midiNoteMin = 24; // C2
		this.midiNoteMax = 96; // C6
		// Define scales (MIDI note numbers)
		this.scales = {
			major: [0, 2, 4, 5, 7, 9, 11],
			minor: [0, 2, 3, 5, 7, 8, 10],
			pentatonic: [0, 2, 4, 7, 9],
			original: [0,2,4, 5, 7, 9]
		
		};

		this.currentScale = this.scales.original; // Set default scale
		this.rootNote = 9; // Default root note (C)

		// Specify base pitch in MIDI note number
		this.baseMidiNote = 62;//random(50, 71); // A4 (middle A)
		// console.log("baseMidiNote:", this.baseMidiNote);
		// this.midiNoteRange = 4;//12; //  y coordinate gives midi number range 	

		// vowel warble timing
		this.warbleProbability = 0;//0.01;//random(0, 0.04); // Probability of warble 0 to 1. Smaller is more random 0.007
		// console.log("warbleProbability:", this.warbleProbability);
		this.lastScaleChangeTime = 0;
		this.scaleChangeInterval = 100; // Set interval in milliseconds (e.g., 1 second)
		this.currentScaleIndex = 0;
		this.warbleMidiNote = 0;
		this.warbleDuration = 100; // Warble duration (milliseconds)
		this.warbleStartTime = 0; // Warble start time

		this.pitchNoiseMultiplier = 1;//random(0, 24);//Larger value for more melodic movement
		// console.log("pitchNoiseMultiplier:", this.pitchNoiseMultiplier);		
		this.melodyMax = 12;

		this.vibratoRate = 11.2;//random(4, 15);  // Vibrato speed (Hz)
		// console.log("vibratoRate:", this.vibratoRate);
		this.vibratoDepth = 6.5;//random(0, 13.6); // Vibrato depth (Hz)
		// console.log("vibratoDepth:", this.vibratoDepth);
		this.volumeVibratoDepth = 0.4;//random(0.05, 0.55); // Volume vibrato depth
		// console.log("volumeVibratoDepth:", this.volumeVibratoDepth);
		this.vibratoRampUpTime = 3.1;//2;//random(2.8, 7); // Time for vibrato to reach maximum depth (seconds)
		// console.log("vibratoRampUpTime:", this.vibratoRampUpTime);
		
		this.pitchFluctuationDepth = 8;//depth of noise effect
		this.vibratoRateFluctuationDepth = 0.009;//depth of noise effect
		this.vibratoStartTime = null;
		this.currentVibratoDepth = 0;
		this.isVibratoActive = false;
		this.vibrato = 0;

		// Initial global pitch multiplier
		// this.initialGlobalPitchMultiplier = 1; // Initial multiplier (value at page load)
		// this.globalPitchMultiplier = this.initialGlobalPitchMultiplier; // Current multiplier
		// this.globalPitchTarget = this.initialGlobalPitchMultiplier; // Target multiplier
		// this.globalPitchChangeSpeed = 0.08; // Speed of multiplier change (interpolation factor per frame)
		
		this.pitchSmoothingFactor = .5; // Value between 0 and 1. Smaller is smoother currentpitch determination
        // this.pitchTransitionTime = 0; // Pitch transition time (seconds) Passed to the oscillator to determine the time it takes to reach the target pitch

        


		this.mappedNoise = 0; 
	}

	fileyomikomi() {
		// soundFormats('mp3');
        // for (let i = 0; i < this.collageObjectCount; i++) {
        //     let fileName = (i + 1).toString().padStart(2, '0') + '.mp3';
        //     let filePath = `./assets/sounds/music/${fileName}`;
            // console.log("Attempting to load:", filePath);
        //     let sound = loadSound(
        //         filePath,
        //         () => {
        //             // console.log(`Loaded sound ${filePath}`);
        //             sound.disconnect();
		// 			// this.distortion.process(sound);
        //             this.collageGain.setInput(sound);
					
        //         },
        //         (err) => console.error(`Failed to load sound ${filePath}:`, err)
        //     );

		// 	let env = new p5.Envelope();
		// 	// Set envelope parameters (using example values)
		// 	env.setADSR(this.collageAttackTime, 0.1, 1, this.collageReleaseTime); 
		// 	// sound.amp(env);
        //     this.collageObjects.push({ sound: sound, envelope: env });
        // }



        // Load background
        this.loadBackground('assets/02.mp3');

        // Load music sound file randomly
        this.loadRandomMusic();
	}

	// Load a random music file
	loadRandomMusic() {
		let randomIndex = floor(random(this.collageObjectCount));
		let fileName = (randomIndex + 1).toString().padStart(2, '0') + '.mp3';
		// let filePath = `assets/sounds/music/${fileName}`;
		// console.log("randomIndex:", randomIndex);
		let filePath = `assets/01m1extend.mp3`;
		
		// console.log(`Randomly selected music file: ${filePath}`);
		this.loadMusic(filePath);
	}

	setup() {
		this.audioContext = getAudioContext();

		this.klglott88Osc = new KLGLOTT88Oscillator(this.audioContext.sampleRate);

		// Create ScriptProcessorNode (consider moving to AudioWorkletNode in the future)
		this.scriptNode = this.audioContext.createScriptProcessor(1024, 0, 1);
		this.scriptNode.onaudioprocess = (audioProcessingEvent) => {
		  const outputBuffer = audioProcessingEvent.outputBuffer;
		  const channelData = outputBuffer.getChannelData(0);
		  for (let i = 0; i < channelData.length; i++) {
			channelData[i] = this.klglott88Osc.generate();
		  }
		};

		this.klglott88GainNode = this.audioContext.createGain();

		this.scriptNode.disconnect();
		this.scriptNode.connect(this.klglott88GainNode);
		// this.klglott88GainNode.connect(this.audioContext.destination);

		this.klglott88setVolume(this.klglott88Volume);
		this.klglott88GainNode.connect(this.vowelFiltf1);
		this.klglott88GainNode.connect(this.vowelFiltf2);
		this.klglott88GainNode.connect(this.vowelFiltf3);
		// this.vowelGain.setInput(this.klglott88GainNode);


		getAudioContext().resume();


        // Start playing background
        this.playBackground();

        // Start playing music
        this.playMusic();
		


	console.log("nakaokasan setup dayo");
		this.targetBackgroundVolume = 0
		this.backgroundVolume = 0;
		this.targetMusicVolume = this.maxMusicVolume;
		this.musicVolume = 0;
		//this.Background_genzai_vol = 0
		//this.Music_genzai_vol = 0
      // spd
		// spd  
	}

	f_mousedown() {
		// this.backgroundPitchTarget = 0.25; 
		// this.globalPitchTarget = 1; 
		// this.collageIndexPlaying = floor(random(this.collageObjectCount));
		// this.collageSoundLoop.start();

		// this.targetBackgroundVolume = 0;
		// this.targetMusicVolume = this.maxMusicVolume;
		// this.musicPitchTarget = 1; // Set to normal speed
		// this.setTargetMasterFilterCutoff(this.maxCutoff);
	}

	f_mouseup() {
		// this.backgroundPitchTarget = 1; // Restore background pitch
		// this.globalPitchTarget = this.initialGlobalPitchMultiplier; // Restore target multiplier to initial value
		// this.collageSoundLoop.stop();
		
		// if (this.collagePickedObj) {
		// 	this.stopCollage();
		// 	this.collagePickedObj = null;
		// }

		// this.targetBackgroundVolume = this.backgroundBaseVolume;
		// this.targetMusicVolume = 0;
		// this.musicPitchTarget = 0.5; 
		// this.setTargetMasterFilterCutoff(this.defaultCutoff);
	}

	f_ef() {
		// console.log("targetMusicVolume:", this.targetMusicVolume);
		// console.log("musicVolume:", this.musicVolume);
		// console.log("currentVibratoDepth:", this.currentVibratoDepth);
		// console.log("vibrato:", this.vibrato);
		// console.log("noiseValue:", this.noiseValue);
		// console.log("globalOpenclosev:", globalOpenclosev);
		// console.log("isVowelPlaying:", this.isVowelPlaying);
		// console.log("currentVowelVolume:", this.currentVowelVolume);
		// console.log("this.klglott88Volume:", this.klglott88Volume);

		// Control pronunciation start/stop
		this.updateVowelPlayback();

		// this.mx = constrain(mouseX, 0, width);
		// this.my = constrain(mouseY, 0, height);
		
		this.adjust(this.mx, this.my - this.halfHeight);
		this.updateParameters();
		this.updateBackgroundVolume();
        this.updateMusicVolume();

		this.noiseValue = noise(this.noiseOffset);
		this.noiseOffset += this.noiseIncrement;
		// this.updateMasterFilterCutoff();
	}

	adjust(mx, my) {

		// let adjustedMx = constrain(mx, 0, width);
		// let adjustedMy = constrain(map(my, 0, this.halfHeight, height, this.halfHeight), this.halfHeight, height);

		// if (globalOpenclosev >= 0 && globalOpenclosev <= 0.67) {
		// 	this.mappedNoise = map(this.noiseValue, 0, 1, -1, 1) -7;//pitchdown when mouse is closed
		// } else {
		// 	// this.mappedNoise = 0;
		// }		
		// let mappedNoise = map(this.noiseValue, 0, 1, -1, 1);

		// let midiNoteOffset = map(my, 0, this.halfHeight, 0, this.midiNoteRange);
		// let currentMidiNote = this.baseMidiNote + midiNoteOffset + this.pitchNoiseMultiplier * mappedNoise;

		let currentMidiNote = this.baseMidiNote  + this.pitchNoiseMultiplier * this.mappedNoise;
		
		// Get current time
		let currentTime = millis();

		// Check for warble end
		if (this.warbleMidiNote !== 0 && currentTime - this.warbleStartTime > this.warbleDuration) {
			this.warbleMidiNote = 0;
		}

		// Check for new warble start
		if (currentTime - this.lastScaleChangeTime > this.scaleChangeInterval) {
			if (random() < this.warbleProbability) {
				this.warbleMidiNote = random([-2,-1, 1,2]); // Exclude 0
				this.warbleStartTime = currentTime;
				this.lastScaleChangeTime = currentTime;
			}
		}

		// Adjust pitch to scale
		let scaleNote = this.snapToScale(currentMidiNote + this.warbleMidiNote);
		// console.log("scaleNote:", scaleNote);

		this.targetPitch = midiToFreq(scaleNote);

		// console.log(`MIDI: ${scaleNote}, Pitch: ${this.targetPitch.toFixed(2)} Hz,globalPitchMultiplier:${this.globalPitchMultiplier}`);

		// Control vowelFiltf1 frequency with Y-axis position (without using margin)
			this.vowelTargetF1 = map(globalOpenclosev, 0.46, 1, this.vowelF1min, this.vowelF1max);
		
		// Control vowelFiltf2 frequency with X-axis position (without using margin)
		// this.vowelTargetF2 = map(adjustedMx, 0, width, this.vowelF2min, this.vowelF2max);
		this.vowelTargetF2 = map(globalOpenclosev, 0.46, 1, this.vowelF2min, this.vowelF2max);
		// Update F3
		this.vowelTargetF3 = this.vowelBaseF3 + random(-this.formantRandomRange, this.formantRandomRange);

		this.vowelTargetF1 = constrain(this.vowelTargetF1, this.vowelF1min, this.vowelF1max);
		this.vowelTargetF2 = constrain(this.vowelTargetF2, this.vowelF2min, this.vowelF2max);
		this.vowelTargetF3 = constrain(this.vowelTargetF3, this.vowelF3min, this.vowelF3max);
	}

	updateParameters() {
		if (!this.klglott88Osc) {
			console.warn('KLGLOTT88Oscillator is not initialized yet');
			return;
		}

		// Global pitch multiplier to target value interpolation
        // this.globalPitchMultiplier = lerp(
        //     this.globalPitchMultiplier,
        //     this.globalPitchTarget,
        //     this.globalPitchChangeSpeed
        // );
        // console.log(`Global Pitch Multiplier: ${this.globalPitchMultiplier.toFixed(2)}`);

        // Update playback speed for all playing sound files
        // for (let i = 0; i < this.collageObjects.length; i++) {
        //     let sound = this.collageObjects[i].sound;
        //     // if (sound.isPlaying()) {
        //         let newRate = this.collageBasePitch * this.globalPitchMultiplier;
        //         sound.rate(newRate);
        //         // console.log(`Updated rate for sound ${i}: ${newRate}`);
        //     // }
        // }

        // Smooth pitch update
        this.currentPitch = lerp(this.currentPitch, this.targetPitch, this.pitchSmoothingFactor);
		// console.log("currentPitch:", this.currentPitch);
		// console.log("targetPitch:", this.targetPitch);


        // Add fluctuation using existing noise
        let pitchFluctuation = map(this.noiseValue, 0, 1, -1, 1)*this.pitchFluctuationDepth; 
		// console.log("pitchFluctuation:", pitchFluctuation);
        let fluctuatedPitch = this.currentPitch + pitchFluctuation;
		// console.log("fluctuatedPitch:", fluctuatedPitch);

        // Apply vibrato
        if (this.isVibratoActive) {
          let elapsedTime = (millis() / 1000) - this.vibratoStartTime;
          let rampUpFactor = constrain(elapsedTime / this.vibratoRampUpTime, 0, 1);
          this.currentVibratoDepth = this.vibratoDepth * rampUpFactor;

          // ノイズを使用してvibratoRateを変動させる
          let vibratoRateVariation = map(this.noiseValue, 0, 1, -1, 1)*this.vibratoRateFluctuationDepth;
          let currentVibratoRate = this.vibratoRate + vibratoRateVariation;

          this.vibrato = sin(frameCount * currentVibratoRate * TWO_PI / 60) * this.currentVibratoDepth;
        } else {
          this.vibrato = 0;
        }

        // Apply vibrato
        let pitchWithVibrato = fluctuatedPitch + this.vibrato;
		// console.log("pitchWithVibrato:", pitchWithVibrato);
        this.klglott88Osc.setFrequency(pitchWithVibrato );

        this.vowelCurrentF1 = lerp(this.vowelCurrentF1, this.vowelTargetF1, this.formantSmoothingFactor);
        this.vowelCurrentF2 = lerp(this.vowelCurrentF2, this.vowelTargetF2, this.formantSmoothingFactor);
        this.vowelCurrentF3 = lerp(this.vowelCurrentF3, this.vowelTargetF3, this.formantSmoothingFactor);

        this.vowelFiltf1.freq(this.vowelCurrentF1 );
        this.vowelFiltf2.freq(this.vowelCurrentF2 );
        this.vowelFiltf3.freq(this.vowelCurrentF3 );

        // 	Set new target values (with small variations)
        if (frameCount % 10 === 0) { // Update every 10 frames
            this.vowelTargetF1 += random(-this.formantRandomRange / 2, this.formantRandomRange / 2);
            this.vowelTargetF2 += random(-this.formantRandomRange / 2, this.formantRandomRange / 2);
            this.vowelTargetF3 += random(-this.formantRandomRange / 2, this.formantRandomRange / 2);

            this.vowelTargetF1 = constrain(this.vowelTargetF1, this.vowelF1min, this.vowelF1max);
            this.vowelTargetF2 = constrain(this.vowelTargetF2, this.vowelF2min, this.vowelF2max);
            this.vowelTargetF3 = constrain(this.vowelTargetF3, this.vowelF3min, this.vowelF3max);
        }

		// Change noiseIncrement based on globalOpenclosev
		if (globalOpenclosev >= 0 && globalOpenclosev <= 0.7) {
			this.noiseIncrement = this.fastNoiseIncrement;
			// this.pitchNoiseMultiplier = 2.6;
			this.targetVowelVolume = 0.0;
			
		} else if (globalOpenclosev > 0.7 && globalOpenclosev <= 0.8) {
			this.targetVowelVolume = 0.3;
		} else {
			this.noiseIncrement = this.baseNoiseIncrement;
			this.pitchNoiseMultiplier = this.melodyMax;
			this.targetVowelVolume = 4;
		}



		// Update Open quotient using globalOpenclosev and noiseValue
		let baseOqFromGlobal = map(constrain(globalOpenclosev, 0.66, 1), 0.66, 1, 1, 0);
		// console.log("baseOqFromGlobal:", baseOqFromGlobal);
		//adjust the depth of fluctuation of oq,sq
		let newOq = baseOqFromGlobal + this.noiseValue + this.vibrato/this.vibratoDepth*this.oqFluctuationDepth;
		
		newOq = constrain(newOq, 0, 1); // oqを0から1の範囲に制限
		this.klglott88Osc.setParameters(newOq);

	


		// Update background pitch
		this.backgroundPitchMultiplier = lerp(
			this.backgroundPitchMultiplier,
			this.backgroundPitchTarget,
			this.backgroundPitchChangeSpeed
		);
		// console.log("backgroundPitchMultiplier:", this.backgroundPitchMultiplier);

		// Apply background pitch
		if (this.background) {
			this.background.rate(this.backgroundPitchMultiplier);
		}

        // Update music playback speed
        this.musicPitchMultiplier = lerp(
            this.musicPitchMultiplier,
            this.musicPitchTarget,
            this.musicPitchChangeSpeed
        );

        // Apply music playback speed
        if (this.music) {
            this.music.rate(this.musicPitchMultiplier);
        }

	
		let volumeFluctuation = 1 - (this.noiseValue * this.volumeFluctuationAmount);
		

		let fluctuatedVolume = this.targetVowelVolume * volumeFluctuation;
		// this.vowelGain.amp(fluctuatedVolume);

		// Smooth the volume change
		this.currentVowelVolume = lerp(this.currentVowelVolume, fluctuatedVolume, this.volumeSmoothingFactor);

		// Apply the smoothed volume
		this.vowelGain.amp(this.currentVowelVolume);
	}



	// playCollage() {
	// 	if (ismusic) {
	// 	this.collagePickedObj = this.collageObjects[this.collageIndexPlaying];
	// 	let sound = this.collagePickedObj.sound;
    // 	let env = this.collagePickedObj.envelope;
	// 	// sound.playMode('restart');
	// 	sound.loop();
	// 	env.triggerAttack(sound);
	// 	// console.log("playing " + this.collageIndexPlaying);    
	// 	}
	// }



	// stopCollage() {
	// 	return new Promise((resolve, reject) => {
	// 		if (this.collagePickedObj) {
	// 			let sound = this.collagePickedObj.sound;
	// 			let env = this.collagePickedObj.envelope;
	// 			try {
	// 				env.triggerRelease(sound);
	// 				sound.stop(this.collageReleaseTime);
	// 				// console.log("stopped " + this.collageIndexPlaying);
	// 				this.collagePickedObj = null;
	// 				resolve();
	// 			} catch (error) {
	// 				reject(error);
	// 			}
	// 		} else {
	// 			resolve(); // Resolve even if no object to stop
	// 		}
	// 	});
	// }

	// onSoundLoop method defined within the class
	// onSoundLoop(timeFromNow) {
	// 	// console.log("onSoundLoop called. Time from now:", timeFromNow);

	// 	// Ensure the previous sound is stopped
	// 	if (this.collagePickedObj) {
	// 		this.stopCollage()
	// 			.then(() => {
	// 				// Select and play a new sound after stopping
	// 				this.selectAndPlayNewSound();
	// 			})
	// 			.catch(error => {
	// 				console.error("Error stopping sound:", error);
	// 				// Continue with the next process even if an error occurs
	// 				this.selectAndPlayNewSound();
	// 			});
	// 	} else {
	// 		// Select and play a new sound if no sound is playing
	// 		this.selectAndPlayNewSound();
	// 	}

	// 	// Set random interval for the next loop
	// 	this.setRandomInterval();
	// }

	// selectAndPlayNewSound() {
	// 	if (random() < this.collageSoundLoopProbability) {
	// 		this.collageIndexPlaying = floor(random(this.collageObjectCount));
	// 		// console.log("Playing new sound. Index:", this.collageIndexPlaying);
	// 		this.playCollage();
	// 	} else {
	// 		// console.log("Silent period");
	// 		this.collageIndexPlaying = undefined;
	// 		this.collagePickedObj = null;
	// 	}
	// }

	// setRandomInterval() {
	// 	// Set random new interval
	// 	this.collageIntervalInSeconds = random(this.collageMinInterval, this.collageMaxInterval);
		
	// 	// Update SoundLoop interval
	// 	this.collageSoundLoop.interval = this.collageIntervalInSeconds;
		
	// 	// console.log("New interval: " + this.collageIntervalInSeconds + " seconds");
	// }

	playVowel() {	
		this.vowelEnv.triggerAttack();
		this.isVowelPlaying = true;
		this.vibratoStartTime = millis() / 1000;
		this.isVibratoActive = true;
		this.currentVibratoDepth = 0; // ビブラートの深さをリセット
		// console.log("vibratoStartTime:", this.vibratoStartTime);
		// console.log("Vowel playback started");

	}

	stopVowel() {
		if (this.isVowelPlaying) {
			this.vowelEnv.triggerRelease();
			this.isVowelPlaying = false;
			this.isVibratoActive = false;
			this.currentVibratoDepth = 0; // ビブラートの深さをリセット
			// console.log("Vowel playback stopped");
		}
	}

	updateVowelPlayback() {
		if (globalOpenclosev >= 0.66 && !this.isVowelPlaying) {
		this.playVowel();
		} else if (globalOpenclosev < 0.66 && this.isVowelPlaying) {
		this.stopVowel();
		}
	}
	
	klglott88setVolume(volume) {
		if (this.klglott88GainNode) {
		  this.klglott88GainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
		}
	}		

	calculateScale(baseNote) {
		return this.currentScale.map(interval => baseNote + interval + this.rootNote);
	}

	// // Method to set global pitch multiplier
	// setGlobalPitchMultiplier(multiplier) {
	// 	this.globalPitchMultiplier = multiplier;
	// 	// console.log(`Global Pitch Multiplier set to ${this.globalPitchMultiplier}`);
	// }

	loadBackground(filePath) {
		soundFormats('mp3');
		this.background = loadSound(
			filePath,
			() => {
				// console.log(`Background loaded: ${filePath}`);
				this.background.disconnect();
				this.backgroundGain.setInput(this.background);
			},
			(err) => console.error(`Failed to load background: ${filePath}:`, err)
		);
	}

	playBackground() {
		if (this.background && !this.background.isPlaying()) {
			this.background.loop();
			// console.log('Background playback started');
		}
	}

	stopBackground() {
		if (this.background && this.background.isPlaying()) {
			this.background.stop();
			// console.log('Background playback stopped');
		}
	}

	setBackgroundVolume(volume) {
		this.backgroundGain.amp(volume);
	}

	loadMusic(filePath) {
		soundFormats('mp3');
		this.music = loadSound(
			filePath,
			() => {
				// console.log(`Music loaded: ${filePath}`);
				this.music.disconnect();
				this.musicGain.setInput(this.music);
			},
			(err) => console.error(`Failed to load music: ${filePath}:`, err)
		);
	}

	playMusic() {
		if (this.music && !this.music.isPlaying()) {
			this.music.loop();
			this.music.rate(this.musicPitchMultiplier); // Set initial playback speed
			// console.log('Music playback started');
		}
	}

	stopMusic() {
		if (this.music && this.music.isPlaying()) {
			this.music.stop();
			// console.log('Music playback stopped');
		}
	}

	// fadeBackgroundVolume(targetVolume) {
	// 	this.targetBackgroundVolume = targetVolume;
	// }

	updateBackgroundVolume() {
		this.backgroundVolume = lerp(this.backgroundVolume, this.targetBackgroundVolume, this.backgroundVolumeLerpFactor);
		let adjustedVolume = this.backgroundBaseVolume * this.backgroundVolume;
		this.backgroundGain.amp(adjustedVolume);
	}

	// fadeMusicVolume(targetVolume) {
	// 	this.targetMusicVolume = targetVolume;
	// }

	// Updated method: Update music volume and pitch
	updateMusicVolume() {
		// Update volume based on globalOpenclosev
		// this.targetMusicVolume = globalOpenclosev >= 0.5 ? this.maxMusicVolume: 0;//this.maxMusicVolume
		this.musicVolume = lerp(this.musicVolume, this.targetMusicVolume, this.musicVolumeLerpFactor);
		// Update pitch target based on globalOpenclosev
		// this.musicPitchTarget = globalOpenclosev > 0 ? 1 : 0.5;

		// this.globalPitchTarget = globalOpenclosev > 0.2 ? 1 : 0.5;

		// this.backgroundPitchTarget = globalOpenclosev > 0.2 ? 0.25 : 1;

		// Interpolate current pitch multiplier towards the target
		// this.musicPitchMultiplier = lerp(this.musicPitchMultiplier, this.musicPitchTarget, this.musicPitchChangeSpeed);
		// console.log("musicPitchMultiplier:", this.musicPitchMultiplier);
		// Apply volume and pitch changes
		if (this.musicGain) {
			this.musicGain.amp(this.musicVolume*slowmusicmag);
		}
		if (this.music) {
			this.music.rate(this.musicPitchMultiplier);
		}
	}



	f_audiocontext_start() {
		// console.log("f_audiocontext_start");
	}

	changeScale(scaleName, rootNote = 0) {
		if (this.scales[scaleName]) {
			this.currentScale = this.scales[scaleName];
			this.rootNote = rootNote;
			// console.log(`Scale changed to ${scaleName} with root note ${rootNote}`);
		} else {
			console.error('Invalid scale name:', scaleName);
		}
	}

	snapToScale(midiNote) {
		// console.log("midiNote:", midiNote);
		let octave = Math.floor(midiNote / 12);
		let noteInOctave = midiNote % 12;
		let scaleNotes = this.currentScale.map(note => (note + this.rootNote) % 12);
		
		let closestScaleNote = scaleNotes.reduce((prev, curr) => 
			Math.abs(curr - noteInOctave) < Math.abs(prev - noteInOctave) ? curr : prev
		);
		
		return octave * 12 + closestScaleNote;
	}

	// Method to set background base volume (if needed)
	setBackgroundBaseVolume(volume) {
		this.backgroundBaseVolume = volume;
		this.updateBackgroundVolume(); // Update volume immediately
	}

	kutigaaitasyunkandayo() {
		// mappedNoiseを計算
		this.mappedNoise = map(this.noiseValue, 0, 1, -1, 1);

		// console.log("kutiga aita yo Ahhhhhh");
		this.targetBackgroundVolume = 0;
		this.targetMusicVolume = this.maxMusicVolume;
		this.musicVolumeLerpFactor = 0.032;

		// console.log("pitchNoiseMultiplier:", this.pitchNoiseMultiplier);
		// console.log("mappedNoise:", this.mappedNoise);
		// console.log("baseMidiNote:", this.baseMidiNote);
		// ピッチの更新
		let currentMidiNote = this.baseMidiNote + this.pitchNoiseMultiplier * this.mappedNoise;
		
		// console.log("currentMidiNote:", currentMidiNote);
		let scaleNote = this.snapToScale(currentMidiNote);
		this.targetPitch = midiToFreq(scaleNote);

		// ... 他の必要な処理 ...
	}
	megatojitasyunkandayo() {
		// console.log("mega tojita yo");
		this.targetBackgroundVolume = 1
		
		this.targetMusicVolume = 0
		this.musicVolumeLerpFactor = 0.12

		this.mappedNoise = map(this.noiseValue, 0, 1, -1, 1);
			//spd ...
	}

	megaaitasyunkandayo() {
		// console.log("mega aita yo pati!");
		this.targetBackgroundVolume = 0
		this.targetMusicVolume = this.maxMusicVolume
		this.musicVolumeLerpFactor = 0.032

	}



	// setTargetMasterFilterCutoff(frequency) {
	// 	this.targetCutoff = frequency;
	// }

	// updateMasterFilterCutoff() {
	// 	this.currentCutoff = lerp(this.currentCutoff, this.targetCutoff, this.cutoffSmoothingFactor);
	// 	this.masterFilt.freq(this.currentCutoff);
	// }
}

























