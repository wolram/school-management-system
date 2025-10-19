'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { href: '/dashboard', label: 'Painel', icon: '📊', roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
    { href: '/dashboard/students', label: 'Alunos', icon: '👨‍🎓', roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
    { href: '/dashboard/teachers', label: 'Professores', icon: '👨‍🏫', roles: ['ADMIN', 'GERENTE'] },
    { href: '/dashboard/classes', label: 'Turmas', icon: '🏫', roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
    { href: '/dashboard/series', label: 'Séries', icon: '📚', roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
    { href: '/dashboard/segments', label: 'Segmentos', icon: '📋', roles: ['ADMIN', 'GERENTE'] },
    { href: '/dashboard/prices', label: 'Preços', icon: '💰', roles: ['ADMIN', 'GERENTE'] },
    { href: '/dashboard/calculations', label: 'Cálculos', icon: '🧮', roles: ['ADMIN', 'GERENTE', 'OPERADOR'] },
  ].filter(item => item.roles.includes(user?.profile || ''));

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-primary-800 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold font-heading">SMS</h1>
              <p className="text-xs text-gray-400">Gestão Escolar</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-secondary-600 text-white font-heading'
                  : 'text-gray-300 hover:bg-primary-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="border-t border-gray-700 p-4 space-y-3">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="text-gray-400">Conectado como</p>
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors text-sm"
          >
            {sidebarOpen ? 'Sair' : 'Sair'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {navItems.find((item) => isActive(item.href))?.label || 'Dashboard'}
          </h2>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
