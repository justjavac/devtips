const STORAGE_KEY = 'theme';

export function initTheme() {
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-theme-toggle]');
    if (!button) return;
    const dark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {}
  });

  media.addEventListener('change', (event) => {
    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {}
    if (stored) return;
    document.documentElement.classList.toggle('dark', event.matches);
  });
}
