/**
 * audio-exporter.js
 * Encodes two-tone AudioBuffers into 16-bit PCM WAV blobs and triggers browser downloads.
 */

export function audioBufferToWav(buffer) {
  const numChannels = 1;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const samples = buffer.getChannelData(0);
  const dataLength = samples.length * 2;
  const bufferLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  /* RIFF Header */
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  /* Write 16-bit PCM samples */
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export async function generateToneWavBlob(freqA, durA, freqB, durB) {
  const sampleRate = 44100;
  const totalDuration = parseFloat(durA) + parseFloat(durB);
  const offlineCtx = new OfflineAudioContext(1, Math.ceil(sampleRate * totalDuration), sampleRate);

  const oscA = offlineCtx.createOscillator();
  oscA.type = 'sine';
  oscA.frequency.value = parseFloat(freqA);
  oscA.connect(offlineCtx.destination);
  oscA.start(0);
  oscA.stop(parseFloat(durA));

  const oscB = offlineCtx.createOscillator();
  oscB.type = 'sine';
  oscB.frequency.value = parseFloat(freqB);
  oscB.connect(offlineCtx.destination);
  oscB.start(parseFloat(durA));
  oscB.stop(totalDuration);

  const renderedBuffer = await offlineCtx.startRendering();
  return audioBufferToWav(renderedBuffer);
}

export async function downloadToneWav(freqA, durA, freqB, durB, filename = 'tone_signal.wav') {
  const blob = await generateToneWavBlob(freqA, durA, freqB, durB);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}