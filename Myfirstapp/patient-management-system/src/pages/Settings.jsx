import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import Button from '../components/ui/Button';
import { User, Mail, Phone, Save } from 'lucide-react';

const Settings = () => {
  const { user, profile, setProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      if (setProfile) {
        setProfile({ ...profile, name: formData.name, phone: formData.phone });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User size={16} className="inline mr-1" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail size={16} className="inline mr-1" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone size={16} className="inline mr-1" /> Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading}>
              <Save size={18} className="mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Statistics</h2>
        <div className="space-y-2 text-gray-600">
          <p>Member since: {new Date(user?.created_at).toLocaleDateString()}</p>
          <p>User ID: {user?.id?.slice(0, 8)}...</p>
          <p>Role: {profile?.role || 'User'}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;