import { create } from 'zustand';
import {
  getHistory,
  addToHistory,
  clearHistory,
  getSavedRequests,
  saveRequest,
  updateSavedRequest,
  deleteSavedRequest,
} from '../utils/storage';

const useStore = create((set, get) => ({
  // Request state
  method: 'GET',
  url: '',
  headers: [{ key: '', value: '', id: 1 }],
  body: '',

  // Response state
  response: null,
  loading: false,
  error: null,
  responseTime: null,

  // History & saved
  history: getHistory(),
  saved: getSavedRequests(),

  // Theme
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,

  // UI
  sidebarOpen: false,

  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMethod: (method) => set({ method }),
  setUrl: (url) => set({ url }),
  setHeaders: (headers) => set({ headers }),
  setBody: (body) => set({ body }),

  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  loadRequest: (req) =>
    set({
      method: req.method,
      url: req.url,
      headers: req.headers?.length ? req.headers : [{ key: '', value: '', id: Date.now() }],
      body: req.body || '',
    }),

  sendRequest: async () => {
    const { method, url, headers, body } = get();

    if (!url.trim()) {
      set({ error: 'Please enter a URL', response: null, responseTime: null });
      return;
    }

    // Validate JSON body for methods that use it
    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      try {
        JSON.parse(body);
      } catch {
        set({ error: 'Invalid JSON body', response: null, responseTime: null });
        return;
      }
    }

    set({ loading: true, error: null, response: null, responseTime: null });

    const headerObj = {};
    headers.forEach(({ key, value }) => {
      if (key.trim()) headerObj[key.trim()] = value;
    });

    const options = { method, headers: headerObj };
    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      options.body = body;
      if (!headerObj['Content-Type']) {
        options.headers['Content-Type'] = 'application/json';
      }
    }

    const start = performance.now();

    try {
      const res = await fetch(url, options);
      const elapsed = Math.round(performance.now() - start);

      let data;
      let isJson = false;
      const contentType = res.headers.get('content-type') || '';

      try {
        const text = await res.text();
        if (contentType.includes('json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
          try {
            data = JSON.parse(text);
            isJson = true;
          } catch {
            data = text;
          }
        } else {
          data = text;
        }
      } catch {
        data = 'Unable to read response body';
      }

      const responseHeaders = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      set({
        loading: false,
        responseTime: elapsed,
        response: {
          status: res.status,
          statusText: res.statusText,
          headers: responseHeaders,
          data,
          isJson,
        },
      });

      // Add to history
      const updated = addToHistory({ method, url, headers, body });
      set({ history: updated });
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      set({
        loading: false,
        responseTime: elapsed,
        error: err.message || 'Network error',
      });
    }
  },

  clearHistory: () => {
    const updated = clearHistory();
    set({ history: updated });
  },

  saveCurrentRequest: (name) => {
    const { method, url, headers, body } = get();
    const updated = saveRequest(name, { method, url, headers, body });
    set({ saved: updated });
  },

  updateSaved: (id, name) => {
    const { method, url, headers, body } = get();
    const updated = updateSavedRequest(id, name, { method, url, headers, body });
    set({ saved: updated });
  },

  deleteSaved: (id) => {
    const updated = deleteSavedRequest(id);
    set({ saved: updated });
  },
}));

export default useStore;
