/* Browser-generated SFX — no audio files */
const FakeOutAudio = (() => {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type = "sine", gain = 0.08, delay = 0) {
    if (muted) return;
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  function noiseBurst(dur = 0.12, gain = 0.05) {
    if (muted) return;
    const c = ensure();
    if (!c) return;
    const n = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const data = n.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    const g = c.createGain();
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1200;
    src.buffer = n;
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    src.connect(f);
    f.connect(g);
    g.connect(c.destination);
    src.start();
  }

  return {
    unlock() {
      ensure();
    },
    isMuted() {
      return muted;
    },
    setMuted(v) {
      muted = !!v;
      try {
        localStorage.setItem("fakeout_muted", muted ? "1" : "0");
      } catch (_) {}
    },
    loadMutePref() {
      try {
        muted = localStorage.getItem("fakeout_muted") === "1";
      } catch (_) {}
      return muted;
    },
    click() {
      tone(660, 0.06, "triangle", 0.05);
    },
    correct() {
      tone(523, 0.09, "sine", 0.07);
      tone(784, 0.14, "sine", 0.06, 0.07);
    },
    wrong() {
      tone(180, 0.22, "sawtooth", 0.06);
      tone(140, 0.28, "square", 0.035, 0.05);
    },
    combo(streak) {
      const base = 440 + Math.min(streak, 8) * 55;
      tone(base, 0.1, "triangle", 0.06);
      tone(base * 1.25, 0.14, "sine", 0.05, 0.06);
      tone(base * 1.5, 0.16, "sine", 0.04, 0.1);
    },
    tick() {
      tone(880, 0.04, "square", 0.035);
    },
    powerup() {
      noiseBurst(0.1, 0.04);
      tone(320, 0.08, "sine", 0.05);
      tone(640, 0.12, "sine", 0.05, 0.05);
      tone(960, 0.16, "triangle", 0.04, 0.1);
    },
    levelUp() {
      [392, 523, 659, 784].forEach((f, i) => tone(f, 0.14, "triangle", 0.055, i * 0.08));
    },
    gameOver() {
      [392, 349, 311, 262].forEach((f, i) => tone(f, 0.2, "sawtooth", 0.045, i * 0.12));
    },
    victory() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.16, "sine", 0.06, i * 0.1));
      tone(1318, 0.28, "triangle", 0.045, 0.42);
    },
  };
})();
