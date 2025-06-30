import React from 'react';

function Profile({
  loading,
  profile,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  newEmail,
  setNewEmail,
  onPasswordChange,
  onEmailChange,
  onBack,
}) {
  return (
    <div className="max-w-xl mx-auto mt-10 px-6 py-8 bg-white shadow-lg rounded-xl animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">My Profile</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading profile...</p>
      ) : profile ? (
        <div className="space-y-6">
          <div>
            <p className="text-gray-700"><span className="font-semibold">Current Email:</span> {profile.email}</p>
            <p className="text-gray-700"><span className="font-semibold">Joined:</span> {new Date(profile.created_at).toLocaleString()}</p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Change Email</h4>
            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              onClick={onEmailChange}
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Update Email
            </button>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Change Password</h4>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              onClick={onPasswordChange}
              className="mt-2 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              Update Password
            </button>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-200"
          >
            Back to Tasks
          </button>
        </div>
      ) : (
        <p className="text-center text-red-500">Failed to load profile</p>
      )}
    </div>
  );
}

export default Profile;
