'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Segment {
  id: string;
  name: string;
  code: string;
  description: string;
  status: string;
}

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'ATIVO',
  });

  useEffect(() => {
    fetchSegments(pagination.page);
  }, []);

  const fetchSegments = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.getSegments(page, pagination.pageSize);
      if (response.data) {
        setSegments(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch segments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (segment?: Segment) => {
    if (segment) {
      setEditingSegment(segment);
      setFormData({
        name: segment.name,
        code: segment.code,
        description: segment.description,
        status: segment.status,
      });
    } else {
      setEditingSegment(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        status: 'ATIVO',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSegment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSegment) {
        await api.updateSegment(editingSegment.id, formData);
      } else {
        await api.createSegment(formData);
      }
      handleCloseModal();
      fetchSegments(pagination.page);
    } catch (error) {
      console.error('Failed to save segment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este segmento?')) {
      try {
        await api.deleteSegment(id);
        fetchSegments(pagination.page);
      } catch (error) {
        console.error('Failed to delete segment:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Segmentos</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          ➕ Adicionar Segmento
        </button>
      </div>

      {/* Segments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Carregando segmentos...</p>
          </div>
        ) : segments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhum segmento encontrado.</p>
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
                      Descrição
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
                  {segments.map((segment) => (
                    <tr key={segment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {segment.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {segment.code}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {segment.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            segment.status === 'ATIVO'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {segment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleOpenModal(segment)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors text-xs"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(segment.id)}
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
                {pagination.total} segmentos
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => fetchSegments(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchSegments(pagination.page + 1)}
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
              {editingSegment ? 'Editar Segmento' : 'Adicionar Novo Segmento'}
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
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
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
                  {editingSegment ? 'Atualizar' : 'Criar'}
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
