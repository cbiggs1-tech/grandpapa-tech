// Modem dial-up sound effect for Play buttons
// Generates a retro modem handshake sound using Web Audio API

function playModemSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 1.5;
    const now = audioCtx.currentTime;

    // Master gain
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.15, now);
    masterGain.connect(audioCtx.destination);

    // Initial dial tone (dual tone)
    const dialOsc1 = audioCtx.createOscillator();
    const dialOsc2 = audioCtx.createOscillator();
    const dialGain = audioCtx.createGain();

    dialOsc1.frequency.setValueAtTime(350, now);
    dialOsc2.frequency.setValueAtTime(440, now);
    dialOsc1.type = 'sine';
    dialOsc2.type = 'sine';

    dialGain.gain.setValueAtTime(0.3, now);
    dialGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    dialOsc1.connect(dialGain);
    dialOsc2.connect(dialGain);
    dialGain.connect(masterGain);

    dialOsc1.start(now);
    dialOsc2.start(now);
    dialOsc1.stop(now + 0.2);
    dialOsc2.stop(now + 0.2);

    // Modem handshake screech
    const modemOsc = audioCtx.createOscillator();
    const modemGain = audioCtx.createGain();

    modemOsc.type = 'sawtooth';
    modemOsc.frequency.setValueAtTime(1000, now + 0.2);
    modemOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.4);
    modemOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);
    modemOsc.frequency.exponentialRampToValueAtTime(2100, now + 0.8);
    modemOsc.frequency.setValueAtTime(2100, now + 0.8);
    modemOsc.frequency.exponentialRampToValueAtTime(1800, now + 1.0);

    modemGain.gain.setValueAtTime(0, now + 0.2);
    modemGain.gain.linearRampToValueAtTime(0.4, now + 0.25);
    modemGain.gain.setValueAtTime(0.4, now + 0.9);
    modemGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    modemOsc.connect(modemGain);
    modemGain.connect(masterGain);

    modemOsc.start(now + 0.2);
    modemOsc.stop(now + 1.2);

    // Digital data burst (white noise modulated)
    const bufferSize = audioCtx.sampleRate * 0.5;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        // Create stepped noise to sound more digital
        if (i % 50 === 0) {
            output[i] = Math.random() * 2 - 1;
        } else {
            output[i] = output[i - (i % 50)] * 0.8;
        }
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0, now + 1.0);
    noiseGain.gain.linearRampToValueAtTime(0.2, now + 1.05);
    noiseGain.gain.setValueAtTime(0.2, now + 1.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    // Bandpass filter for digital sound
    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1800, now);
    bandpass.Q.setValueAtTime(5, now);

    noiseSource.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(masterGain);

    noiseSource.start(now + 1.0);
    noiseSource.stop(now + 1.5);

    return duration;
}

// Attach to all play buttons
document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.btn-play');

    playButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            // Play modem sound
            const duration = playModemSound();

            // Add connecting text effect
            const originalText = this.textContent;
            this.textContent = '>>> CONNECTING... <<<';
            this.style.pointerEvents = 'none';

            // Navigate after sound
            setTimeout(function() {
                window.location.href = href;
            }, duration * 1000);
        });
    });
});
