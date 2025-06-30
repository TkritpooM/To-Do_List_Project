import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { toast } from 'react-toastify';
import { differenceInCalendarDays } from 'date-fns';

const getDueSoonTasks = (tasks) => {
  const today = new Date();
  return tasks.filter(task => {
    if (task.completed || !task.due_date) return false;
    const diff = differenceInCalendarDays(new Date(task.due_date), today);
    return diff >= 0 && diff <= 2;
  });
};

const getOverdueTasks = (tasks) => {
  const today = new Date();
  return tasks.filter(task => {
    if (task.completed || !task.due_date) return false;
    const diff = differenceInCalendarDays(new Date(task.due_date), today);
    return diff < 0;
  });
};

const useAppLogic = () => {
  // Auth & Profile
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profile, setProfile] = useState(null);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Task States
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [editingTitleError, setEditingTitleError] = useState('');
  const [editingDueDateError, setEditingDueDateError] = useState('');

  // Filter & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [dateSortOrder, setDateSortOrder] = useState('none');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  // Task Groups & Stats
  const [dueSoonTasks, setDueSoonTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [dueSoonCount, setDueSoonCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const updateTaskCounts = useCallback((tasks) => {
    setTotalCount(tasks.length);
    setCompletedCount(tasks.filter(t => t.completed).length);
    setDueSoonCount(getDueSoonTasks(tasks).length);
    setOverdueCount(getOverdueTasks(tasks).length);
  }, []);

  // Load token
  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) setToken(saved);
  }, []);

  // Fetch tasks
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api.fetchTasks(token)
      .then(fetched => {
        setTasks(fetched);
        const soon = getDueSoonTasks(fetched);
        const overdue = getOverdueTasks(fetched);
        setDueSoonTasks(soon);
        setOverdueTasks(overdue);
        updateTaskCounts(fetched);
        if (soon.length) toast.info(`You have ${soon.length} task(s) due soon!`);
        if (overdue.length) toast.warning(`You have ${overdue.length} overdue task(s)!`);
      })
      .catch(() => toast.error('Failed to fetch tasks'))
      .finally(() => setLoading(false));
  }, [token, updateTaskCounts]);

  useEffect(() => {
    if (dueSoonTasks.length) {
      dueSoonTasks.forEach(task => {
        toast.info(`Task "${task.title}" is due soon! (${new Date(task.due_date).toLocaleDateString()})`);
      });
    }
  }, [dueSoonTasks]);

  // Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.fetchProfile(token);
      setProfile(res);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail.trim()) return toast.error('Email cannot be empty');
    try {
      setLoading(true);
      const res = await api.updateEmail(token, newEmail);
      toast.success(res.message || 'Email updated successfully');
      setNewEmail('');
      fetchProfile();
      setTimeout(() => setShowProfile(false), 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Unknown error';
      toast.error('Email update failed: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      const res = await api.changePassword(token, oldPassword, newPassword);
      toast.success(res.message);
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setShowProfile(false), 1000);
    } catch (err) {
      toast.error('Password update failed: ' + err);
    } finally {
      setLoading(false);
    }
  };

  // Auth
  const handleLogin = async () => {
    try {
      const res = await api.login(email, password);
      setToken(res.token);
      localStorage.setItem('token', res.token);
      toast.success('Login successful!');
    } catch (err) {
      toast.error('Login failed: ' + err);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setTasks([]);
    setEmail('');
    setPassword('');
    setNewTitle('');
    setError('');
    setSearchTerm('');
    setCurrentPage(1);
    setSortOrder('asc');
  };

  // Task CRUD
  const addTask = async () => {
    if (!newTitle.trim()) return;
    try {
      const newTask = await api.addTask(token, newTitle, dueDate);
      setTasks([newTask, ...tasks]);
      setNewTitle('');
      setDueDate('');
      toast.success('Task added!');
    } catch {
      toast.error('Failed to add task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTask(token, id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted!');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingDueDate(task.due_date ? task.due_date.slice(0, 10) : '');
  };

  const submitEdit = async () => {
    setEditingTitleError('');
    setEditingDueDateError('');

    if (!editingTitle.trim()) {
      setEditingTitleError('Task title cannot be empty');
      return;
    }

    if (editingDueDate) {
      const valid = /^\d{4}-\d{2}-\d{2}$/.test(editingDueDate);
      const [y, m, d] = editingDueDate.split('-').map(Number);
      if (!valid || m < 1 || m > 12 || d < 1 || d > 31) {
        setEditingDueDateError('Due date is invalid');
        return;
      }
    }

    try {
      setLoading(true);
      const updated = await api.editTask(token, editingTaskId, editingTitle, editingDueDate);
      setTasks(tasks.map(t => (t.id === editingTaskId ? updated : t)));
      cancelEdit();
      toast.success('Task updated!');
    } catch {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
    setEditingDueDate('');
  };

  const toggleCompleted = async (task) => {
    try {
      const updated = await api.toggleTaskCompleted(token, task.id, !task.completed);
      setTasks(tasks.map(t => (t.id === task.id ? updated : t)));
      toast.success('Task updated!');
    } catch {
      toast.error('Failed to update task');
    }
  };

  // Filter, Sort, Pagination
  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && task.completed) ||
      (filterStatus === 'not_completed' && !task.completed);
    return matchSearch && matchStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (dateSortOrder !== 'none') {
      const d1 = a.due_date ? new Date(a.due_date) : null;
      const d2 = b.due_date ? new Date(b.due_date) : null;
      if (!d1 && !d2) return 0;
      if (!d1) return 1;
      if (!d2) return -1;
      return dateSortOrder === 'asc' ? d1 - d2 : d2 - d1;
    } else {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
  });

  const indexOfLast = currentPage * tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfLast - tasksPerPage, indexOfLast);
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
  const goToPage = (page) => page >= 1 && page <= totalPages && setCurrentPage(page);

  return {
    // Auth & Profile
    token, email, setEmail, password, setPassword, handleLogin, handleLogout,
    showRegister, setShowRegister, showProfile, setShowProfile,
    profile, oldPassword, setOldPassword, newPassword, setNewPassword,
    newEmail, setNewEmail, handlePasswordChange, handleEmailChange, fetchProfile,

    // Task logic
    loading, tasks, newTitle, setNewTitle, dueDate, setDueDate, addTask,
    editingTaskId, editingTitle, setEditingTitle, editingDueDate, setEditingDueDate,
    submitEdit, cancelEdit, handleEdit, handleDelete, toggleCompleted,

    // Errors
    editingTitleError, setEditingTitleError,
    editingDueDateError, setEditingDueDateError,
    error,

    // Filters & Pagination
    searchTerm, setSearchTerm, sortOrder, setSortOrder,
    dateSortOrder, setDateSortOrder,
    filterStatus, setFilterStatus,
    currentPage, totalPages, goToPage,

    // Processed data
    currentTasks, dueSoonTasks, overdueTasks,
    completedCount, dueSoonCount, overdueCount, totalCount,
  };
};

export default useAppLogic;
