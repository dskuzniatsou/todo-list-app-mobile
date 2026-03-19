import type { FilterMode } from '../types';
import { cn } from '../utils/cn';

interface Props {
  filter: FilterMode;
  onFilterChange: (f: FilterMode) => void;
  totalCount: number;
  activeCount: number;
  completedCount: number;
}

const filters: { key: FilterMode; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'В процессе' },
  { key: 'completed', label: 'Выполнено' },
];

export function FilterBar({ filter, onFilterChange, totalCount, activeCount, completedCount }: Props) {
  const getCount = (key: FilterMode) => {
    if (key === 'all') return totalCount;
    if (key === 'active') return activeCount;
    return completedCount;
  };

  return (
    <div className="flex gap-1.5 px-4 py-2">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
            filter === f.key
              ? 'bg-indigo-500 text-white shadow-sm'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
          )}
        >
          {f.label}
          <span
            className={cn(
              'flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold',
              filter === f.key
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
            )}
          >
            {getCount(f.key)}
          </span>
        </button>
      ))}
    </div>
  );
}
