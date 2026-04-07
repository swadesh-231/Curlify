import { useCallback } from 'react';
import useStore from '../store/useStore';
import HeadersEditor from './HeadersEditor';
import BodyEditor from './BodyEditor';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const METHOD_COLORS = {
  GET: 'text-green-600 dark:text-green-400',
  POST: 'text-blue-600 dark:text-blue-400',
  PUT: 'text-amber-600 dark:text-amber-400',
  PATCH: 'text-purple-600 dark:text-purple-400',
  DELETE: 'text-red-600 dark:text-red-400',
};

export default function RequestBuilder() {
  const method = useStore((s) => s.method);
  const url = useStore((s) => s.url);
  const loading = useStore((s) => s.loading);
  const setMethod = useStore((s) => s.setMethod);
  const setUrl = useStore((s) => s.setUrl);
  const sendRequest = useStore((s) => s.sendRequest);

  const handleSend = useCallback(() => {
    sendRequest();
  }, [sendRequest]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        sendRequest();
      }
    },
    [sendRequest]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-700/50">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Request</h2>

        {/* Method + URL + Send */}
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`px-3 py-2 text-sm font-bold rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer transition-shadow ${METHOD_COLORS[method]}`}
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://api.example.com/endpoint"
            className="flex-1 px-4 py-2 text-sm font-mono rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-shadow"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending
              </>
            ) : (
              <>
                Send
                <kbd className="text-[10px] opacity-60 font-mono">^↵</kbd>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Headers + Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        <HeadersEditor />
        <BodyEditor />
      </div>
    </div>
  );
}
