let audioCtx = null;

export function playTickSound(vol = 1.0) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // A sharp, loud click sound
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {
    console.error("Audio error", e);
  }
}

export function playWinSound(vol = 1.0) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.setValueAtTime(554.37, audioCtx.currentTime + 0.1); 
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.2); 
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.3); 

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.0);
  } catch (e) {
    console.error("Audio error", e);
  }
}
