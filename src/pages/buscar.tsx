import { Geist } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { getProperties } from "@/lib/supabase-utils";
import type { Database } from "@/types/supabase";
import Button from "@/components/Button";

const geist = Geist({
  subsets: ["latin"],
});

type Property = Database['public']['Tables']['properties']['Row'];

export default function BuscarImoveis() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters] = useState({
    region: router.query.region as string || "",
    propertyType: router.query.propertyType as string || "",
    bedrooms: router.query.bedrooms as string || "",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        let data = await getProperties();
        
        // Aplicar filtros se houver parâmetros na URL
        if (filters.region) {
          data = data.filter(property => property.region === filters.region);
        }
        if (filters.propertyType) {
          data = data.filter(property => property.property_type === filters.propertyType);
        }
        if (filters.bedrooms) {
          if (filters.bedrooms === '4+') {
            data = data.filter(property => property.bedrooms && property.bedrooms >= 4);
          } else {
            const bedrooms = parseInt(filters.bedrooms);
            data = data.filter(property => property.bedrooms === bedrooms);
          }
        }
        
        setProperties(data);
      } catch (err) {
        setError("Erro ao carregar imóveis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPriceDisplay = (property: Property) => {
    if (property.price_type === 'rent') {
      return `Aluguel de ${formatCurrency(property.price)}/mês`;
    }
    return formatCurrency(property.price);
  };

  const getPriceDetail = (property: Property) => {
    const details = [];
    if (property.condominium) {
      details.push(`Cond. ${formatCurrency(property.condominium)}`);
    }
    if (property.iptu) {
      details.push(`IPTU ${formatCurrency(property.iptu)}`);
    }
    return details.join(" • ");
  };



  if (loading) {
    return (
      <div className={`${geist.className} min-h-screen bg-gray-50`}>
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando imóveis...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${geist.className} min-h-screen bg-gray-50`}>
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header da Página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Imóveis Disponíveis
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mt-12">
            {properties.length} {properties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum imóvel encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há imóveis cadastrados no momento.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => router.push('/')}
                variant="secondary"
              >
                Voltar ao Início
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <Link key={property.id} href={`/imovel/${property.id}`} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow block">
                {/* Imagem da Propriedade */}
                <div className="relative">
                  {property.images && property.images.length > 0 ? (
                    <Image
                      src={property.images[0]}
                      alt={property.location}
                      width={320}
                      height={160}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/background.jpg';
                      }}
                    />
                  ) : (
                    <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      <span>Imagem da Propriedade</span>
                    </div>
                  )}
                </div>

                                  {/* Informações da Propriedade */}
                  <div className="p-4">
                    <div className="block mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-red-600 transition-colors">{property.location}</h3>
                      <p className="text-sm text-gray-600">{property.address}</p>
                    </div>

                  {/* Ícones de Detalhes */}
                  <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      <span>{property.area} m²</span>
                    </div>
                    {property.bedrooms !== null && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm0 0h14"></path>
                        </svg>
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms !== null && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11v8m0 0l3-3m-3 3l-3-3"></path>
                        </svg>
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    {property.garage !== null && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v7a3 3 0 003 3z"></path>
                        </svg>
                        <span>{property.garage}</span>
                      </div>
                    )}
                  </div>

                  {/* Preço */}
                  <p className="text-xl font-bold text-gray-800 mb-1">{getPriceDisplay(property)}</p>
                  {property.price_detail && (
                    <p className="text-sm text-green-600 flex items-center mb-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 16h2V8h-2V6h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2v2h2v2h-2v2z"/>
                      </svg>
                      {property.price_detail}
                    </p>
                  )}
                  {(property.condominium || property.iptu) && (
                    <p className="text-xs text-gray-500 mb-4">
                      {getPriceDetail(property)}
                    </p>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex flex-col space-y-2">
                    <a 
                      href={`https://wa.me/556130455454?text=${encodeURIComponent(`Olá! Estou interessado neste imóvel:

🆔 Código: ${property.id}
📍 ${property.location}
🏠 ${property.address}
📐 ${property.area} m²${property.bedrooms ? ` | ${property.bedrooms} quartos` : ''}${property.bathrooms ? ` | ${property.bathrooms} banheiros` : ''}${property.garage ? ` | ${property.garage} vaga(s)` : ''}
💰 ${getPriceDisplay(property)}${property.condominium ? ` | Cond. ${formatCurrency(property.condominium)}` : ''}${property.iptu ? ` | IPTU ${formatCurrency(property.iptu)}` : ''}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition-colors cursor-pointer text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Mensagem
                    </a>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
