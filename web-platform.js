(() => {
  'use strict';

  const installBtn = document.getElementById('installWebAppBtn');
  const connection = document.getElementById('webConnectionStatus');
  let deferredInstallPrompt = null;

  function updateConnection() {
    if (!connection) return;
    const online = navigator.onLine;
    connection.textContent = online ? 'Online · local records only' : 'Offline · local records available';
    connection.classList.toggle('good', !online);
  }

  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  updateConnection();

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (installBtn) installBtn.classList.remove('hidden');
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) {
        alert('Installation is controlled by your browser. Use the browser menu and choose Install app / Add to Home Screen when available.');
        return;
      }
      deferredInstallPrompt.prompt();
      try { await deferredInstallPrompt.userChoice; } catch (_) {}
      deferredInstallPrompt = null;
      installBtn.classList.add('hidden');
    });
  }

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    if (installBtn) installBtn.classList.add('hidden');
  });

  // GitHub Pages is HTTPS, so service workers are supported there. On localhost,
  // service workers are also allowed for development/testing.
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        registration.update().catch(() => {});
      } catch (error) {
        console.warn('Offline service worker could not be registered', error);
      }
    });
  }
})();
