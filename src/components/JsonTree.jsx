import { useState, memo } from 'react';

const JsonNode = memo(function JsonNode({ keyName, value, depth = 0 }) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const entries = isObject ? Object.entries(value) : [];
  const bracket = isArray ? ['[', ']'] : ['{', '}'];

  if (!isObject) {
    let colorClass = 'text-zinc-900 dark:text-zinc-100';
    let display = String(value);

    if (typeof value === 'string') {
      colorClass = 'text-green-600 dark:text-green-400';
      display = `"${value}"`;
    } else if (typeof value === 'number') {
      colorClass = 'text-blue-600 dark:text-blue-400';
    } else if (typeof value === 'boolean') {
      colorClass = 'text-amber-600 dark:text-amber-400';
    } else if (value === null) {
      colorClass = 'text-zinc-400 dark:text-zinc-500';
      display = 'null';
    }

    return (
      <span>
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">"{keyName}"</span>
        )}
        {keyName !== undefined && <span className="text-zinc-500">: </span>}
        <span className={colorClass}>{display}</span>
      </span>
    );
  }

  if (entries.length === 0) {
    return (
      <span>
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">"{keyName}"</span>
        )}
        {keyName !== undefined && <span className="text-zinc-500">: </span>}
        <span className="text-zinc-500">{bracket[0]}{bracket[1]}</span>
      </span>
    );
  }

  return (
    <div style={{ paddingLeft: keyName !== undefined ? 0 : 0 }}>
      <span
        className="cursor-pointer select-none hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 rounded px-0.5 -mx-0.5"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-zinc-400 inline-block w-4 text-center text-xs">
          {collapsed ? '▶' : '▼'}
        </span>
        {keyName !== undefined && (
          <span className="text-purple-600 dark:text-purple-400">"{keyName}"</span>
        )}
        {keyName !== undefined && <span className="text-zinc-500">: </span>}
        <span className="text-zinc-500">{bracket[0]}</span>
        {collapsed && (
          <span className="text-zinc-400 text-xs"> {entries.length} {entries.length === 1 ? 'item' : 'items'} </span>
        )}
        {collapsed && <span className="text-zinc-500">{bracket[1]}</span>}
      </span>
      {!collapsed && (
        <div className="pl-5 border-l border-zinc-200 dark:border-zinc-700 ml-1.5">
          {entries.map(([k, v], i) => (
            <div key={k} className="leading-6">
              <JsonNode keyName={isArray ? undefined : k} value={v} depth={depth + 1} />
              {i < entries.length - 1 && <span className="text-zinc-400">,</span>}
            </div>
          ))}
        </div>
      )}
      {!collapsed && (
        <span className="text-zinc-500 ml-1.5">{bracket[1]}</span>
      )}
    </div>
  );
});

export default function JsonTree({ data }) {
  return (
    <div className="font-mono text-xs leading-6 overflow-auto">
      <JsonNode value={data} depth={0} />
    </div>
  );
}
