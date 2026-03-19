interface Props {
  hasLists: boolean;
  onOpenSidebar: () => void;
}

export function EmptyState({ hasLists, onOpenSidebar }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <div className="mb-4 text-6xl">
        {hasLists ? '📝' : '📒'}
      </div>
      <h2 className="mb-2 text-lg font-bold text-slate-700 dark:text-slate-200">
        {hasLists ? 'Список пуст' : 'Нет списков'}
      </h2>
      <p className="mb-6 text-sm text-slate-400 dark:text-slate-500">
        {hasLists
          ? 'Добавьте первую задачу, чтобы начать'
          : 'Создайте свой первый список задач'}
      </p>
      {!hasLists && (
        <button
          onClick={onOpenSidebar}
          className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-600 active:scale-95 dark:shadow-indigo-900/30"
        >
          Создать список
        </button>
      )}
    </div>
  );
}
