import { memo, useCallback } from 'react';
import useStore from '../store/useStore';

const HeaderRow = memo(function HeaderRow({ header, index, onChange, onRemove, canRemove }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1 flex flex-col sm:flex-row gap-1.5 sm:gap-2 min-w-0">
        <input
          type="text"
          placeholder="Key"
          value={header.key}
          onChange={(e) => onChange(index, 'key', e.target.value)}
          className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-shadow"
        />
        <input
          type="text"
          placeholder="Value"
          value={header.value}
          onChange={(e) => onChange(index, 'value', e.target.value)}
          className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-shadow"
        />
      </div>
      <button
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="p-1.5 mt-0.5 text-zinc-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
        title="Remove header"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="4" x2="12" y2="12" />
          <line x1="12" y1="4" x2="4" y2="12" />
        </svg>
      </button>
    </div>
  );
});

export default function HeadersEditor() {
  const headers = useStore((s) => s.headers);
  const setHeaders = useStore((s) => s.setHeaders);

  const handleChange = useCallback(
    (index, field, value) => {
      const updated = headers.map((h, i) => (i === index ? { ...h, [field]: value } : h));
      setHeaders(updated);
    },
    [headers, setHeaders]
  );

  const handleRemove = useCallback(
    (index) => {
      if (headers.length <= 1) return;
      setHeaders(headers.filter((_, i) => i !== index));
    },
    [headers, setHeaders]
  );

  const handleAdd = useCallback(() => {
    setHeaders([...headers, { key: '', value: '', id: Date.now() }]);
  }, [headers, setHeaders]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Headers
        </label>
        <button
          onClick={handleAdd}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          + Add Header
        </button>
      </div>
      <div className="space-y-1.5">
        {headers.map((header, index) => (
          <HeaderRow
            key={header.id}
            header={header}
            index={index}
            onChange={handleChange}
            onRemove={handleRemove}
            canRemove={headers.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
