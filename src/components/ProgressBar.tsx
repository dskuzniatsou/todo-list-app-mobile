import { cn } from '../utils/cn';

interface Props {
  total: number;
  completed: number;
}

export function ProgressBar({ total, completed }: Props) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const allDone = total > 0 && completed === total;

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center justify-between pb-1.5">
        <span className="text-xs text-slate-400 dark:text-slate-500">Прогресс</span>
        <span
          className={cn(
            'text-xs font-semibold',
            allDone ? 'text-emerald-500' : 'text-indigo-500'
          )}
        >
          {percent}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            allDone
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
              : 'bg-gradient-to-r from-indigo-400 to-purple-400'
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
