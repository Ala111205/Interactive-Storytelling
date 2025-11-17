// Central engine: renders story, handles state, inventory, save/load, audio, transitions.

const bgm = document.getElementById('bgm');
const sfxSelect = document.getElementById('sfx-select');
const sfxPick = document.getElementById('sfx-pick');

const els = {
  sceneText: document.getElementById('scene-text'),
  choices: document.getElementById('choices'),
  sceneImg: document.getElementById('scene-img'),
  invCount: document.getElementById('inv-count'),
  inventoryModal: document.getElementById('inventory-modal'),
  inventoryList: document.getElementById('inventory-list'),
  btnInv: document.getElementById('btn-inv'),
  btnBack: document.getElementById('btn-back'),
  btnRestart: document.getElementById('btn-restart'),
  btnSave: document.getElementById('btn-save'),
  btnLoad: document.getElementById('btn-load'),
  btnMusic: document.getElementById('btn-music'),
  logList: document.getElementById('log-list'),
  saveModal: document.getElementById('save-modal'),
  saveSlots: document.getElementById('save-slots')
};

// default initial state
function defaultState() {
  return {
    node: 'start',
    inventory: [],
    stats: { health: 80, morale: 50, energy: 60 },
    history: [],
    drone: false,
    ally: false,
    remember: false,
    checked: false,
    ending: null
  };
}

let state = defaultState();
let imageCache = {};
let musicEnabled = true;

function resizeImage(url, maxW = 800, maxH = 700, quality = 0.8) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // allow external images

    img.onload = () => {
      let w = img.width;
      let h = img.height;

      if (w > maxW || h > maxH) {
        const scale = Math.min(maxW / w, maxH / h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      const out = canvas.toDataURL("image/jpeg", quality);
      resolve(out);
    };

    img.onerror = () => resolve(url); // fallback
    img.src = url;
  });
}

function loadSceneImage(url) {
  return new Promise(resolve => {
    if (!url) return resolve(null);

    // cached?
    if (imageCache[url]) return resolve(imageCache[url]);

    // start async load 
    resizeImage(url, 800, 700, 0.8).then(resized => {
      imageCache[url] = resized;
      resolve(resized);
    }).catch(() => {
      resolve(url);
    });
  });
}

// ---- rendering ----
function renderScene(nodeKey) {
  const node = story[nodeKey];
  if (!node) return console.error('Missing node:', nodeKey);

  // push to history for back
  if (state.node && state.node !== nodeKey) {
    state.history.push(state.node);
  }
  state.node = nodeKey;

  // image
  if (node.img) {
    // temporary low-opacity loading
    els.sceneImg.style.opacity = "0";

    loadSceneImage(node.img).then(finalURL => {
      els.sceneImg.src = finalURL;
      els.sceneImg.onload = () => {
        els.sceneImg.style.opacity = "1";
      };
    });
  }


  // text (support function or string)
  const text = typeof node.text === 'function' ? node.text(state) : node.text;
  fadeTextTo(text);

  // choices (respect cond)
  els.choices.innerHTML = '';
  if (node.end) {
    // show end message and allow restart/save
    els.choices.innerHTML = '<div class="end-note">— End of path —</div>';
    els.btnRestart.classList.remove('hidden');
  } else {
    (node.choices || []).forEach(c => {
      // conditional display
      if (typeof c.cond === 'function' && !c.cond(state)) return;
      if (typeof c.cond === 'boolean' && c.cond === false) return;
      const b = document.createElement('button');
      b.textContent = c.text;
      b.onclick = () => {
        sfxPick.play().catch(()=>{});

        // apply effect if exists on choice or next node
        if (c.effect) c.effect(state);
        // persist small changes reflected in UI
        updateUI();
        // apply next node's effect after loading (node.effect is handled in story nodes if present)
        renderScene(c.next);
      };
      els.choices.appendChild(b);
    });
  }

  // apply node.effect (post-render) if present
  if (typeof node.effect === 'function') {
    node.effect(state);
    updateUI();
  }

  // if node is end and it has effect it may set state.ending
  updateUI();
  log(`Entered: ${nodeKey}`);
  saveAutoTemp();
}

function fadeTextTo(text) {
  els.sceneText.classList.remove('fade-in');
  // slight delay for CSS reflow
  setTimeout(() => {
    els.sceneText.innerHTML = text;
    els.sceneText.classList.add('fade-in');
  }, 60);
}

// ---- UI updates ----
function updateUI() {
  els.invCount.textContent = state.inventory.length;
  updateStatBar('bar-health', state.stats.health);
  updateStatBar('bar-morale', state.stats.morale);
  updateStatBar('bar-energy', state.stats.energy);
  renderInventoryList();
}

function updateStatBar(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.width = Math.max(0, Math.min(100, value)) + '%';
}

// ---- inventory rendering ----
function renderInventoryList() {
  els.inventoryList.innerHTML = '';
  if (state.inventory.length === 0) {
    els.inventoryList.innerHTML = '<div style="color:#b9c8d6;padding:8px">Empty</div>';
    return;
  }
  state.inventory.forEach((it, idx) => {
    const el = document.createElement('div');
    el.className = 'inv-item';
    el.innerHTML = `<div class="name">${it}</div><div class="desc">A mysterious object.</div>`;
    el.onclick = () => {
      // sample use: dropping item or using it can be implemented here
      sfxPick.play().catch(()=>{});
      log(`Used: ${it}`);
      // example: if user uses BeaconCore near heart, we could auto progress (handled via cond on nodes)
    };
    els.inventoryList.appendChild(el);
  });
}

// ---- simple logging ----
function log(msg) {
  const d = document.createElement('div');
  d.textContent = `${new Date().toLocaleTimeString()}: ${msg}`;
  els.logList.prepend(d);
  // limit logs
  if (els.logList.children.length > 80) els.logList.removeChild(els.logList.lastChild);
}

// ---- audio helpers ----
// function toggleMusic() {
//   if (bgm.paused) {
//     bgm.play().catch(()=>{});
//     els.btnMusic.textContent = '✖';
//   } else {
//     bgm.pause();
//     els.btnMusic.textContent = '♪';
//   }
// }

function playSfx(path) {
  // quick inline playback
  const a = new Audio(path);
  a.volume = 0.9;
  a.play().catch(()=>{});
}

// ---- save / load ----
function saveToSlot(slot) {
  sfxPick.play().catch(()=>{});
  const key = `is_story_save_${slot}`;
  localStorage.setItem(key, JSON.stringify(state));
  renderSaveSlots();
  log(`Saved to slot ${slot}`);
}

function loadFromSlot(slot) {
  sfxPick.play().catch(()=>{});
  const key = `is_story_save_${slot}`;
  const data = localStorage.getItem(key);
  if (!data) { alert('Empty slot'); return; }
  try {
    state = JSON.parse(data);
    // ensure history exists
    state.history = state.history || [];
    renderScene(state.node || 'start');
    updateUI();
    log(`Loaded slot ${slot}`);
    closeSaveModal();
  } catch (e) {
    alert('Corrupt save');
  }
}

function renderSaveSlots() {
  const container = els.saveSlots;
  container.innerHTML = '';
  for (let i = 1; i <= 3; i++) {
    const key = `is_story_save_${i}`;
    const data = localStorage.getItem(key);
    const btnSave = document.createElement('button');
    btnSave.textContent = `Save to slot ${i}`;
    btnSave.onclick = () => saveToSlot(i);
    const btnLoad = document.createElement('button');
    btnLoad.textContent = `Load slot ${i}`;
    btnLoad.onclick = () => loadFromSlot(i);
    const line = document.createElement('div');
    line.style.display = 'flex';
    line.style.gap = '8px';
    line.style.marginBottom = '8px';
    line.appendChild(btnSave);
    line.appendChild(btnLoad);
    if (data) {
      const meta = document.createElement('div');
      meta.style.color = '#a8c2cf';
      meta.style.marginLeft = '8px';
      try {
        const parsed = JSON.parse(data);
        meta.textContent = `${parsed.node} — H:${parsed.stats.health} M:${parsed.stats.morale}`;
      } catch (e) {
        meta.textContent = 'Saved data';
      }
      line.appendChild(meta);
    }
    container.appendChild(line);
  }
}

// ---- UI event wiring ----
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("show-game");

  // --- Inventory Open ---
  els.btnInv.addEventListener("click", () => {
    sfxPick.play().catch(()=>{});
    els.inventoryModal.classList.toggle("hidden");
  });

  // --- Inventory Close ---
  document.getElementById("close-inv").addEventListener("click", () => {
    sfxPick.play().catch(()=>{});
    els.inventoryModal.classList.add("hidden");
  });

  // --- Back Button ---
  els.btnBack.addEventListener("click", () => {
    sfxPick.play().catch(()=>{});
    if (state.history.length === 0) return;

    const prev = state.history.pop();
    renderScene(prev);
    updateUI();
    log("Back");
  });

  // --- Restart Button ---
  els.btnRestart.addEventListener("click", () => {
    sfxPick.play().catch(()=>{});

    if (!confirm("Restart? This clears current run (you can always save).")) return;

    state = defaultState();

    // stop intro sfx
    sfxSelect.pause();
    sfxSelect.currentTime = 0;

    // FORCE startup audio
    playStartupAudio(true);

    renderScene("start");
    updateUI();
    log("Restarted story");
  });

  // --- Save Button ---
  els.btnSave.addEventListener("click", () => {
    sfxPick.play().catch(()=>{});
    els.saveModal.classList.toggle("hidden");
    renderSaveSlots();
  });

  // --- Save Modal Close ---
  document.getElementById("close-save").addEventListener("click", closeSaveModal);

  // --- Load Button ---
  els.btnLoad.addEventListener("click", () => {
    sfxPick.play().catch(()=>{});
    els.saveModal.classList.toggle("hidden");
    renderSaveSlots();
  });

  // --- Music Toggle Button ---
  els.btnMusic.addEventListener("click", () => {
    // block clicks ONLY if intro SFX still playing
    if (!sfxSelect.paused) return;

    sfxPick.play().catch(()=>{});

    musicEnabled = !musicEnabled;

    if (musicEnabled) {
      bgm.play().catch(()=>{});
    } else {
      // stop all sounds
      sfxSelect.pause();
      sfxSelect.currentTime = 0;
      bgm.pause();
      bgm.currentTime = 0;
    }

    syncMusicButton();
  });

});

function syncMusicButton() {
  els.btnMusic.textContent = musicEnabled ? "✖" : "♪";
}

function playStartupAudio(force = false) {
  if (force) {
    musicEnabled = true;  // FIX THE DESYNC RESART
  }

  const allowMusic = force || musicEnabled;

  if (!allowMusic) return;

  bgm.pause();
  bgm.currentTime = 0;

  sfxSelect.pause();
  sfxSelect.currentTime = 0;

  sfxSelect.play().catch(()=>{});

  sfxSelect.onended = () => {
    if(allowMusic) {
      els.btnMusic.disabled = false;
      syncMusicButton();
      bgm.play().catch(()=>{})
    }
  };
}

function unlockAudioAndStartGame() {

  playStartupAudio();

  // Remove overlay immediately (game starts)
  const overlay = document.getElementById("tap-start");
  if (overlay) overlay.remove();
  document.getElementById("game").style.display = "block";

  // Now you can run your UI + scene initialization
  updateUI();
  renderScene("start");
}

// Attach ONE listener for first user gesture
window.addEventListener("pointerdown", function handleFirstInput() {
  unlockAudioAndStartGame();
  window.removeEventListener("pointerdown", handleFirstInput);
});

function closeSaveModal() {
  sfxPick.play().catch(()=>{});
  els.saveModal.classList.add('hidden');
}

// autosave temp slot so user doesn't lose progress mid-run
function saveAutoTemp() {
  // sfxPick.play().catch(()=>{});
  localStorage.setItem('is_story_autosave', JSON.stringify(state));
}

// allow quick resume if autosave exists
(function quickResume() {
  const data = localStorage.getItem('is_story_autosave');
  if (!data) return;
  try {
    const parsed = JSON.parse(data);
    // if it's meaningful, offer resume
    if (parsed && parsed.node && parsed.node !== 'start') {
      // create small banner choice in topbar
      const top = document.querySelector('.topbar .controls');
      const resumeBtn = document.createElement('button');
      resumeBtn.textContent = 'Resume';
      resumeBtn.onclick = () => {
        state = parsed;
        renderScene(state.node);
        updateUI();
        resumeBtn.remove();
        log('Resumed autosave');
      };
      top.prepend(resumeBtn);
    }
  } catch (e) { /* ignore */ }
})();