const DEFAULT_SETTINGS = {
  threshold: 20000,
  compressionMode: 'DEFLATE',
  enabled: true,
};

const METRICS_STORAGE_KEY = 'promptzipLastCompression';

const thresholdInput = document.getElementById('threshold');
const compressionModeSelect = document.getElementById('compressionMode');
const enabledCheckbox = document.getElementById('enabled');
const statusElement = document.getElementById('status');
const metricsValueElement = document.getElementById('metricsValue');

let hideStatusTimer = null;

function normalizeThreshold(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_SETTINGS.threshold;
}

function normalizeCompressionMode(value) {
  return value === 'STORE' || value === 'DEFLATE' ? value : DEFAULT_SETTINGS.compressionMode;
}

function formatKB(bytes) {
  const kb = bytes / 1024;
  return `${Math.max(0, Math.round(kb))} KB`;
}

function renderMetrics(metrics) {
  if (!metrics || !Number.isFinite(metrics.originalBytes) || !Number.isFinite(metrics.zipBytes)) {
    metricsValueElement.textContent = 'STATUS: READY';
    return;
  }

  const savedPercent = Number.isFinite(metrics.savedPercent)
    ? Math.max(0, Math.min(100, Math.round(metrics.savedPercent)))
    : 0;

  metricsValueElement.textContent = `RAW: ${formatKB(metrics.originalBytes)} \u2192 ZIP: ${formatKB(metrics.zipBytes)} (${savedPercent}% SAVED)`;
}

function showStatus(message) {
  if (hideStatusTimer) {
    window.clearTimeout(hideStatusTimer);
  }

  statusElement.textContent = `\u2714 ${message}`;
  statusElement.classList.add('visible');

  hideStatusTimer = window.setTimeout(() => {
    statusElement.classList.remove('visible');
  }, 1500);
}

function loadForm() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    thresholdInput.value = normalizeThreshold(stored.threshold);
    compressionModeSelect.value = normalizeCompressionMode(stored.compressionMode);
    enabledCheckbox.checked = Boolean(stored.enabled);
  });

  chrome.storage.local.get(METRICS_STORAGE_KEY, (stored) => {
    renderMetrics(stored[METRICS_STORAGE_KEY]);
  });
}

function saveSettings() {
  const nextSettings = {
    threshold: normalizeThreshold(thresholdInput.value),
    compressionMode: normalizeCompressionMode(compressionModeSelect.value),
    enabled: enabledCheckbox.checked,
  };

  thresholdInput.value = String(nextSettings.threshold);

  chrome.storage.sync.set(nextSettings, () => {
    showStatus('Settings saved');
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (!message || message.type !== 'PROMPTZIP_COMPRESSION_METRICS') {
    return;
  }

  renderMetrics(message.payload);
});

thresholdInput.addEventListener('change', saveSettings);
compressionModeSelect.addEventListener('change', saveSettings);
enabledCheckbox.addEventListener('change', saveSettings);

document.addEventListener('DOMContentLoaded', loadForm);
