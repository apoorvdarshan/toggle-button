// Theme initialization: respect saved preference or system
const checkbox = document.getElementById('big-toggle');

const applyTheme = (theme) => {
  const dark = theme === 'dark';
  document.body.classList.toggle('theme-dark', dark);
  checkbox.checked = dark; // keep UI in sync
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

// Toggle handler
checkbox.addEventListener('change', () => {
  applyTheme(checkbox.checked ? 'dark' : 'light');
});

