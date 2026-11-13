'use strict';
window.setupInvitationAudio = (data, getLanguage) => {
  const $ = selector => document.querySelector(selector);
  const words = {
    en: {
      music: 'Play music', stopMusic: 'Mute music', audioFailed: 'The music could not play. Please tap again, or check the music file in the invitation settings.', paused: 'Music paused while this page was in the background.'
    },
    hi: {
      music: 'संगीत चलाएँ', stopMusic: 'संगीत बंद करें', audioFailed: 'संगीत नहीं चल सका। फिर टैप करें या निमंत्रण की संगीत फ़ाइल जाँचें।', paused: 'पृष्ठ बैकग्राउंड में जाने पर संगीत रोक दिया गया।'
    }
  };
  const t = key => words[getLanguage()][key];
  let message = '';
  let musicPlaying = false, musicRun = 0, musicAudio = null, musicContext = null, melodyTimer = null;
  const notesPlaying = new Set();
  function soundControls() {
    $('#music-toggle').setAttribute('aria-label', t(musicPlaying ? 'stopMusic' : 'music'));
    $('#music-toggle').setAttribute('aria-pressed', String(musicPlaying));
    $('#audio-status').textContent = message ? t(message) : '';
  }
  function stopMusic() {
    musicRun++; musicPlaying = false; clearInterval(melodyTimer); melodyTimer = null;
    if (musicAudio) { musicAudio.pause(); musicAudio.removeAttribute('src'); musicAudio.load(); musicAudio = null; }
    for (const oscillator of notesPlaying) oscillator.stop(); notesPlaying.clear();
    musicContext?.suspend().catch(() => {}); soundControls();
  }
  async function startMusic() {
    stopMusic(); message = ''; musicPlaying = true; const run = ++musicRun; soundControls();
    try {
      if (data.audio.music) {
        const audio = new Audio(window.Invite.audioUrl(data.audio.music)); musicAudio = audio; audio.loop = true; audio.volume = .15;
        audio.onerror = () => { if (run === musicRun) { stopMusic(); message = 'audioFailed'; soundControls(); } };
        await audio.play(); return;
      }
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) throw new Error('Web Audio unavailable');
      musicContext ||= new Context(); await musicContext.resume();
      if (run !== musicRun) return;
      const notes = [293.66, 369.99, 440, 587.33, 493.88, 369.99, 440, 587.33, 329.63, 392, 493.88, 659.25, 369.99, 440, 554.37, 587.33];
      let index = 0;
      const play = () => {
        if (!musicPlaying) return;
        const oscillator = musicContext.createOscillator(), gain = musicContext.createGain(), now = musicContext.currentTime;
        oscillator.type = 'sine'; oscillator.frequency.value = notes[index++ % notes.length];
        gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.035, now + .08); gain.gain.exponentialRampToValueAtTime(.0001, now + 1.6);
        oscillator.connect(gain); gain.connect(musicContext.destination); notesPlaying.add(oscillator);
        oscillator.onended = () => { notesPlaying.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
        oscillator.start(); oscillator.stop(now + 1.65);
      };
      play(); melodyTimer = setInterval(play, 650);
    } catch { if (run === musicRun) { stopMusic(); message = 'audioFailed'; soundControls(); } }
  }
  function refresh() { soundControls(); }
  $('#music-toggle').addEventListener('click', () => musicPlaying ? stopMusic() : startMusic());
  document.addEventListener('visibilitychange', () => { if (document.hidden && musicPlaying) { stopMusic(); message = 'paused'; soundControls(); } });
  window.addEventListener('pagehide', stopMusic);
  $('#audio-controls').hidden = false;
  refresh();
  return { refresh };
};
