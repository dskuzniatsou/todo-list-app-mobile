import { useState } from 'react';
import type { TaskList } from '../types';
import { cn } from '../utils/cn';

interface Props {
  lists: TaskList[];
  activeListId: string | null;
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function ListSelector({ lists, activeListId, onSelect, onAdd, onDelete, onRename, onClose, isOpen }: Props) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewName('');
  };

  const startEdit = (list: TaskList) => {
    setEditingId(list.id);
    setEditName(list.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim());
    }
    setEditingId(null);
  };

  const getCompletionInfo = (list: TaskList) => {
    const total = list.tasks.length;
    if (total === 0) return { text: 'Пусто', allDone: false };
    const done = list.tasks.filter((t) => t.completed).length;
    const allDone = done === total && total > 0;
    return { text: `${done}/${total}`, allDone };
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[85%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-900',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">📒 Мои списки</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {lists.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
              Нет списков. Создайте первый!
            </p>
          )}
          {lists.map((list) => {
            const { text: info, allDone } = getCompletionInfo(list);
            return (
              <div
                key={list.id}
                className={cn(
                  'group mb-1 flex items-center gap-2 rounded-xl px-3 py-3 transition-all',
                  activeListId === list.id
                    ? allDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/40'
                      : 'bg-indigo-50 dark:bg-indigo-950/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                )}
              >
                <button
                  onClick={() => {
                    onSelect(list.id);
                    onClose();
                  }}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg text-lg',
                      allDone
                        ? 'bg-emerald-100 dark:bg-emerald-900/50'
                        : 'bg-indigo-100 dark:bg-indigo-900/50'
                    )}
                  >
                    {allDone ? '✅' : '📋'}
                  </span>
                  <div className="flex-1 overflow-hidden">
                    {editingId === list.id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full rounded border border-indigo-300 bg-white px-2 py-0.5 text-sm outline-none dark:border-indigo-600 dark:bg-slate-800 dark:text-white"
                      />
                    ) : (
                      <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                        {list.name}
                      </p>
                    )}
                    <p className={cn(
                      'text-xs',
                      allDone ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'
                    )}>
                      {info}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(list);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Удалить список «' + list.name + '»?')) {
                        onDelete(list.id);
                      }
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add new list */}
        <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Новый список..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-600 active:scale-95 disabled:opacity-40"
            >
              +
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
