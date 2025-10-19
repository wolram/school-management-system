'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  hireDate: string;
  specialization: string;
  salary: number;
  contractType: 'CLT' | 'PJ' | 'ESTAGIARIO' | 'TEMPORARIO';
  status: 'ATIVO' | 'INATIVO' | 'FERIAS' | 'LICENCA';
  active: boolean;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    hireDate: '',
    specialization: '',
    salary: '',
    contractType: 'CLT' as 'CLT' | 'PJ' | 'ESTAGIARIO' | 'TEMPORARIO',
    status: 'ATIVO' as 'ATIVO' | 'INATIVO' | 'FERIAS' | 'LICENCA',
  });

  useEffect(() => {
    fetchTeachers(pagination.page);
  }, []);

  const fetchTeachers = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.getTeachers(page, pagination.pageSize);
      if (response.data) {
        setTeachers(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone || '',
        dateOfBirth: teacher.dateOfBirth.split('T')[0],
        hireDate: teacher.hireDate.split('T')[0],
        specialization: teacher.specialization,
        salary: teacher.salary.toString(),
        contractType: teacher.contractType,
        status: teacher.status,
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        hireDate: '',
        specialization: '',
        salary: '',
        contractType: 'CLT',
        status: 'ATIVO',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.dateOfBirth || !formData.hireDate || !formData.specialization || !formData.salary) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const data = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        hireDate: new Date(formData.hireDate).toISOString(),
        specialization: formData.specialization,
        salary: parseFloat(formData.salary),
        contractType: formData.contractType,
        status: formData.status,
      };

      if (editingTeacher) {
        await api.updateTeacher(editingTeacher.id, data);
        alert('Professor atualizado com sucesso!');
      } else {
        await api.createTeacher(data);
        alert('Professor criado com sucesso!');
      }
      handleCloseModal();
      fetchTeachers(pagination.page);
    } catch (error) {
      console.error('Failed to save teacher:', error);
      alert(`Erro ao salvar professor: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        await api.deleteTeacher(id);
        fetchTeachers(pagination.page);
      } catch (error) {
        console.error('Failed to delete teacher:', error);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Professores</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          ➕ Adicionar Professor
        </button>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Carregando professores...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhum professor encontrado.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contrato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {teacher.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {teacher.contractType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatCurrency(teacher.salary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            teacher.status === 'ATIVO'
                              ? 'bg-green-100 text-green-800'
                              : teacher.status === 'FERIAS'
                              ? 'bg-blue-100 text-blue-800'
                              : teacher.status === 'LICENCA'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {teacher.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleOpenModal(teacher)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors text-xs"
                        >
                          Excluir
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
                {pagination.total} professores
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => fetchTeachers(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchTeachers(pagination.page + 1)}
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingTeacher ? 'Editar Professor' : 'Adicionar Novo Professor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade *</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    required
                    placeholder="Ex: Matemática, Português"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Admissão *</label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salário *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    required
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato *</label>
                  <select
                    value={formData.contractType}
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="ESTAGIARIO">Estagiário</option>
                    <option value="TEMPORARIO">Temporário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                    <option value="FERIAS">Férias</option>
                    <option value="LICENCA">Licença</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  {editingTeacher ? 'Atualizar' : 'Criar'}
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
