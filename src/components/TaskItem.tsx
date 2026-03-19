import { useState } from 'react';
import type { Task } from '../types';
import { cn } from '../utils/cn';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  allCompleted: boolean;
}

export function TaskItem({ task, onToggle, onDelete, onEdit, allCompleted }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [swiped, setSwiped] = useState(false);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      onEdit(task.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        'group relative mx-4 mb-2 overflow-hidden rounded-xl border transition-all duration-300',
        allCompleted && task.completed
          ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:border-emerald-800 dark:from-emerald-950/40 dark:to-teal-950/40'
          : task.completed
            ? 'border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50'
            : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
      )}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
            task.completed
              ? allCompleted
                ? 'border-emerald-400 bg-emerald-400 dark:border-emerald-500 dark:bg-emerald-500'
                : 'border-indigo-400 bg-indigo-400 dark:border-indigo-500 dark:bg-indigo-500'
              : 'border-slate-300 hover:border-indigo-400 dark:border-slate-600 dark:hover:border-indigo-500'
          )}
        >
          {task.completed && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Text / Edit */}
        {isEditing ? (
          <input
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-lg border border-indigo-300 bg-white px-2 py-1 text-sm text-slate-800 outline-none dark:border-indigo-600 dark:bg-slate-700 dark:text-slate-100"
          />
        ) : (
          <span
            onDoubleClick={() => {
              setEditText(task.text);
              setIsEditing(true);
            }}
            className={cn(
              'flex-1 select-none text-sm leading-relaxed transition-all',
              task.completed
                ? allCompleted
                  ? 'text-emerald-600 line-through decoration-emerald-300 dark:text-emerald-400 dark:decoration-emerald-700'
                  : 'text-slate-400 line-through decoration-slate-300 dark:text-slate-500 dark:decoration-slate-600'
                : 'text-slate-700 dark:text-slate-200'
            )}
          >
            {task.text}
          </span>
        )}

        {/* Action buttons */}
        <div className={cn(
          'flex items-center gap-1 transition-opacity',
          swiped ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          <button
            onClick={() => {
              setEditText(task.text);
              setIsEditing(true);
            }}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-indigo-500 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Mobile: tap to show actions */}
        <button
          onClick={() => setSwiped(!swiped)}
          className="rounded-lg p-1.5 text-slate-300 transition-colors sm:hidden dark:text-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
