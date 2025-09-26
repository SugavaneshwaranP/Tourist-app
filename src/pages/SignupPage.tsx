import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { User, UserRole } from '../types';

type SignupData = Omit<User, '_id' | 'userId' | 'verified' | 'createdAt'>;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupData>({
    role: 'tourist' as UserRole,
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.register(formData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        // Set user in context if needed
        navigate(`/${formData.role}-dashboard`);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'An error occurred during signup';
      setError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choose your role</h3>
              <div className="grid grid-cols-2 gap-4">
                {(['tourist', 'guide', 'agency', 'hotel'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className="bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg p-4 hover:bg-indigo-50 transition-colors capitalize"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {formData.role === 'agency' || formData.role === 'hotel' ? 'Business Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  minLength={8}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              {/* Role-specific fields */}
              {formData.role === 'tourist' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Travel Preferences
                  </label>
                  <div className="mt-2 space-y-2">
                    {['adventure', 'culture', 'nature', 'food', 'shopping', 'relaxation'].map((pref) => (
                      <label key={pref} className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          name="preferences"
                          value={pref}
                          className="form-checkbox h-4 w-4 text-indigo-600"
                          onChange={(e) => {
                            const preferences = formData.preferences || [];
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                preferences: [...preferences, pref]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                preferences: preferences.filter((p) => p !== pref)
                              });
                            }
                          }}
                        />
                        <span className="ml-2 capitalize">{pref}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Login
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;