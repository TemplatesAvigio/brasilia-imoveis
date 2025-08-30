import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProperties } from '@/lib/supabase-utils';
import type { Database } from '@/types/supabase';

type Property = Database['public']['Tables']['properties']['Row'];

// Componente individual do cartão de propriedade
const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <Link href={`/imovel/${property.id}`} className="flex-none w-80 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 snap-center hover:shadow-lg transition-shadow block">
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
        <div className="block">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-red-600 transition-colors">{property.location}</h3>
          <p className="text-sm text-gray-600 mb-3">{property.address}</p>
        </div>

        {/* Ícones de Detalhes */}
        <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
          <div className="flex items-center">
            {/* Ícone de Área (Casa) */}
            <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                <span>{property.area} m²</span>
          </div>
          {property.bedrooms !== null && (
            <div className="flex items-center">
              {/* Ícone de Cama (Quartos) */}
              <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm0 0h14"></path></svg>
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms !== null && (
            <div className="flex items-center">
              {/* Ícone de Chuveiro (Banheiros) */}
              <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11v8m0 0l3-3m-3 3l-3-3"></path></svg>
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.garage !== null && (
            <div className="flex items-center">
              {/* Ícone de Carro (Vagas de Garagem) */}
              <svg className="w-4 h-4 mr-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v7a3 3 0 003 3z"></path></svg>
              <span>{property.garage}</span>
            </div>
          )}
        </div>

        {/* Preço/Aluguel */}
        <p className="text-xl font-bold text-gray-800 mb-1">
          {property.price_type === 'rent' 
            ? `Aluguel de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}/mês`
            : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)
          }
        </p>
        {property.price_detail && (
          <p className="text-sm text-green-600 flex items-center mb-1">
            {/* Ícone de Cifrão */}
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 16h2V8h-2V6h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2v2h2v2h-2v2z"/></svg>
            {property.price_detail}
          </p>
        )}
        {(property.condominium || property.iptu) && (
          <p className="text-xs text-gray-500 mb-4">
            {property.condominium && `Cond. ${property.condominium}`}
            {property.condominium && property.iptu && " • "}
            {property.iptu && `IPTU ${property.iptu}`}
          </p>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-col space-y-2">
          <a 
            href={`https://wa.me/556130455454?text=${encodeURIComponent(`Olá! Estou interessado neste imóvel:

🆔 Código: ${property.id}
📍 ${property.location}
🏠 ${property.address}
📐 ${property.area}${property.bedrooms ? ` | ${property.bedrooms} quartos` : ''}${property.bathrooms ? ` | ${property.bathrooms} banheiros` : ''}${property.garage ? ` | ${property.garage} vaga(s)` : ''}
💰 ${property.price}${property.condominium ? ` | Cond. ${property.condominium}` : ''}${property.iptu ? ` | IPTU ${property.iptu}` : ''}`)}`}
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
  );
};

// Componente principal da seção de imóveis
const PropertyCardSection: React.FC = () => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getProperties();
        
        // Embaralhar os imóveis para mostrar aleatoriamente
        const shuffledProperties = data.sort(() => Math.random() - 0.5);
        
        // Pegar apenas os primeiros 8 imóveis para não sobrecarregar
        setProperties(shuffledProperties.slice(0, 8));
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título da Seção */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">Imóveis que você pode gostar</h2>
          <div className="w-20 h-1 bg-red-700 mx-auto rounded-full"></div>
        </div>

        {/* Container de Cartões e Navegação */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando imóveis...</p>
              </div>
            </div>
          ) : properties.length > 0 ? (
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-scroll scrollbar-hide space-x-6 pb-4 snap-x snap-mandatory"
            >
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum imóvel disponível no momento.</p>
            </div>
          )}

          {/* Navegação da Seção (Inferior Direita) */}
          {!loading && properties.length > 0 && (
            <div className="absolute -bottom-10 right-0 flex space-x-2 mt-4 md:mt-0">
              <button
                className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none transition-colors cursor-pointer"
                onClick={scrollLeft}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button
                className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none transition-colors cursor-pointer"
                onClick={scrollRight}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyCardSection;
