import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { TaskList, Task, FilterMode } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { cn } from './utils/cn';
import { AddTaskForm } from './components/AddTaskForm';
import { FilterBar } from './components/FilterBar';
import { TaskItem } from './components/TaskItem';
import { ListSelector } from './components/ListSelector';
import { ProgressBar } from './components/ProgressBar';
import { EmptyState } from './components/EmptyState';
import { ConfettiEffect } from './components/ConfettiEffect';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default function App() {
  const [lists, setLists] = useLocalStorage<TaskList[]>('taskLists', []);
  const [activeListId, setActiveListId] = useLocalStorage<string | null>('activeListId', null);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevAllCompletedRef = useRef(false);

  const activeList = useMemo(
    () => lists.find((l) => l.id === activeListId) ?? null,
    [lists, activeListId]
  );

  const tasks = activeList?.tasks ?? [];
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  // Confetti when all tasks become completed
  useEffect(() => {
    if (allCompleted && !prevAllCompletedRef.current && totalCount > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(timer);
    }
    prevAllCompletedRef.current = allCompleted;
  }, [allCompleted, totalCount]);

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const updateActiveList = useCallback(
    (updater: (list: TaskList) => TaskList) => {
      setLists((prev) =>
        prev.map((l) => (l.id === activeListId ? updater(l) : l))
      );
    },
    [activeListId, setLists]
  );

  // List operations
  const addList = (name: string) => {
    const newList: TaskList = {
      id: generateId(),
      name,
      tasks: [],
      createdAt: Date.now(),
    };
    setLists((prev) => [...prev, newList]);
    setActiveListId(newList.id);
  };

  const deleteList = (id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
    if (activeListId === id) {
      setActiveListId(lists.length > 1 ? lists.find((l) => l.id !== id)?.id ?? null : null);
    }
  };

  const renameList = (id: string, name: string) => {
    setLists((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
  };

  // Task operations
  const addTask = (text: string) => {
    const newTask: Task = {
      id: generateId(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    updateActiveList((l) => ({ ...l, tasks: [...l.tasks, newTask] }));
  };

  const toggleTask = (id: string) => {
    updateActiveList((l) => ({
      ...l,
      tasks: l.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const deleteTask = (id: string) => {
    updateActiveList((l) => ({
      ...l,
      tasks: l.tasks.filter((t) => t.id !== id),
    }));
  };

  const editTask = (id: string, text: string) => {
    updateActiveList((l) => ({
      ...l,
      tasks: l.tasks.map((t) => (t.id === id ? { ...t, text } : t)),
    }));
  };

  const clearCompleted = () => {
    updateActiveList((l) => ({
      ...l,
      tasks: l.tasks.filter((t) => !t.completed),
    }));
  };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-slate-50 dark:bg-slate-950">
      <ConfettiEffect show={showConfetti} />

      <ListSelector
        lists={lists}
        activeListId={activeListId}
        onSelect={setActiveListId}
        onAdd={addList}
        onDelete={deleteList}
        onRename={renameList}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
      />

      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-500',
          allCompleted
            ? 'border-emerald-100 bg-emerald-50/90 dark:border-emerald-900 dark:bg-emerald-950/90'
            : 'border-slate-100 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90'
        )}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1">
            <h1
              className={cn(
                'text-lg font-bold transition-colors duration-500',
                allCompleted
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-800 dark:text-slate-100'
              )}
            >
              {activeList ? activeList.name : 'Записная книжка'}
            </h1>
            {activeList && totalCount > 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {completedCount} из {totalCount} выполнено
              </p>
            )}
          </div>

          {allCompleted && totalCount > 0 && (
            <span className="animate-fade-in text-2xl">🎉</span>
          )}
        </div>
      </header>

      {/* Main Content */}
      {!activeList ? (
        <EmptyState hasLists={lists.length > 0} onOpenSidebar={() => setSidebarOpen(true)} />
      ) : (
        <main className="flex flex-1 flex-col pb-4">
          {/* Progress */}
          {totalCount > 0 && (
            <div className="pt-3">
              <ProgressBar total={totalCount} completed={completedCount} />
            </div>
          )}

          {/* All completed banner */}
          {allCompleted && totalCount > 0 && (
            <div className="animate-slide-up mx-4 mb-3 mt-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
              <p className="text-sm font-semibold text-white">
                🎉 Все задачи выполнены! Отличная работа!
              </p>
            </div>
          )}

          {/* Filter */}
          {totalCount > 0 && (
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              totalCount={totalCount}
              activeCount={activeCount}
              completedCount={completedCount}
            />
          )}

          {/* Task list */}
          <div className="flex-1 pt-1">
            {filteredTasks.length === 0 && totalCount > 0 ? (
              <div className="py-12 text-center">
                <p className="text-3xl">
                  {filter === 'completed' ? '🔍' : '✨'}
                </p>
                <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                  {filter === 'completed'
                    ? 'Нет выполненных задач'
                    : 'Все задачи выполнены!'}
                </p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-3xl">📝</p>
                <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                  Добавьте первую задачу
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="animate-slide-up">
                  <TaskItem
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    allCompleted={allCompleted}
                  />
                </div>
              ))
            )}
          </div>

          {/* Clear completed */}
          {completedCount > 0 && (
            <div className="px-4 pt-2">
              <button
                onClick={clearCompleted}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-medium text-slate-400 transition-all hover:border-red-200 hover:text-red-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-red-800 dark:hover:text-red-400"
              >
                Очистить выполненные ({completedCount})
              </button>
            </div>
          )}

          {/* Add task form */}
          <div className="sticky bottom-0 mt-auto border-t border-slate-100 bg-slate-50/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
            <AddTaskForm onAdd={addTask} />
          </div>
        </main>
      )}

      {/* Bottom safe area for mobile */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  );
}
