// Popup script
async function initializePopup() {
  // Load stats
  const stats = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
  if (stats) {
    document.getElementById('totalTags')!.textContent = stats.totalTags.toLocaleString();
    document.getElementById('uniqueAddresses')!.textContent = stats.uniqueAddresses.toLocaleString();
    document.getElementById('sourceCount')!.textContent = Object.keys(stats.sourceBreakdown).length.toString();
  }

  // Load settings
  const settings = await chrome.runtime.sendMessage({ type: 'GET_SETTINGS' });
  const enabledToggle = document.getElementById('enabledToggle') as HTMLInputElement;
  enabledToggle.checked = settings?.enabled ?? true;

  // Toggle handler
  enabledToggle.addEventListener('change', async () => {
    await chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      settings: { enabled: enabledToggle.checked },
    });
  });

  // Refresh button
  document.getElementById('refreshBtn')!.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.reload(tab.id);
    }
    window.close();
  });
}

initializePopup();
