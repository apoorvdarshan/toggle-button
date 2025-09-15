// Theme initialization: respect saved preference or system
const bigToggle = document.getElementById('big-toggle');
const miniToggle = document.getElementById('mini-toggle');

const applyTheme = (theme) => {
  const dark = theme === 'dark';
  document.body.classList.toggle('theme-dark', dark);
  // keep both controls in sync
  if (bigToggle) bigToggle.checked = dark;
  if (miniToggle) miniToggle.checked = dark;
  document.title = `Big Toggle — ${dark ? 'Dark' : 'Light'}`;
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
};

// Determine initial theme
(() => {
  let preferred = 'light';
  try { preferred = localStorage.getItem('theme') || preferred; } catch {}
  if (!preferred) preferred = 'light';
  if (preferred === 'light' || preferred === 'dark') {
    applyTheme(preferred);
  } else {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(mql.matches ? 'dark' : 'light');
  }
})();

// Toggle handlers
[bigToggle, miniToggle].filter(Boolean).forEach(cb => {
  cb.addEventListener('change', () => applyTheme(cb.checked ? 'dark' : 'light'));
});
