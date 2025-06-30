import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Register({ onRegistered, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3000/register', { email, password });
      toast.success('Registration successful! You can now login.');
      setEmail('');
      setPassword('');
      if (onRegistered) onRegistered();
    } catch (err) {
      toast.error('Registration failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Register</h2>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
        >
          Register
        </button>

        <button
          onClick={onCancel}
          className="w-full mt-3 text-blue-500 hover:underline transition duration-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default Register;
