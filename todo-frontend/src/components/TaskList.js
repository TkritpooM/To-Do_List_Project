import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  CheckCircle,
  Bookmark,
  CalendarDays,
  Edit2,
  Trash2,
  User,
  LogOut,
} from 'lucide-react';

function TaskList({
  completedCount,
  dueSoonCount,
  overdueCount,
  totalCount,
  dueSoonTasks,
  editingTaskId,
  editingTitle,
  setEditingTitle,
  editingDueDate,
  setEditingDueDate,
  submitEdit,
  cancelEdit,
  loading,
  tasks,
  overdueTasks,
  currentTasks,
  newTitle,
  setNewTitle,
  dueDate,
  setDueDate,
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  currentPage,
  totalPages,
  goToPage,
  toggleCompleted,
  handleEdit,
  handleDelete,
  addTask,
  onShowProfile,
  onLogout,
  editingTitleError,
  setEditingTitleError,
  editingDueDateError,
  setEditingDueDateError,
  dateSortOrder,
  setDateSortOrder,
  filterStatus,
  setFilterStatus,
}) {
  const [deletionCandidate, setDeletionCandidate] = useState(null);
  const today = new Date();

  function groupTasksByDueDate(tasks) {
    const overdue = [], dueSoon = [], others = [];

    tasks.forEach(task => {
      if (!task.due_date) return others.push(task);
      const due = new Date(task.due_date);
      const diff = (due - today) / (1000 * 60 * 60 * 24);

      if (diff < 0) overdue.push(task);
      else if (diff <= 3) dueSoon.push(task);
      else others.push(task);
    });

    return { overdue, dueSoon, others };
  }

  const { overdue, dueSoon, others } = groupTasksByDueDate(currentTasks);

  function renderTaskItem(task) {
    return (
      <li key={task.id} className="mb-3 animate-fade-in">
        {editingTaskId === task.id ? (
          <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-300 shadow-md">
            <input
              type="text"
              value={editingTitle}
              onChange={e => {
                setEditingTitle(e.target.value);
                setEditingTitleError('');
              }}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition text-base font-medium"
              placeholder="Edit task title"
              autoFocus
            />
            {editingTitleError && (
              <div className="text-red-600 text-sm font-semibold">{editingTitleError}</div>
            )}
            <input
              type="date"
              value={editingDueDate}
              onChange={e => {
                setEditingDueDate(e.target.value);
                setEditingDueDateError('');
              }}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500 transition text-base"
            />
            {editingDueDateError && (
              <div className="text-red-600 text-sm font-semibold">{editingDueDateError}</div>
            )}
            <div className="flex gap-4 mt-4">
              <button
                onClick={submitEdit}
                className="flex-1 px-5 py-2 rounded-2xl bg-blue-700 text-white font-bold hover:bg-blue-800 shadow-lg transition"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 px-5 py-2 rounded-2xl bg-gray-300 text-gray-800 font-bold hover:bg-gray-400 shadow-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 hover:bg-gray-100 rounded-2xl shadow-md transition-shadow">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task)}
              className="w-6 h-6 rounded cursor-pointer text-blue-600 focus:ring-4 focus:ring-blue-400 transition"
            />
            <span className={`flex-1 text-base ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'} font-semibold`}>
              {task.title}
              {task.due_date && (
                <span className="ml-3 text-sm text-gray-500 select-none flex items-center gap-1">
                  <CalendarDays size={16} />
                  {new Date(task.due_date).toLocaleDateString('en-GB')}
                </span>
              )}
            </span>
            <button
              onClick={() => handleEdit(task)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-yellow-400 text-yellow-900 rounded-2xl font-semibold hover:bg-yellow-500 shadow-md transition"
              aria-label="Edit task"
              title="Edit task"
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              onClick={() => setDeletionCandidate(task)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 shadow-lg transition"
              aria-label="Delete task"
              title="Delete task"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </li>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-2xl rounded-3xl font-sans animate-fade-in">

        {/* Top right Profile & Logout */}
        <div className="flex justify-end mb-6 gap-5">
          <button
            onClick={onShowProfile}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-blue-700 text-white rounded-3xl font-extrabold hover:bg-blue-800 shadow-xl transition whitespace-nowrap text-base"
            aria-label="Show Profile"
            title="Profile"
          >
            <User size={18} />
            Profile
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-red-700 text-white rounded-3xl font-extrabold hover:bg-red-800 shadow-xl transition whitespace-nowrap text-base"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Summary Block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10 text-center select-none">
          <div className="bg-green-100 text-green-900 py-4 rounded-3xl font-bold shadow-inner flex items-center justify-center gap-2.5 text-base">
            <CheckCircle size={22} />
            <span>{completedCount} Done</span>
          </div>
          <div className="bg-yellow-100 text-yellow-900 py-4 rounded-3xl font-bold shadow-inner flex items-center justify-center gap-2.5 text-base">
            <AlertTriangle size={22} />
            <span>{dueSoonCount} Due Soon</span>
          </div>
          <div className="bg-red-100 text-red-900 py-4 rounded-3xl font-bold shadow-inner flex items-center justify-center gap-2.5 text-base">
            <Flame size={22} />
            <span>{overdueCount} Overdue</span>
          </div>
          <div className="bg-gray-100 text-gray-900 py-4 rounded-3xl font-bold shadow-inner flex items-center justify-center gap-2.5 text-base">
            <Bookmark size={22} />
            <span>{totalCount} Total</span>
          </div>
        </div>

        {/* Controls Block */}
        <div className="flex flex-wrap gap-4 mb-10 items-center">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              goToPage(1);
            }}
            className="flex-grow p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition min-w-[200px] text-base"
          />

          <select
            value={dateSortOrder}
            onChange={e => {
              setDateSortOrder(e.target.value);
              goToPage(1);
            }}
            className="p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition text-base"
            aria-label="Sort by Due Date"
          >
            <option value="none">Sort by Title</option>
            <option value="asc">Due Date ↑</option>
            <option value="desc">Due Date ↓</option>
          </select>

          <select
            value={sortOrder}
            onChange={e => {
              setSortOrder(e.target.value);
              goToPage(1);
            }}
            className="p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition text-base"
            aria-label="Sort Alphabetically"
          >
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => {
              setFilterStatus(e.target.value);
              goToPage(1);
            }}
            className="p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition text-base"
            aria-label="Filter by Status"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="not_completed">Not Completed</option>
          </select>
        </div>

        {/* Add Task Block */}
        <div className="flex flex-wrap gap-4 mb-10">
          <input
            type="text"
            placeholder="New task"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition min-w-[200px] text-base"
          />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-4 focus:ring-purple-500 transition text-base"
          />
          <button
            onClick={addTask}
            disabled={loading || !newTitle.trim()}
            className={`px-8 py-2 rounded-3xl text-white font-extrabold transition ${
              loading || !newTitle.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-700 hover:bg-green-800 shadow-lg'
            } text-base`}
          >
            Add
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <p className="text-center text-gray-600 font-semibold mb-8 text-base">Loading tasks...</p>
        )}

        {/* Empty State */}
        {!loading && currentTasks.length === 0 && (
          <div className="text-center text-gray-500 text-lg font-semibold py-16">
            No tasks found.
          </div>
        )}

        {/* Task Sections */}
        {overdue.length > 0 && (
          <section className="mb-10 bg-red-50 border-l-8 border-red-400 p-5 rounded-3xl shadow-md">
            <h3 className="text-red-700 font-extrabold text-3xl mb-6 flex items-center gap-3 select-none">
              <Flame size={26} />
              Overdue
            </h3>
            <ul>{overdue.map(renderTaskItem)}</ul>
          </section>
        )}

        {dueSoon.length > 0 && (
          <section className="mb-10 bg-yellow-50 border-l-8 border-yellow-400 p-5 rounded-3xl shadow-md">
            <h3 className="text-yellow-700 font-extrabold text-3xl mb-6 flex items-center gap-3 select-none">
              <AlertTriangle size={26} />
              Due Soon
            </h3>
            <ul>{dueSoon.map(renderTaskItem)}</ul>
          </section>
        )}

        {others.length > 0 && (
          <section className="mb-10 bg-gray-50 border-l-8 border-gray-400 p-5 rounded-3xl shadow-md">
            <h3 className="text-gray-700 font-extrabold text-3xl mb-6 flex items-center gap-3 select-none">
              <Bookmark size={26} />
              Other Tasks
            </h3>
            <ul>{others.map(renderTaskItem)}</ul>
          </section>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-6 py-2 rounded-3xl font-extrabold transition ${
              currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-700 text-white hover:bg-blue-800 shadow-lg'
            } text-base`}
            aria-label="Previous page"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => goToPage(num)}
              className={`px-6 py-2 rounded-3xl font-extrabold transition text-base ${
                currentPage === num
                  ? 'bg-blue-900 text-white shadow-xl'
                  : 'bg-gray-100 hover:bg-gray-300'
              }`}
              aria-current={currentPage === num ? 'page' : undefined}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-6 py-2 rounded-3xl font-extrabold transition text-base ${
              currentPage === totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-700 text-white hover:bg-blue-800 shadow-lg'
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {deletionCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full text-center">
            <h2 className="text-2xl font-extrabold mb-5">Confirm Deletion</h2>
            <p className="mb-8 text-gray-700 text-base">
              Are you sure you want to delete{' '}
              <span className="font-bold">"{deletionCandidate.title}"</span>?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => {
                  handleDelete(deletionCandidate.id);
                  setDeletionCandidate(null);
                }}
                className="px-8 py-3 bg-red-700 text-white rounded-3xl font-extrabold hover:bg-red-800 shadow-xl transition text-base"
              >
                Delete
              </button>
              <button
                onClick={() => setDeletionCandidate(null)}
                className="px-8 py-3 bg-gray-300 text-gray-800 rounded-3xl font-extrabold hover:bg-gray-400 shadow-md transition text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TaskList;
