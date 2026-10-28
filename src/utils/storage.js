// Small wrappers around localStorage. It can throw (private mode, blocked
// storage), so a failure just means the app starts with the defaults.
export function loadSetting(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // nothing to do: the setting just won't be remembered
  }
}
