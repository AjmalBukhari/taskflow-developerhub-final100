import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProfile, updateProfile } from '../../services/api';

export default function Profile({ showToast }) {

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', password: '' });
  const [loading, setLoading] = useState(false);

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const { data } = await getProfile();
      setUser(data);
      setForm({ name: data.name || '', password: '' });
    } catch {
      showToast('Failed to load profile', 'error');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateProfile(form);

      showToast('Profile updated');
      fetchUser();

      setForm({ ...form, password: '' });

    } catch {
      showToast('Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-5"
    >

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-gray-500">
          Manage your account information
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        {/* USER INFO */}
        <div className="mb-5">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        {/* EDIT FORM */}
        <div className="space-y-3">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

        </div>

      </div>

    </motion.div>
  );
}