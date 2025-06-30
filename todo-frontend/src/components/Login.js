import React from 'react';

function Login({ email, setEmail, password, setPassword, onLogin, onShowRegister, error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Login</h2>

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
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />

        <button
          onClick={onLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
        >
          Login
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-700">
          Don't have an account?{' '}
          <button
            onClick={onShowRegister}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
