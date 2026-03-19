import { useState } from 'react';

interface Props {
  onAdd: (text: string) => void;
}

export function AddTaskForm({ onAdd }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Новая задача..."
        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-600 active:scale-95 disabled:opacity-40 disabled:shadow-none dark:shadow-indigo-900/30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </form>
  );
}
