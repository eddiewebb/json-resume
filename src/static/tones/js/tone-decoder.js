/**
 * tone-decoder.js 0.0.2
 * Pitch detection (YIN Algorithm) & state machine for sequential two-tone audio parsing.
 */

export class TwoToneDecoder {
  constructor(options = {}) {
    this.sampleRate = options.sampleRate || 44100;
    this.noiseThreshold = options.noiseThreshold || 0.01;
    this.minFreq = options.minFreq || 250;
    this.maxFreq = options.maxFreq || 3500;
    this.minToneDuration = options.minToneDuration || 0.3;

    this.onToneDecoded = options.onToneDecoded || null;
    this.onStatusChange = options.onStatusChange || null;

    this.reset();
  }

  reset() {
    this.state = 'IDLE';
    this.toneAFreqs = [];
    this.toneAStartTime = 0;
    this.toneAEndTime = 0;
    this.toneBFreqs = [];
    this.toneBStartTime = 0;
    this.toneBEndTime = 0;
    this.candidateToneBFreqs = [];
    this.candidateToneBStartTime = 0;
    this.consecutiveSilenceFrames = 0;
  }

  /**
   * YIN Pitch Detection Algorithm
   * Computes Cumulative Mean Normalized Difference to prevent octave errors.
   */
  yinPitch(buffer, sampleRate) {
    const size = buffer.length;
    const halfSize = Math.floor(size / 2);

    let sumSquares = 0;
    for (let i = 0; i < size; i++) sumSquares += buffer[i] * buffer[i];
    const rms = Math.sqrt(sumSquares / size);
    if (rms < this.noiseThreshold) return -1;

    const minLag = Math.floor(sampleRate / this.maxFreq);
    const maxLag = Math.floor(sampleRate / this.minFreq);
    if (maxLag >= halfSize) return -1;

    // Step 1: Difference Function
    const d = new Float32Array(halfSize);
    for (let tau = 1; tau < halfSize; tau++) {
      let diffSum = 0;
      for (let i = 0; i < halfSize; i++) {
        const delta = buffer[i] - buffer[i + tau];
        diffSum += delta * delta;
      }
      d[tau] = diffSum;
    }

    // Step 2: Cumulative Mean Normalized Difference Function
    const dPrime = new Float32Array(halfSize);
    dPrime[0] = 1;
    let runningSum = 0;
    for (let tau = 1; tau < halfSize; tau++) {
      runningSum += d[tau];
      dPrime[tau] = d[tau] / (runningSum / tau);
    }

    // Step 3: Absolute Thresholding
    const threshold = 0.15;
    let tau = minLag;
    for (; tau <= maxLag; tau++) {
      if (dPrime[tau] < threshold) {
        while (tau + 1 <= maxLag && dPrime[tau + 1] < dPrime[tau]) {
          tau++;
        }
        break;
      }
    }

    if (tau > maxLag) {
      let minVal = Infinity;
      let bestTau = -1;
      for (let t = minLag; t <= maxLag; t++) {
        if (dPrime[t] < minVal) {
          minVal = dPrime[t];
          bestTau = t;
        }
      }
      if (bestTau === -1 || minVal > 0.4) return -1;
      tau = bestTau;
    }

    // Step 4: Parabolic Interpolation
    let betterTau = tau;
    if (tau > 1 && tau < halfSize - 1) {
      const s0 = dPrime[tau - 1];
      const s1 = dPrime[tau];
      const s2 = dPrime[tau + 1];
      const denom = s2 - 2 * s1 + s0;
      if (denom !== 0) {
        betterTau = tau + (s0 - s2) / (2 * denom);
      }
    }

    const pitch = sampleRate / betterTau;
    if (isNaN(pitch) || pitch < this.minFreq || pitch > this.maxFreq) return -1;
    return pitch;
  }

  processFrame(buffer, timestamp) {
    const pitch = this.yinPitch(buffer, this.sampleRate);
    const MAX_SILENCE_FRAMES = 6; // ~70ms buffer before declaring tone end

    if (pitch === -1) {
      this.consecutiveSilenceFrames++;
      if (this.consecutiveSilenceFrames >= MAX_SILENCE_FRAMES) {
        if (this.state === 'TONE_B') {
          this.finalizeDecode(timestamp);
        } else if (this.state === 'TONE_A') {
          this.reset();
        }
      }
      return;
    }

    this.consecutiveSilenceFrames = 0;

    if (this.state === 'IDLE') {
      this.state = 'TONE_A';
      this.toneAStartTime = timestamp;
      this.toneAFreqs = [pitch];
      if (this.onStatusChange) this.onStatusChange('Detecting Tone A...');
    } else if (this.state === 'TONE_A') {
      const avgA = this.getMedian(this.toneAFreqs);
      const freqRatio = Math.abs(pitch - avgA) / avgA;

      // Detect frequency shift from Tone A -> Tone B
      if (freqRatio > 0.04) {
        if (!this.candidateToneBFreqs.length) {
          this.candidateToneBStartTime = timestamp;
        }
        this.candidateToneBFreqs.push(pitch);

        // Confirm Tone B transition after 3 consecutive shifted frames
        if (this.candidateToneBFreqs.length >= 3) {
          const durA = this.candidateToneBStartTime - this.toneAStartTime;
          if (durA >= this.minToneDuration) {
            this.toneAEndTime = this.candidateToneBStartTime;
            this.state = 'TONE_B';
            this.toneBStartTime = this.candidateToneBStartTime;
            this.toneBFreqs = [...this.candidateToneBFreqs];
            if (this.onStatusChange) this.onStatusChange('Detecting Tone B...');
          } else {
            this.reset();
          }
        }
      } else {
        this.candidateToneBFreqs = [];
        this.toneAFreqs.push(pitch);
      }
    } else if (this.state === 'TONE_B') {
      const avgB = this.getMedian(this.toneBFreqs);
      const freqRatio = Math.abs(pitch - avgB) / avgB;

      if (freqRatio > 0.06) {
        this.finalizeDecode(timestamp);
      } else {
        this.toneBFreqs.push(pitch);
      }
    }
  }

  flush(finalTimestamp) {
    if (this.state === 'TONE_B') {
      this.finalizeDecode(finalTimestamp);
    } else {
      this.reset();
    }
  }

  finalizeDecode(timestamp) {
    this.toneBEndTime = timestamp;
    const freqA = this.getMedian(this.toneAFreqs);
    const durA = Math.max(0, this.toneAEndTime - this.toneAStartTime);
    const freqB = this.getMedian(this.toneBFreqs);
    const durB = Math.max(0, this.toneBEndTime - this.toneBStartTime);

    if (durA >= this.minToneDuration && durB >= 0.25 && freqA > 0 && freqB > 0) {
      if (this.onToneDecoded) {
        this.onToneDecoded({ freqA, durA, freqB, durB });
      }
      if (this.onStatusChange) {
        this.onStatusChange(`Decoded: ${Math.round(freqA)} Hz / ${Math.round(freqB)} Hz`);
      }
    }

    this.reset();
  }

  getMedian(arr) {
    const valid = arr.filter(f => !isNaN(f) && f > 0);
    if (!valid.length) return 0;
    const sorted = [...valid].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
}

export async function decodeAudioFile(file, onToneDecoded, onStatusChange) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0);
  const frameSize = 2048;
  const hopSize = 512;

  const decoder = new TwoToneDecoder({
    sampleRate,
    onToneDecoded,
    onStatusChange
  });

  const totalDuration = audioBuffer.duration;
  for (let i = 0; i <= channelData.length - frameSize; i += hopSize) {
    const frame = channelData.subarray(i, i + frameSize);
    const timestamp = i / sampleRate;
    decoder.processFrame(frame, timestamp);
  }

  decoder.flush(totalDuration);
  audioContext.close();
}