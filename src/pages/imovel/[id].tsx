import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { getPropertyById } from '@/lib/supabase-utils';
import type { Database } from '@/types/supabase';

type Property = Database['public']['Tables']['properties']['Row'];

export default function ImovelDetalhes() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (id) {
        try {
          setLoading(true);
          const foundProperty = await getPropertyById(id as string);
          setProperty(foundProperty || null);
        } catch (error) {
          console.error('Erro ao carregar imóvel:', error);
          setProperty(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProperty();
  }, [id]);

  const nextImage = () => {
    if (property && property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

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

  const handleWhatsAppContact = () => {
    if (property) {
      const message = `Olá! Estou interessado neste imóvel:

🆔 Código: ${property.id}
🏠 ${property.title}
📍 ${property.location}
🏢 ${property.address}
📐 ${property.area} m²${property.bedrooms ? ` | ${property.bedrooms} quartos` : ''}${property.bathrooms ? ` | ${property.bathrooms} banheiros` : ''}${property.garage ? ` | ${property.garage} vaga(s)` : ''}
💰 ${getPriceDisplay(property)}${property.condominium ? ` | Cond. ${formatCurrency(property.condominium)}` : ''}${property.iptu ? ` | IPTU ${formatCurrency(property.iptu)}` : ''}`;
      
      window.open(`https://wa.me/${property.contact_whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando detalhes do imóvel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Imóvel não encontrado</h1>
            <p className="text-gray-600 mb-6">O imóvel que você está procurando não foi encontrado.</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition-colors"
            >
              Voltar para a página inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Conteúdo Principal */}
      <div className="pt-20">
        {/* Galeria de Imagens */}
        <div className="relative h-96 md:h-[500px] bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[currentImageIndex]}
              alt={property.title}
              width={800}
              height={500}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span>Imagem do Imóvel</span>
            </div>
          )}
          
          {/* Navegação de Imagens */}
          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Indicadores de Imagem */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Informações do Imóvel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2">
              {/* Título e Localização */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
                <p className="text-lg text-gray-600 mb-1">{property.location}</p>
                <p className="text-gray-500">{property.address}</p>
              </div>

              {/* Preço */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{getPriceDisplay(property)}</p>
                    {property.price_detail && (
                      <p className="text-green-600 flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 16h2V8h-2V6h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2v2h2v2h-2v2z"/>
                        </svg>
                        {property.price_detail}
                      </p>
                    )}
                    {(property.condominium || property.iptu) && (
                      <p className="text-sm text-gray-500 mt-2">
                        {property.condominium && `Condomínio: ${formatCurrency(property.condominium)}`}
                        {property.condominium && property.iptu && " • "}
                        {property.iptu && `IPTU: ${formatCurrency(property.iptu)}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Características Principais */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Características</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-gray-700">{property.area} m²</span>
                  </div>
                  {property.bedrooms !== null && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm0 0h14" />
                      </svg>
                      <span className="text-gray-700">{property.bedrooms} quarto{property.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.bathrooms !== null && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11v8m0 0l3-3m-3 3l-3-3" />
                      </svg>
                      <span className="text-gray-700">{property.bathrooms} banheiro{property.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {property.garage !== null && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v7a3 3 0 003 3z" />
                      </svg>
                      <span className="text-gray-700">{property.garage} vaga{property.garage > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Descrição</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Diferenciais */}
              {property.features && property.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Diferenciais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contato */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Interessado neste imóvel?</h3>
                
                {/* Botão WhatsApp */}
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors mb-4 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Falar no WhatsApp
                </button>

                {/* Telefone */}
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm mb-1">Ou ligue para:</p>
                  <a 
                    href={`tel:${property.contact_phone}`}
                    className="text-xl font-semibold text-gray-800 hover:text-red-700 transition-colors"
                  >
                    {property.contact_phone}
                  </a>
                </div>

                {/* Código do Imóvel */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">Código do imóvel:</p>
                  <p className="text-lg font-semibold text-gray-800">#{property.id.toString().padStart(4, '0')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
