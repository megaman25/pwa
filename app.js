// Basic app initialization
document.addEventListener('DOMContentLoaded', () => {
const installBtn = document.getElementById('installBtn');
let deferredPrompt = null;

// Utility: detect installed/standalone mode
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

// Start hidden by default in HTML; keep hidden if already standalone
if (isStandalone()) installBtn.hidden = true;

// Listen for beforeinstallprompt and show install button
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();         // Prevent automatic mini-infobar
  deferredPrompt = e;
  installBtn.hidden = false;  // Reveal install button
});

// Click handler to show install prompt
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if (choice.outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }
  deferredPrompt = null;
  installBtn.hidden = true;
});

// Optional: listen for appinstalled event
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  installBtn.hidden = true;
});

// Example app behavior: simple state and UI update
const statusEl = document.createElement('div');
statusEl.id = 'status';
statusEl.textContent = isStandalone() ? 'Running as installed app' : 'Running in browser';
document.body.appendChild(statusEl);

// Update status when display-mode changes (e.g., after install)
window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
  statusEl.textContent = e.matches ? 'Running as installed app' : 'Running in browser';
  if (e.matches) installBtn.hidden = true;
});
});
