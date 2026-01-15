import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { Plus, Edit2, Trash2, Users, Star, TrendingUp, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const DashboardPrestador = () => {
  const [activeTab, setActiveTab] = useState('rotas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    rota: '',
    horarioManha: '',
    horarioTarde: '',
    horarioNoite: '',
    vagas: '',
    valor: '',
  });

  const rotas = [
    {
      id: 1,
      nome: 'Van Escolar Central',
      rota: 'Centro → UNICENTRO',
      horarios: 'Manhã: 06:30 | Tarde: 13:00',
      vagas: 3,
      ocupacao: 12,
      total: 15,
      avaliacao: 4.8,
      ativa: true,
    },
    {
      id: 2,
      nome: 'Transporte Noturno',
      rota: 'Centro → IFPR',
      horarios: 'Noite: 18:00',
      vagas: 5,
      ocupacao: 8,
      total: 13,
      avaliacao: 4.9,
      ativa: true,
    },
  ];

  const estatisticas = {
    totalRotas: 2,
    totalPassageiros: 20,
    avaliacaoMedia: 4.85,
    ocupacaoMedia: 71,
  };

  const avaliacoes = [
    {
      id: 1,
      cliente: 'Maria Silva',
      nota: 5,
      comentario: 'Excelente serviço, sempre pontual!',
      data: '10/01/2025',
      rota: 'Van Escolar Central',
    },
    {
      id: 2,
      cliente: 'João Santos',
      nota: 4,
      comentario: 'Muito bom, motorista educado.',
      data: '08/01/2025',
      rota: 'Transporte Noturno',
    },
  ];

  const handleAddRota = () => {
    console.log('Adicionar rota:', formData);
    setShowAddModal(false);
    setFormData({
      nome: '',
      rota: '',
      horarioManha: '',
      horarioTarde: '',
      horarioNoite: '',
      vagas: '',
      valor: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenAuth={() => {}} />

      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Painel do Prestador</h1>
          <p className="text-purple-100">Gerencie suas rotas e serviços</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {estatisticas.totalRotas}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Rotas Ativas</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {estatisticas.totalPassageiros}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Passageiros</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {estatisticas.avaliacaoMedia.toFixed(1)}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Avaliação Média</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {estatisticas.ocupacaoMedia}%
              </span>
            </div>
            <p className="text-gray-600 text-sm">Ocupação Média</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('rotas')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === 'rotas'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Minhas Rotas
              </button>
              <button
                onClick={() => setActiveTab('avaliacoes')}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === 'avaliacoes'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Star className="w-5 h-5" />
                Avaliações
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'rotas' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Gerenciar Rotas ({rotas.length})
                  </h2>
                  <Button
                    variant="primary"
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Nova Rota
                  </Button>
                </div>

                <div className="space-y-4">
                  {rotas.map((rota) => (
                    <div
                      key={rota.id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {rota.nome}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                rota.ativa
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {rota.ativa ? 'Ativa' : 'Inativa'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">{rota.rota}</p>
                          <p className="text-sm text-gray-500">{rota.horarios}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Ocupação</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {rota.ocupacao}/{rota.total}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: `${(rota.ocupacao / rota.total) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Vagas Disponíveis</p>
                          <p className="text-2xl font-bold text-green-600">{rota.vagas}</p>
                        </div>

                        <div className="bg-white p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Avaliação</p>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-2xl font-bold text-gray-900">
                              {rota.avaliacao.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'avaliacoes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Avaliações Recebidas ({avaliacoes.length})
                </h2>

                <div className="space-y-4">
                  {avaliacoes.map((avaliacao) => (
                    <div
                      key={avaliacao.id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {avaliacao.cliente}
                          </h3>
                          <p className="text-sm text-gray-500">{avaliacao.rota}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= avaliacao.nota
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{avaliacao.comentario}</p>
                      <p className="text-xs text-gray-500">{avaliacao.data}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Adicionar Rota */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Adicionar Nova Rota"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nome da Van"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Van Escolar Central"
            required
          />

          <Input
            label="Rota"
            value={formData.rota}
            onChange={(e) => setFormData({ ...formData, rota: e.target.value })}
            placeholder="Ex: Centro → UNICENTRO"
            required
          />

          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Horário Manhã"
              type="time"
              value={formData.horarioManha}
              onChange={(e) =>
                setFormData({ ...formData, horarioManha: e.target.value })
              }
            />
            <Input
              label="Horário Tarde"
              type="time"
              value={formData.horarioTarde}
              onChange={(e) =>
                setFormData({ ...formData, horarioTarde: e.target.value })
              }
            />
            <Input
              label="Horário Noite"
              type="time"
              value={formData.horarioNoite}
              onChange={(e) =>
                setFormData({ ...formData, horarioNoite: e.target.value })
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Vagas Totais"
              type="number"
              value={formData.vagas}
              onChange={(e) => setFormData({ ...formData, vagas: e.target.value })}
              placeholder="15"
              required
            />
            <Input
              label="Valor Mensal (R$)"
              type="number"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              placeholder="250.00"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleAddRota} className="flex-1">
              Adicionar Rota
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default DashboardPrestador;