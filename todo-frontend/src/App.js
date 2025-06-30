import React from 'react';
import { ToastContainer } from 'react-toastify';

import Register from './components/Register';
import Login from './components/Login';
import TaskList from './components/TaskList';
import Profile from './components/Profile';
import useAppLogic from './hooks/useAppLogic';

function App() {
  const {
    // Auth
    token, email, setEmail, password, setPassword, handleLogin, handleLogout, error,

    // Register/Profile
    showRegister, setShowRegister,
    showProfile, setShowProfile,
    profile, oldPassword, setOldPassword, newPassword, setNewPassword,
    newEmail, setNewEmail, handlePasswordChange, handleEmailChange, fetchProfile,

    // Tasks
    tasks, currentTasks, newTitle, setNewTitle, addTask,
    editingTaskId, editingTitle, setEditingTitle,
    editingDueDate, setEditingDueDate,
    submitEdit, cancelEdit,
    toggleCompleted, handleEdit, handleDelete,
    dueDate, setDueDate,

    // Task validation
    editingTitleError, setEditingTitleError,
    editingDueDateError, setEditingDueDateError,

    // Filtering & Sorting
    searchTerm, setSearchTerm,
    sortOrder, setSortOrder,
    dateSortOrder, setDateSortOrder,
    filterStatus, setFilterStatus,

    // Pagination
    currentPage, totalPages, goToPage,

    // Summary counts
    completedCount, dueSoonCount, overdueCount, totalCount,
    dueSoonTasks, overdueTasks,

    // Loading
    loading,
  } = useAppLogic();

  if (!token) {
    return showRegister ? (
      <>
        <Register
          onRegistered={() => setShowRegister(false)}
          onCancel={() => setShowRegister(false)}
        />
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    ) : (
      <>
        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onLogin={handleLogin}
          onShowRegister={() => setShowRegister(true)}
          error={error}
        />
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  if (showProfile) {
    return (
      <>
        <Profile
          loading={loading}
          profile={profile}
          oldPassword={oldPassword}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          onPasswordChange={handlePasswordChange}
          onEmailChange={handleEmailChange}
          onBack={() => setShowProfile(false)}
        />
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  return (
    <>
      <TaskList
        // Data
        loading={loading}
        tasks={tasks}
        currentTasks={currentTasks}

        // Task Form
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        dueDate={dueDate}
        setDueDate={setDueDate}
        addTask={addTask}

        // Task Edit
        editingTaskId={editingTaskId}
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
        editingDueDate={editingDueDate}
        setEditingDueDate={setEditingDueDate}
        submitEdit={submitEdit}
        cancelEdit={cancelEdit}

        // Task Errors
        editingTitleError={editingTitleError}
        setEditingTitleError={setEditingTitleError}
        editingDueDateError={editingDueDateError}
        setEditingDueDateError={setEditingDueDateError}

        // Filter / Search / Sort
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        dateSortOrder={dateSortOrder}
        setDateSortOrder={setDateSortOrder}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}

        // Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}

        // Summary Stats
        completedCount={completedCount}
        dueSoonCount={dueSoonCount}
        overdueCount={overdueCount}
        totalCount={totalCount}
        dueSoonTasks={dueSoonTasks}
        overdueTasks={overdueTasks}

        // Handlers
        toggleCompleted={toggleCompleted}
        handleEdit={handleEdit}
        handleDelete={handleDelete}

        // Profile / Logout
        onShowProfile={() => {
          setShowProfile(true);
          fetchProfile();
        }}
        onLogout={handleLogout}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
