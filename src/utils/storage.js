const HISTORY_KEY = 'curlify_history';
const SAVED_KEY = 'curlify_saved';
const MAX_HISTORY = 50;

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

export function addToHistory(request) {
  const history = getHistory();
  // Remove duplicate if same method + URL already exists
  const filtered = history.filter(
    (h) => !(h.method === request.method && h.url === request.url)
  );
  const entry = {
    id: Date.now(),
    method: request.method,
    url: request.url,
    headers: request.headers,
    body: request.body,
    timestamp: new Date().toISOString(),
  };
  const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  return [];
}

export function getSavedRequests() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveRequest(name, request) {
  const saved = getSavedRequests();
  const entry = {
    id: Date.now(),
    name,
    method: request.method,
    url: request.url,
    headers: request.headers,
    body: request.body,
  };
  const updated = [entry, ...saved];
  localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
  return updated;
}

export function updateSavedRequest(id, name, request) {
  const saved = getSavedRequests();
  const updated = saved.map((item) =>
    item.id === id
      ? { ...item, name, method: request.method, url: request.url, headers: request.headers, body: request.body }
      : item
  );
  localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteSavedRequest(id) {
  const saved = getSavedRequests();
  const updated = saved.filter((item) => item.id !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
  return updated;
}
