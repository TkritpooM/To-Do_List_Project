// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const login = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/login`, { email, password });
  return res.data;
};

export const fetchTasks = async (token) => {
  const res = await axios.get(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addTask = async (token, title, dueDate) => {
  const res = await axios.post(
    `${BASE_URL}/tasks`,
    { title, dueDate }, // ✅ ส่ง dueDate
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const deleteTask = async (token, taskId) => {
  await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const editTask = async (token, taskId, newTitle, newDueDate) => {
  const res = await axios.put(
    `${BASE_URL}/tasks/${taskId}`,
    { title: newTitle, dueDate: newDueDate },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const toggleTaskCompleted = async (token, taskId, completed) => {
  const res = await axios.put(
    `${BASE_URL}/tasks/${taskId}`,
    { completed },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const fetchProfile = async (token) => {
  const res = await axios.get(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateEmail = async (token, newEmail) => {
  const res = await axios.put(
    `${BASE_URL}/profile`,
    { newEmail },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const changePassword = async (token, oldPassword, newPassword) => {
  const res = await axios.put(
    `${BASE_URL}/profile`,
    { oldPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
