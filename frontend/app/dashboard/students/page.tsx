'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Student {
  id: string;
  name: string;
  dateOfBirth: string;
  seriesId?: string;
  classId?: string;
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  cpf?: string;
}

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    seriesId: '',
    classId: '',
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '',
    cpf: '',
  });
  const [series, setSeries] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    fetchStudents(pagination.page);
    loadSeriesAndClasses();
  }, []);

  const loadSeriesAndClasses = async () => {
    try {
      const [seriesRes, classesRes] = await Promise.all([
        api.getSeries(1, 100),
        api.getClasses(1, 100),
      ]);
      if (seriesRes.data) setSeries(seriesRes.data);
      if (classesRes.data) setClasses(classesRes.data);
    } catch (error) {
      console.error('Failed to load series and classes:', error);
    }
  };

  const fetchStudents = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.getStudents(page, pagination.pageSize);
      if (response.data) {
        setStudents(response.data);
        if (response.pagination) {
          const { total, page: currentPage, limit, totalPages } = response.pagination;
          setPagination({
            total,
            page: currentPage,
            pageSize: limit ?? pagination.pageSize,
            totalPages,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchStudents(1);
      return;
    }

    try {
      setLoading(true);
      const response = await api.searchStudents(searchTerm);
      if (response.data) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error('Failed to search students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Converter data do formato ISO para DD/MM/YYYY (formato brasileiro)
  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  // Converter DD/MM/YYYY para YYYY-MM-DD (formato ISO para API)
  const parseBrazilianDate = (brDate: string): string => {
    if (!brDate) return '';
    // Remove caracteres não numéricos
    const cleaned = brDate.replace(/\D/g, '');
    if (cleaned.length !== 8) return '';

    const day = cleaned.substring(0, 2);
    const month = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);

    // Validar data
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (dayNum < 1 || dayNum > 31) return '';
    if (monthNum < 1 || monthNum > 12) return '';
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) return '';

    return `${year}-${month}-${day}`;
  };

  // Aplicar máscara DD/MM/YYYY enquanto digita
  const handleDateChange = (value: string) => {
    // Remove tudo que não é número
    let cleaned = value.replace(/\D/g, '');

    // Limita a 8 dígitos (DDMMYYYY)
    cleaned = cleaned.substring(0, 8);

    // Aplica a máscara
    let formatted = cleaned;
    if (cleaned.length >= 3) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length >= 5) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4) + '/' + cleaned.substring(4);
    }

    setFormData({ ...formData, dateOfBirth: formatted });
  };

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        dateOfBirth: formatDateForInput(student.dateOfBirth),
        seriesId: student.seriesId || '',
        classId: student.classId || '',
        guardianName: student.guardianName || '',
        guardianEmail: student.guardianEmail || '',
        guardianPhone: student.guardianPhone || '',
        cpf: student.cpf || '',
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        dateOfBirth: '',
        seriesId: '',
        classId: '',
        guardianName: '',
        guardianEmail: '',
        guardianPhone: '',
        cpf: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário enviado com dados:', formData);

    // Validação básica
    if (!formData.name || !formData.dateOfBirth || !formData.seriesId || !formData.classId) {
      alert('Por favor, preencha os campos obrigatórios: Nome, Data de Nascimento, Série e Turma');
      return;
    }

    // Converter data brasileira para ISO
    const isoDate = parseBrazilianDate(formData.dateOfBirth);
    if (!isoDate) {
      alert('Data de nascimento inválida. Use o formato DD/MM/AAAA');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        dateOfBirth: isoDate, // Envia no formato ISO para o backend
      };

      if (editingStudent) {
        console.log('Atualizando aluno:', editingStudent.id);
        await api.updateStudent(editingStudent.id, dataToSend);
        alert('Aluno atualizado com sucesso!');
      } else {
        console.log('Criando novo aluno...');
        const result = await api.createStudent(dataToSend);
        console.log('Resposta:', result);
        alert('Aluno adicionado com sucesso!');
      }
      handleCloseModal();
      fetchStudents(pagination.page);
    } catch (error) {
      console.error('Failed to save student:', error);
      alert(`Erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await api.deleteStudent(id);
        fetchStudents(pagination.page);
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Gestão de Alunos</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Adicionar Aluno
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar alunos por nome, email ou matrícula..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Pesquisar
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              fetchStudents(1);
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Limpar
          </button>
        )}
      </form>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Carregando alunos...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Nenhum aluno encontrado.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">
                      Matrícula
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">
                      Data de Nascimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.registration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(student.dateOfBirth).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.status === 'ATIVO'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleOpenModal(student)}
                          className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded transition-colors text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded transition-colors text-xs"
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
                {pagination.total} alunos
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => fetchStudents(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchStudents(pagination.page + 1)}
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
            <h2 className="text-2xl font-bold mb-4 font-heading">
              {editingStudent ? 'Editar Aluno' : 'Adicionar Novo Aluno'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento * (DD/MM/AAAA)
                </label>
                <input
                  type="text"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Digite a data no formato: 17/10/2015
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Série *
                </label>
                <select
                  value={formData.seriesId}
                  onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Selecione uma série</option>
                  {series.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turma *
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Selecione uma turma</option>
                  {classes.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email do Responsável
                </label>
                <input
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone do Responsável
                </label>
                <input
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition-colors font-heading"
                >
                  {editingStudent ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-2 rounded-lg transition-colors font-heading"
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
