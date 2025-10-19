'use client';

import React, { useEffect, useState } from 'react';
import { api, BudgetBreakdown } from '@/lib/api';

type TabType = 'budget' | 'simulator' | 'extraHours';

export default function CalculationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('budget');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Budget State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [budget, setBudget] = useState<BudgetBreakdown | null>(null);

  // Extra Hours State
  const [extraHoursHistory, setExtraHoursHistory] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await api.getStudents(1, 100);
      if (response.data) setStudents(response.data);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const handleCalculateBudget = async () => {
    if (!selectedStudentId) {
      alert('Selecione um aluno');
      return;
    }

    try {
      setLoading(true);
      const response = await api.getMonthlyBudget(
        selectedStudentId,
        selectedMonth,
        selectedYear
      );
      if (response.data) {
        setBudget(response.data);
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao calcular orçamento');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadExtraHours = async () => {
    if (!selectedStudentId || !startDate || !endDate) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      const response = await api.getExtraHoursHistory(
        selectedStudentId,
        startDate,
        endDate
      );
      if (response.data) {
        setExtraHoursHistory(response.data);
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    return days[dayIndex] || '';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cálculos Financeiros</h1>
        <p className="text-gray-600">
          Calcule orçamentos, simule contratos e acompanhe horas extras
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'budget'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orçamento Mensal
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'simulator'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Simulador
            </button>
            <button
              onClick={() => setActiveTab('extraHours')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'extraHours'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Horas Extras
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* BUDGET TAB */}
          {activeTab === 'budget' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Orçamento Mensal do Aluno</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aluno *
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione um aluno</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mês</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {new Date(2000, month - 1).toLocaleString('pt-BR', {
                          month: 'long',
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {[2024, 2025, 2026].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleCalculateBudget}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Calculando...' : 'Calcular Orçamento'}
              </button>

              {/* Budget Results */}
              {budget && (
                <div className="mt-6 space-y-4">
                  {/* Mensalidade */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Mensalidade</h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(budget.mensalidade)}
                    </p>
                  </div>

                  {/* Serviços Contratados */}
                  {budget.servicosContratados.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-green-900 mb-3">
                        Serviços Contratados
                      </h3>
                      <div className="space-y-2">
                        {budget.servicosContratados.map((service, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-700">{service.nome}</span>
                            <span className="font-semibold text-green-700">
                              {formatCurrency(service.valor)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-green-300 pt-2 flex justify-between">
                          <span className="font-semibold">Subtotal Serviços:</span>
                          <span className="font-bold text-green-700">
                            {formatCurrency(
                              budget.servicosContratados.reduce((sum, s) => sum + s.valor, 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Horas Extras */}
                  {budget.horasExtras.totalHoras > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-orange-900 mb-3">
                        Horas Extras
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total de Horas:</span>
                          <span className="font-semibold">{budget.horasExtras.totalHoras}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Valor por Hora:</span>
                          <span className="font-semibold">
                            {formatCurrency(budget.horasExtras.valorPorHora)}
                          </span>
                        </div>
                        <div className="border-t border-orange-300 pt-2 flex justify-between">
                          <span className="font-semibold">Subtotal Horas Extras:</span>
                          <span className="font-bold text-orange-700">
                            {formatCurrency(budget.horasExtras.subtotal)}
                          </span>
                        </div>
                      </div>

                      {/* Detalhamento por dia */}
                      {budget.detalhamentoDias.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-sm mb-2">Detalhamento por Dia:</h4>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {budget.detalhamentoDias.map((day, index) => (
                              <div key={index} className="text-sm flex justify-between">
                                <span>
                                  {new Date(day.data).toLocaleDateString('pt-BR')} (
                                  {getDayName(day.diaSemana)})
                                </span>
                                <span className="font-medium">{day.horasExtras}h</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total Geral */}
                  <div className="bg-indigo-100 border-2 border-indigo-400 rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-indigo-900">TOTAL GERAL</h3>
                      <p className="text-4xl font-bold text-indigo-600">
                        {formatCurrency(budget.totalGeral)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SIMULATOR TAB */}
          {activeTab === 'simulator' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Simulador de Contratos</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  🚧 <strong>Em Desenvolvimento</strong> - Esta funcionalidade permite simular
                  alterações no contrato do aluno (horários, serviços, descontos) e ver o
                  impacto financeiro antes de salvar.
                </p>
              </div>
            </div>
          )}

          {/* EXTRA HOURS TAB */}
          {activeTab === 'extraHours' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Histórico de Horas Extras</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aluno *
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione um aluno</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                onClick={handleLoadExtraHours}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Carregando...' : 'Carregar Histórico'}
              </button>

              {/* Extra Hours Table */}
              {extraHoursHistory.length > 0 && (
                <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Dia da Semana
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Horas Extras
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Valor/Hora
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Valor Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {extraHoursHistory.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(record.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {getDayName(record.diaSemana)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            {record.horasExtras}h
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            {formatCurrency(record.valorPorHora)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-blue-600">
                            {formatCurrency(record.valor)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-bold">
                        <td colSpan={2} className="px-6 py-4 text-right">
                          TOTAL:
                        </td>
                        <td className="px-6 py-4 text-right">
                          {extraHoursHistory.reduce((sum, r) => sum + r.horasExtras, 0)}h
                        </td>
                        <td></td>
                        <td className="px-6 py-4 text-right text-blue-600">
                          {formatCurrency(
                            extraHoursHistory.reduce((sum, r) => sum + r.valor, 0)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
