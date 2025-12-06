import { eventBus } from "./eventBus.js";
import { stateManager } from "./stateManager.js";

class AudioManager {
  constructor() {
    this.unlocked = false;
    this.muted = false;

    this.volumes = {
      master: 1,
      bgm: 0.7,
      sfx: 1
    };

    this.channels = {
      bgm: null,
      sfx: []
    };

    this.sounds = {
      bgm: null,
      sfxPick: null,
      sfxSelect: null
    };

    this._initDOMRefs();
    this._wireEvents();
  }

  /* -------------------- SETUP -------------------- */

  _initDOMRefs() {
    this.sounds.bgm = document.getElementById("bgm");
    this.sounds.sfxPick = document.getElementById("sfx-pick");
    this.sounds.sfxSelect = document.getElementById("sfx-select");

    Object.keys(this.sounds).forEach(name => {
      const audio = this.sounds[name];
      if (!audio) return;
      audio.volume = this._calcVolume(name);
    });
  }

  _wireEvents() {
    eventBus.on("audio:playSFX", name => this.playSFX(name));
    eventBus.on("audio:toggle", () => this.toggle());
    eventBus.on("audio:stopAll", () => this.stopAll());

    // story events
    eventBus.on("audio:refresh", () => this.playForStory());
    eventBus.on("story:change", () => this.playForStory());

    // unlock from first user gesture
    eventBus.on("audio:unlocked", () => {
      this.unlocked = true;
      this._initDOMRefs();
      this.playForStory();
    });
  }

  _getAudio(name) {
    return this.sounds[name] || document.getElementById(name) || null;
  }

  _calcVolume(name) {
    // sfxPick ALWAYS has sound
    if (this.muted && name !== "sfxPick") return 0;

    if (name === "bgm") {
      return this.volumes.master * this.volumes.bgm;
    }

    return this.volumes.master * this.volumes.sfx;
  }

  /* -------------------- STORY CONTROL -------------------- */

  playForStory() {
    if (!this.unlocked) return;

    const story = stateManager.currentStory || "A";

    // HARD STOP everything first
    this.stopAll();

    if (this.muted) return;

    if (story === "A") {
      this.playBGM();            // ✅ Only BGM loops in A
      return;
    }

    if (story === "B") {
      this.playLoopingSFX("sfxSelect");   // ✅ Only sfx-select loops in B
      return;
    }
  }

  /* -------------------- BGM -------------------- */

  playBGM() {
    if (!this.unlocked || this.muted) return;

    const bgm = this._getAudio("bgm");
    if (!bgm) return;

    if (this.channels.bgm === bgm && !bgm.paused) return;

    this.stopBGM();

    bgm.currentTime = 0;
    bgm.loop = true;
    bgm.volume = this._calcVolume("bgm");

    bgm.play().catch(() => {});
    this.channels.bgm = bgm;

    this._updateMusicButton(true);
  }

  stopBGM() {
    const bgm = this.channels.bgm;
    if (!bgm) return;

    bgm.pause();
    bgm.currentTime = 0;
    this.channels.bgm = null;

    if (this.channels.sfx.length === 0) {
      this._updateMusicButton(false);
    }
  }

  /* -------------------- SFX -------------------- */

  playSFX(name) {
    if (!this.unlocked) return;

    // sfxPick ignores mute always
    if (this.muted && name !== "sfxPick") return;

    const audio = this._getAudio(name);
    if (!audio) return;

    audio.currentTime = 0;
    audio.loop = false;                // ✅ NEVER loop here
    audio.volume = this._calcVolume(name);

    audio.play().catch(() => {});
  }

  /* -------------------- Loop -------------------- */
  playLoopingSFX(name) {
    if (!this.unlocked || this.muted) return;

    const audio = this._getAudio(name);
    if (!audio) return;

    if (this.channels.sfx.includes(audio) && !audio.paused) return;

    audio.currentTime = 0;
    audio.loop = true;
    audio.volume = this._calcVolume(name);
    audio.play().catch(() => {});

    this.channels.sfx.push(audio);
    this._updateMusicButton(true);
  }

  /* -------------------- MASTER CONTROL -------------------- */

  stopAll() {
    this.stopBGM();

    this.channels.sfx = this.channels.sfx.filter(a => {
      if (a.id === "sfx-pick") return true; // keep click sound alive
      a.pause();
      a.currentTime = 0;
      return false;
    });

    if (this.channels.sfx.length === 0) {
      this._updateMusicButton(false);
    }
  }

  setMuted(state) {
    this.muted = state;

    Object.keys(this.sounds).forEach(name => {
      const audio = this.sounds[name];
      if (!audio) return;
      audio.volume = this._calcVolume(name);
    
      const pick = this._getAudio("sfxPick");
      if (pick) {
        pick.volume = this.volumes.master;
      }
    });

    if (this.muted) {
      this.channels.bgm = null;
      this.channels.sfx = [];
    }

    this._updateMusicButton(!this.muted);
  }

  toggleMusic() {
    this.setMuted(!this.muted);

    if (!this.muted) {
      this.playForStory();
    }
  }

  /* -------------------- UI -------------------- */

  _updateMusicButton(state) {
    const btn = document.getElementById("btn-music");
    if (!btn) return;

    btn.classList.toggle("on", state);
    btn.classList.toggle("off", !state);
    btn.textContent = state ? "✖" : "♪";
  }
}

export const audioManager = new AudioManager();