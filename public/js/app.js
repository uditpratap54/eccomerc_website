(() => {
  function addOverlay() {
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = '<div class="spinner"></div><p>Loading…</p>';
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
  }

  function removeOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  window.addEventListener('pageshow', removeOverlay);

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach((form) => {
      form.addEventListener('submit', () => {
        addOverlay();
      });
    });

    // Toast notifications from server-side flash
    try {
      const flash = window.__FLASH__ || null;
      if (flash && flash.message) {
        const toast = document.createElement('div');
        toast.className = `toast ${flash.type || 'info'}`;
        toast.innerText = flash.message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
          toast.classList.add('show');
        });
        setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 300);
        }, 3000);
      }
    } catch (e) {
      console.warn('Toast render failed:', e.message);
    }

    // Dynamic city map on searchResults page
    const citySelect = document.querySelector('form[action="/search"] select[name="city"]');
    const iframe = document.getElementById('cityMapIframe');
    const openLink = document.getElementById('cityMapOpen');
    if (citySelect && iframe && openLink) {
      const updateMap = () => {
        const val = (citySelect.value || '').trim();
        const q = encodeURIComponent(val || 'India');
        iframe.src = `https://www.google.com/maps?q=${q}&output=embed`;
        openLink.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
      };
      citySelect.addEventListener('change', updateMap);
    }
  });
})();