import { useState, useCallback, useRef, useEffect } from 'react';
import useStore from '../store/useStore';

export default function BodyEditor() {
  const body = useStore((s) => s.body);
  const method = useStore((s) => s.method);
  const setBody = useStore((s) => s.setBody);
  const [jsonError, setJsonError] = useState(null);
  const debounceRef = useRef(null);

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

  const validate = useCallback((value) => {
    if (!value.trim()) {
      setJsonError(null);
      return;
    }
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  }, []);

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setBody(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => validate(value), 300);
    },
    [setBody, validate]
  );

  const handleFormat = useCallback(() => {
    if (!body.trim()) return;
    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch {
      // already invalid, validation shows the error
    }
  }, [body, setBody]);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  if (!hasBody) {
    return (
      <div className="text-xs text-zinc-400 dark:text-zinc-500 italic py-3">
        Body is not available for {method} requests
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Body <span className="text-zinc-400 dark:text-zinc-500 font-normal normal-case">(JSON)</span>
        </label>
        <button
          onClick={handleFormat}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          Format
        </button>
      </div>
      <textarea
        value={body}
        onChange={handleChange}
        placeholder='{"key": "value"}'
        rows={8}
        spellCheck={false}
        className={`w-full px-3 py-2 text-sm font-mono rounded-md border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-shadow resize-y ${
          jsonError
            ? 'border-red-400 dark:border-red-500 focus:ring-red-500/40'
            : 'border-zinc-300 dark:border-zinc-600 focus:ring-blue-500/40'
        }`}
      />
      {jsonError && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-start gap-1">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 mt-0.5">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
          </svg>
          {jsonError}
        </p>
      )}
    </div>
  );
}
