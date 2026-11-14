/**
 * tones.js
 * Plays two-tone sequential paging audio using the Web Audio API.
 */

let activeAudioCtx = null;

export function playTonePair(freqA, durA, freqB, durB) {
  if (activeAudioCtx) {
    activeAudioCtx.close();
  }

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  activeAudioCtx = new AudioCtx();

  const fA = parseFloat(freqA);
  const dA = parseFloat(durA);
  const fB = parseFloat(freqB);
  const dB = parseFloat(durB);

  const now = activeAudioCtx.currentTime;

  // Tone A
  const oscA = activeAudioCtx.createOscillator();
  const gainA = activeAudioCtx.createGain();
  oscA.type = 'sine';
  oscA.frequency.value = fA;
  oscA.connect(gainA);
  gainA.connect(activeAudioCtx.destination);

  oscA.start(now);
  oscA.stop(now + dA);

  // Tone B
  const oscB = activeAudioCtx.createOscillator();
  const gainB = activeAudioCtx.createGain();
  oscB.type = 'sine';
  oscB.frequency.value = fB;
  oscB.connect(gainB);
  gainB.connect(activeAudioCtx.destination);

  oscB.start(now + dA);
  oscB.stop(now + dA + dB);
}

export function stopAudio() {
  if (activeAudioCtx) {
    activeAudioCtx.close();
    activeAudioCtx = null;
  }
}