'use client';

import React, { useEffect, useState } from 'react';
import { api, Price } from '@/lib/api';

type PriceType = 'MENSALIDADE' | 'SERVICO' | 'HORA_EXTRA';

interface FormData {
  type: PriceType;
  seriesId: string;
  serviceName: string;
  value: string;
  valuePerHour: string;
  effectiveDate: string;
}

export default function PricesPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [filterActive, setFilterActive] = useState<string>('true');

  const [formData, setFormData] = useState<FormData>({
    type: 'MENSALIDADE',
    seriesId: '',
    serviceName: '',
    value: '',
    valuePerHour: '',
    effectiveDate: new Date().toISOString().split('T')[0],
  });

  const [series, setSeries] = useState<any[]>([]);

  useEffect(() => {
    fetchPrices();
    loadSeries();
  }, [filterType, filterActive]);

  const loadSeries = async () => {
    try {
      const response = await api.getSeries(1, 100);
      if (response.data) setSeries(response.data);
    } catch (error) {
      console.error('Failed to load series:', error);
    }
  };

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filterType) filters.type = filterType;
      if (filterActive) filters.active = filterActive;

      const response = await api.getPrices(filters);
      if (response.data) {
        setPrices(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (price?: Price) => {
    if (price) {
      setEditingPrice(price);
      setFormData({
        type: price.type,
        seriesId: price.seriesId || '',
        serviceName: price.serviceName || '',
        value: price.value.toString(),
        valuePerHour: price.valuePerHour?.toString() || '',
        effectiveDate: price.effectiveDate.split('T')[0],
      });
    } else {
      setEditingPrice(null);
      setFormData({
        type: 'MENSALIDADE',
        seriesId: '',
        serviceName: '',
        value: '',
        valuePerHour: '',
        effectiveDate: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPrice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: any = {
        type: formData.type,
        value: parseFloat(formData.value),
        effectiveDate: formData.effectiveDate,
      };

      if (formData.type === 'MENSALIDADE') {
        data.seriesId = formData.seriesId;
      } else if (formData.type === 'SERVICO') {
        data.serviceName = formData.serviceName;
      } else if (formData.type === 'HORA_EXTRA') {
        data.valuePerHour = parseFloat(formData.valuePerHour);
      }

      if (editingPrice) {
        await api.updatePrice(editingPrice.id, data);
      } else {
        await api.createPrice(data);
      }

      handleCloseModal();
      fetchPrices();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar preço');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja desativar este preço?')) {
      try {
        await api.deletePrice(id);
        fetchPrices();
      } catch (error: any) {
        alert(error.message || 'Erro ao desativar preço');
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTypeLabel = (type: PriceType) => {
    const labels = {
      MENSALIDADE: 'Mensalidade',
      SERVICO: 'Serviço',
      HORA_EXTRA: 'Hora Extra',
    };
    return labels[type];
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Preços</h1>
        <p className="text-gray-600">Gerencie mensalidades, serviços e valores de horas extras</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="MENSALIDADE">Mensalidade</option>
              <option value="SERVICO">Serviço</option>
              <option value="HORA_EXTRA">Hora Extra</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleOpenModal()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Novo Preço
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vigência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prices.map((price) => (
                <tr key={price.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getTypeLabel(price.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {price.type === 'MENSALIDADE' && price.series && (
                      <div>
                        <div className="font-medium">{price.series.name}</div>
                        <div className="text-sm text-gray-500">{price.series.segment.name}</div>
                      </div>
                    )}
                    {price.type === 'SERVICO' && (
                      <div className="font-medium">{price.serviceName}</div>
                    )}
                    {price.type === 'HORA_EXTRA' && (
                      <div className="font-medium">Valor por Hora</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold">{formatCurrency(price.value)}</div>
                    {price.type === 'HORA_EXTRA' && price.valuePerHour && (
                      <div className="text-sm text-gray-500">R$ {price.valuePerHour}/hora</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(price.effectiveDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        price.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {price.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(price)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    {price.active && (
                      <button
                        onClick={() => handleDelete(price.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Desativar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && prices.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum preço encontrado. Clique em &quot;Novo Preço&quot; para começar.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingPrice ? 'Editar Preço' : 'Novo Preço'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as PriceType })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="MENSALIDADE">Mensalidade</option>
                  <option value="SERVICO">Serviço</option>
                  <option value="HORA_EXTRA">Hora Extra</option>
                </select>
              </div>

              {formData.type === 'MENSALIDADE' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Série *</label>
                  <select
                    value={formData.seriesId}
                    onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Selecione uma série</option>
                    {series.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.type === 'SERVICO' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    value={formData.serviceName}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ex: Almoço, Judô, etc."
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {formData.type === 'HORA_EXTRA' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor por Hora (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valuePerHour}
                    onChange={(e) =>
                      setFormData({ ...formData, valuePerHour: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Vigência *
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) =>
                    setFormData({ ...formData, effectiveDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {editingPrice ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
