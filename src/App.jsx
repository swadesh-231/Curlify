import { useEffect } from 'react';
import useStore from './store/useStore';
import Sidebar from './components/Sidebar';
import RequestBuilder from './components/RequestBuilder';
import ResponseViewer from './components/ResponseViewer';

export default function App() {
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="h-screen flex bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-700/50 bg-zinc-50/80 dark:bg-zinc-900 flex flex-col">
        <Sidebar />
        {/* Theme toggle */}
        <div className="px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-700/50">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            {darkMode ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>

      {/* Request Builder */}
      <main className="flex-1 min-w-0 border-r border-zinc-200 dark:border-zinc-700/50">
        <RequestBuilder />
      </main>

      {/* Response Viewer */}
      <section className="w-120 shrink-0 bg-zinc-50/50 dark:bg-zinc-900">
        <ResponseViewer />
      </section>
    </div>
  );
}
