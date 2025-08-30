import { Geist } from "next/font/google";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PanelHeader from "@/components/PanelHeader";
import Button from "@/components/Button";
import { getFinancing } from "@/lib/supabase-utils";
import type { Database } from "@/types/supabase";
import { useRouter } from "next/router";

const geist = Geist({
  subsets: ["latin"],
});

type Financing = Database['public']['Tables']['financing']['Row'];

export default function DetalhesFinanciamento() {
  const router = useRouter();
  const { id } = router.query;
  const [financing, setFinancing] = useState<Financing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancing = async () => {
      if (id) {
        try {
          setLoading(true);
          const financings = await getFinancing();
          const foundFinancing = financings.find(f => f.id === id);
          
          if (foundFinancing) {
            setFinancing(foundFinancing);
          } else {
            setError("Solicitação de financiamento não encontrada");
          }
        } catch (err) {
          setError("Erro ao carregar solicitação de financiamento");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFinancing();
  }, [id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleContact = () => {
    if (!financing) return;

    const message = `Olá! Vi sua solicitação de financiamento:

👤 Nome: ${financing.name}
📧 Email: ${financing.email}
📱 Telefone: ${financing.phone}
💰 Valor do Imóvel: ${formatCurrency(financing.property_value)}
💵 Entrada: ${formatCurrency(financing.down_payment)}
⏰ Prazo: ${financing.term_years} anos
📅 Data da Solicitação: ${formatDate(financing.created_at)}

Gostaria de conversar sobre suas opções de financiamento. Podemos agendar uma conversa?`;

    // Usar o número do registro do banco
    const phoneNumber = financing.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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

  if (error || !financing) {
    return (
      <ProtectedRoute>
        <div className={`${geist.className} min-h-screen bg-gray-50`}>
          <PanelHeader />
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Erro</h1>
              <p className="text-gray-600 mb-6">{error || "Solicitação não encontrada"}</p>
              <Button
                onClick={() => router.push('/painel/financiamento')}
                variant="secondary"
              >
                Voltar para Lista
              </Button>
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
          <div className="max-w-4xl mx-auto">
            {/* Header da Página */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Detalhes da Solicitação de Financiamento
                  </h1>
                  <p className="text-gray-600">
                    Informações completas da solicitação
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleContact}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Contatar via WhatsApp
                  </Button>
                  <Button
                    onClick={() => router.push('/painel/financiamento')}
                    variant="secondary"
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            </div>

            {/* Card Principal */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header do Card */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Solicitação #{financing.id.slice(0, 8)}
                      </h2>
                      <p className="text-green-100">
                        Criada em {formatDate(financing.created_at)}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pendente
                  </span>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6">
                {/* Informações do Cliente */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Informações do Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Nome</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{financing.name}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Email</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{financing.email}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Telefone</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{financing.phone}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Data da Solicitação</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(financing.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Informações do Financiamento */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Detalhes do Financiamento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Valor do Imóvel</span>
                      </div>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(financing.property_value)}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Entrada</span>
                      </div>
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(financing.down_payment)}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Prazo</span>
                      </div>
                      <p className="text-xl font-bold text-purple-600">{financing.term_years} anos</p>
                    </div>
                  </div>

                  {/* Cálculos */}
                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-blue-900 mb-3">Cálculos do Financiamento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-blue-700">Valor a Financiar:</span>
                        <p className="text-lg font-semibold text-blue-900">
                          {formatCurrency(financing.property_value - financing.down_payment)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-blue-700">Percentual de Entrada:</span>
                        <p className="text-lg font-semibold text-blue-900">
                          {((financing.down_payment / financing.property_value) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ID da Solicitação */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    Informações Técnicas
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">ID da Solicitação</span>
                    </div>
                    <p className="text-sm font-mono text-gray-600 bg-white px-3 py-2 rounded border">
                      {financing.id}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Ações
                  </h3>
                  <div className="flex flex-wrap gap-3">
                                         <Button
                       onClick={handleContact}
                       className="bg-green-600 hover:bg-green-700"
                     >
                        <div className="flex items-center gap-2">
                       <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                       </svg>
                       Contatar via WhatsApp
                       </div>
                     </Button>
                                         <Button
                       onClick={() => router.push('/painel/financiamento')}
                       variant="secondary"
                     >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Voltar para Lista
                       </div>
                     </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
