import React from 'react';

// Interface para as propriedades de cada card
interface PropertyCard {
  id: number;
  tag: string;
  title: string;
  description: string;
  imagePlaceholderColor: string;
}

// Componente individual do card
const PropertyCard: React.FC<{ card: PropertyCard }> = ({ card }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      {/* Imagem de fundo (div vazia) */}
      <div className="relative">
        <div className={`h-48 ${card.imagePlaceholderColor} flex items-center justify-center text-gray-500 text-sm`}>
          {/* Placeholder para a imagem */}
          <span>Imagem do Imóvel</span>
        </div>
        
        {/* Tag overlay no canto superior esquerdo */}
        <div className="absolute top-3 left-3">
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            {card.tag}
          </span>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
      </div>
    </div>
  );
};

// Componente principal da seção
const SearchProperty: React.FC = () => {
  // Dados dos cards conforme especificado
  const propertyCards: PropertyCard[] = [
    {
      id: 1,
      tag: "Aluguel até R$1000",
      title: "Aluguel até R$1.000?",
      description: "Encontre imóveis que cabem no seu bolso.",
      imagePlaceholderColor: "bg-gray-200"
    },
    {
      id: 2,
      tag: "Mobiliado",
      title: "Mobiliado do seu jeito",
      description: "Imóveis já mobiliados pra você mudar agora.",
      imagePlaceholderColor: "bg-gray-300"
    },
    {
      id: 3,
      tag: "Aceita pets",
      title: "Para você e seu Pet",
      description: "Casas e apês que aceitam seu pet de braços abertos. Só no Zap você encontra.",
      imagePlaceholderColor: "bg-gray-200"
    },
    {
      id: 4,
      tag: "Aluguel sem fiador",
      title: "Aluguel sem fiador",
      description: "Aluguel sem papelada e 100% online. Só no Zap você encontra.",
      imagePlaceholderColor: "bg-gray-300"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título Principal da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Encontre o imóvel <span className="relative">
              ideal
              <div className="absolute bottom-0 left-0 w-full h-1 bg-red-700 rounded-full"></div>
            </span> para seu estilo de vida
          </h2>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {propertyCards.map(card => (
            <PropertyCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchProperty;
