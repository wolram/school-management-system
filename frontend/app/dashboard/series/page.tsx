'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Series {
  id: string;
  name: string;
  code: string;
  level: string;
  status: string;
}

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    level: '',
    status: 'ATIVO',
  });

  useEffect(() => {
    fetchSeries(pagination.page);
  }, []);

  const fetchSeries = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.getSeries(page, pagination.pageSize);
      if (response.data) {
        setSeries(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch series:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (seriesItem?: Series) => {
    if (seriesItem) {
      setEditingSeries(seriesItem);
      setFormData({
        name: seriesItem.name,
        code: seriesItem.code,
        level: seriesItem.level,
        status: seriesItem.status,
      });
    } else {
      setEditingSeries(null);
      setFormData({
        name: '',
        code: '',
        level: '',
        status: 'ATIVO',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSeries(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSeries) {
        await api.updateSeries(editingSeries.id, formData);
      } else {
        await api.createSeries(formData);
      }
      handleCloseModal();
      fetchSeries(pagination.page);
    } catch (error) {
      console.error('Failed to save series:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta série?')) {
      try {
        await api.deleteSeries(id);
        fetchSeries(pagination.page);
      } catch (error) {
        console.error('Failed to delete series:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Séries</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          ➕ Adicionar Série
        </button>
      </div>

      {/* Series Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Carregando séries...</p>
          </div>
        ) : series.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhuma série encontrada.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nível
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {series.map((seriesItem) => (
                    <tr key={seriesItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {seriesItem.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {seriesItem.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {seriesItem.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            seriesItem.status === 'ATIVO'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {seriesItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleOpenModal(seriesItem)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors text-xs"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(seriesItem.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors text-xs"
                        >
                          🗑️ Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando {(pagination.page - 1) * pagination.pageSize + 1} até{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
                {pagination.total} séries
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => fetchSeries(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchSeries(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingSeries ? 'Editar Série' : 'Adicionar Nova Série'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível *
                </label>
                <input
                  type="text"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="ex: FUNDAMENTAL, MÉDIO, SUPERIOR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  {editingSeries ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
