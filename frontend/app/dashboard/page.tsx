'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-xl shadow-2xl p-8 font-heading">
        <h1 className="text-4xl font-bold mb-2">Bem-vindo de volta, {user?.name}!</h1>
        <p className="text-primary-100">
          Veja o que está acontecendo com o sistema de gestão escolar hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="■"
          label="Total de Alunos"
          value={stats.totalStudents}
          color="border-primary-500"
        />
        <StatCard
          icon="■"
          label="Alunos Ativos"
          value={stats.activeStudents}
          color="border-secondary-500"
        />
        <StatCard
          icon="■"
          label="Total de Turmas"
          value={stats.totalClasses}
          color="border-accent-500"
        />
        <StatCard
          icon="■"
          label="Segmentos"
          value={stats.totalSegments}
          color="border-secondary-400"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/dashboard/segments')}
            className="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Configurações
          </button>
          <button
            onClick={() => router.push('/dashboard/calculations')}
            className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Relatórios
          </button>
          <button
            onClick={() => router.push('/dashboard/students')}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Adicionar Aluno
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Informações do Sistema</h2>
        <div className="space-y-3 text-gray-700">
          <p className="flex justify-between">
            <span>Status da API Backend:</span>
            <span className="font-semibold text-green-600">Conectado</span>
          </p>
          <p className="flex justify-between">
            <span>Sua Função:</span>
            <span className="font-semibold">{user?.profile}</span>
          </p>
          <p className="flex justify-between">
            <span>Email:</span>
            <span className="font-semibold">{user?.email}</span>
          </p>
          <p className="flex justify-between">
            <span>Versão:</span>
            <span className="font-semibold">1.0.0</span>
          </p>
        </div>
      </div>
    </div>
  );
}
