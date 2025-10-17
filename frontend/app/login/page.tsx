'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { pt_BR } from '@/lib/translations';

const t = pt_BR;

export default function LoginPage() {
  const [email, setEmail] = useState('admin@school.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.login.failed
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 SMS</h1>
          <p className="text-gray-600">{t.login.title}</p>
          <p className="text-sm text-gray-500 mt-2">{t.login.subtitle}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t.login.emailLabel}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="admin@school.com"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t.login.passwordLabel}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200 mt-6"
          >
            {isLoading ? t.login.loggingIn : t.login.signIn}
          </button>
        </form>

        {/* Test Credentials */}
        <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-lg text-sm">
          <p className="font-semibold text-gray-900 mb-2">{t.login.testCredentials}</p>
          <p className="text-gray-700">
            <span className="font-medium">{t.login.admin}:</span> admin@school.com / 123456
          </p>
          <p className="text-gray-700">
            <span className="font-medium">{t.login.manager}:</span> gerente@school.com / 123456
          </p>
          <p className="text-gray-700">
            <span className="font-medium">{t.login.operator}:</span> operador@school.com / 123456
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🚀 {t.login.backendStatus}</p>
        </div>
      </div>
    </div>
  );
}
