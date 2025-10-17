'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface Stats {
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
  totalSegments: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    activeStudents: 0,
    totalClasses: 0,
    totalSegments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, classes, segments] = await Promise.all([
          api.getStudents(1, 100),
          api.getClasses(1, 100),
          api.getSegments(1, 100),
        ]);

        const activeStudentsCount = students.data?.filter(
          (s: any) => s.status === 'ATIVO'
        ).length || 0;

        setStats({
          totalStudents: students.pagination?.total || 0,
          activeStudents: activeStudentsCount,
          totalClasses: classes.pagination?.total || 0,
          totalSegments: segments.pagination?.total || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: string;
    label: string;
    value: number;
    color: string;
  }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-blue-100">
          Here's what's happening with your school management system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="👥"
          label="Total Students"
          value={stats.totalStudents}
          color="border-blue-500"
        />
        <StatCard
          icon="✅"
          label="Active Students"
          value={stats.activeStudents}
          color="border-green-500"
        />
        <StatCard
          icon="🏫"
          label="Total Classes"
          value={stats.totalClasses}
          color="border-purple-500"
        />
        <StatCard
          icon="🎓"
          label="Segments"
          value={stats.totalSegments}
          color="border-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            ➕ Add Student
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            📊 View Reports
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Information</h2>
        <div className="space-y-3 text-gray-700">
          <p className="flex justify-between">
            <span>Backend API Status:</span>
            <span className="font-semibold text-green-600">✅ Connected</span>
          </p>
          <p className="flex justify-between">
            <span>Your Role:</span>
            <span className="font-semibold">{user?.profile}</span>
          </p>
          <p className="flex justify-between">
            <span>Email:</span>
            <span className="font-semibold">{user?.email}</span>
          </p>
          <p className="flex justify-between">
            <span>Version:</span>
            <span className="font-semibold">1.0.0</span>
          </p>
        </div>
      </div>
    </div>
  );
}
