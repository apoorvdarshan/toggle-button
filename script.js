// Theme initialization: respect saved preference or system
const bigToggle = document.getElementById("big-toggle");

// Preload theme sounds
const sounds = {
  light: new Audio("assets/liar-light.mp3"),
  dark: new Audio("assets/i am your father-dark.mp3"),
};
Object.values(sounds).forEach((a) => {
  a.preload = "auto";
  a.crossOrigin = "anonymous";
  a.load();
});

// Unlock audio on first user gesture for mobile browsers
function unlockAudioOnce() {
  const tryUnlock = (audio) => {
    const prev = audio.volume;
    audio.volume = 0.0001;
    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = prev;
      })
      .catch(() => {
        audio.volume = prev;
      });
  };
  tryUnlock(sounds.light);
  tryUnlock(sounds.dark);
  window.removeEventListener("pointerdown", unlockAudioOnce);
}
window.addEventListener("pointerdown", unlockAudioOnce, {
  once: true,
  passive: true,
});

function stopAllSounds() {
  for (const a of Object.values(sounds)) {
    try {
      a.pause();
      a.currentTime = 0;
    } catch {}
  }
}

function playThemeSound(theme) {
  const key = theme === "dark" ? "dark" : "light";
  stopAllSounds();
  const a = sounds[key];
  if (!a) return;
  a.volume = 1.0;
  a.play().catch(() => {});
}

function updateInteractiveUI(isDark) {
  const lightPill = document.getElementById("legend-light");
  const darkPill = document.getElementById("legend-dark");
  const quoteEl = document.getElementById("sw-quote");
  if (lightPill && darkPill) {
    lightPill.classList.toggle("active", !isDark);
    darkPill.classList.toggle("active", isDark);
  }
  if (quoteEl) {
    quoteEl.textContent = isDark
      ? "I find your lack of faith disturbing. — Darth Vader"
      : "The Force will be with you. Always. — Obi‑Wan Kenobi";
  }
}

const applyTheme = (theme, { silent = false } = {}) => {
  const dark = theme === "dark";
  document.body.classList.toggle("theme-dark", dark);
  // keep control in sync
  if (bigToggle) bigToggle.checked = dark;
  document.title = `Toggle Button (Starwars theme) — ${
    dark ? "Dark" : "Light"
  }`;
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
  updateInteractiveUI(dark);
  if (!silent) playThemeSound(dark ? "dark" : "light");
};

// Determine initial theme
(() => {
  let preferred = "light";
  try {
    preferred = localStorage.getItem("theme") || preferred;
  } catch {}
  if (!preferred) preferred = "light";
  if (preferred === "light" || preferred === "dark") {
    applyTheme(preferred, { silent: true });
  } else {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    applyTheme(mql.matches ? "dark" : "light", { silent: true });
  }
})();

// Toggle handlers
if (bigToggle) {
  bigToggle.addEventListener("change", () =>
    applyTheme(bigToggle.checked ? "dark" : "light")
  );
}

window.requestAnimationFrame(() => document.body.classList.add("theme-ready"));

// Removed WiFi UI; replaced with lore panels.
