import { Geist } from "next/font/google";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PanelHeader from "@/components/PanelHeader";
import { getInsurance } from "@/lib/supabase-utils";
import type { Database } from "@/types/supabase";
import { getWhatsAppUrl } from "@/constants/contact";
import { useRouter } from "next/router";

const geist = Geist({
  subsets: ["latin"],
});

type Insurance = Database['public']['Tables']['insurance']['Row'];

export default function PainelSeguro() {
  const router = useRouter();
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        setLoading(true);
        const data = await getInsurance();
        setInsurances(data);
      } catch (err) {
        setError("Erro ao carregar solicitações de seguro");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurances();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleContact = (insurance: Insurance) => {
    const message = `Olá! Vi sua solicitação de seguro:

👤 Nome: ${insurance.name}
📧 Email: ${insurance.email}
📱 Telefone: ${insurance.phone}
📅 Data da Solicitação: ${formatDate(insurance.created_at)}

Gostaria de conversar sobre suas opções de seguro. Podemos agendar uma conversa?`;

    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  const handleViewDetails = (insuranceId: string) => {
    router.push(`/painel/detalhes-seguro/${insuranceId}`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={`${geist.className} min-h-screen bg-gray-50`}>
          <PanelHeader />
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={`${geist.className} min-h-screen bg-gray-50`}>
        <PanelHeader />
        
        <main className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header da Página */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Solicitações de Seguro
              </h1>
              <p className="text-gray-600">
                Gerencie todas as solicitações de seguro recebidas
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{insurances.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hoje</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {insurances.filter(i => {
                        const today = new Date().toDateString();
                        const insuranceDate = new Date(i.created_at).toDateString();
                        return today === insuranceDate;
                      }).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {insurances.filter(i => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(i.created_at) >= weekAgo;
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Solicitações */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Solicitações Recentes</h2>
              </div>

              {error && (
                <div className="p-6">
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                </div>
              )}

              {insurances.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma solicitação</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ainda não há solicitações de seguro.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {insurances.map((insurance) => (
                        <tr key={insurance.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{insurance.name}</div>
                              <div className="text-sm text-gray-500">{insurance.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {insurance.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(insurance.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pendente
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleContact(insurance)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Contatar
                            </button>
                            <button 
                              onClick={() => handleViewDetails(insurance.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
