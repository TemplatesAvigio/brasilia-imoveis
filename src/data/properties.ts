// Interface para as propriedades de um imóvel
export interface Property {
  id: number;
  location: string;
  address: string;
  area: string;
  bedrooms: number | null;
  bathrooms: number | null;
  garage: number | null;
  price: string;
  condominium: string | null;
  iptu: string | null;
  priceDetail: string | null;
  imagePlaceholderColor: string;
}

// Interface para os detalhes completos do imóvel
export interface PropertyDetails extends Property {
  title: string;
  description: string;
  features: string[];
  images: string[];
  contactPhone: string;
  contactWhatsApp: string;
}

// Dados dos imóveis para a página inicial
export const properties: Property[] = [
  {
    id: 1,
    location: "Setor Sudoeste, Brasília",
    address: "SQSW 504 Bloco K",
    area: "75 m²",
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    price: "Aluguel de R$ 4.900/mês",
    condominium: "R$ 850",
    iptu: "R$ 385",
    priceDetail: null,
    imagePlaceholderColor: "bg-gray-200"
  },
  {
    id: 2,
    location: "Setor Noroeste, Brasília",
    address: "SQNW 310 Bloco I",
    area: "298 m²",
    bedrooms: 4,
    bathrooms: 6,
    garage: 3,
    price: "R$ 4.000.000",
    condominium: "R$ 2.300",
    iptu: "R$ 4.500",
    priceDetail: null,
    imagePlaceholderColor: "bg-gray-300"
  },
  {
    id: 3,
    location: "Setor Sudoeste, Brasília",
    address: "SQSW 305 Bloco L",
    area: "82 m²",
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    price: "R$ 860.000",
    condominium: "R$ 750",
    iptu: "R$ 420",
    priceDetail: "$ Preço abaixo do mercado",
    imagePlaceholderColor: "bg-gray-200"
  },
  {
    id: 4,
    location: "Asa Sul, Brasília",
    address: "SRTVS",
    area: "79 m²",
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    price: "R$ 545.000",
    condominium: "R$ 805",
    iptu: "R$ 380",
    priceDetail: null,
    imagePlaceholderColor: "bg-gray-300"
  }
];

// Dados completos dos imóveis para a página de detalhes
export const propertiesDetails: PropertyDetails[] = [
  {
    id: 1,
    title: "Apartamento Moderno no Setor Sudoeste",
    location: "Setor Sudoeste, Brasília",
    address: "SQSW 504 Bloco K, Apartamento 101",
    area: "75 m²",
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    price: "Aluguel de R$ 4.900/mês",
    condominium: "R$ 850",
    iptu: "R$ 385",
    priceDetail: null,
    imagePlaceholderColor: "bg-gray-200",
    description: "Apartamento moderno e bem localizado no Setor Sudoeste, próximo a comércios, escolas e transporte público. Imóvel em excelente estado de conservação, com acabamento de qualidade e mobiliado.",
    features: [
      "Ar condicionado",
      "Armários embutidos",
      "Sacada gourmet",
      "Piscina",
      "Academia",
      "Salão de festas",
      "Portaria 24h",
      "Vaga coberta"
    ],
    images: ["/background.jpg", "/background.jpg", "/background.jpg"],
    contactPhone: "(61) 3045-5454",
    contactWhatsApp: "556130455454"
  },
  {
    id: 2,
    title: "Casa Luxuosa no Setor Noroeste",
    location: "Setor Noroeste, Brasília",
    address: "SQNW 310 Bloco I, Casa 15",
    area: "298 m²",
    bedrooms: 4,
    bathrooms: 6,
    garage: 3,
    price: "R$ 4.000.000",
    condominium: "R$ 2.300",
    iptu: "R$ 4.500",
    priceDetail: null,
    imagePlaceholderColor: "bg-gray-300",
    description: "Casa luxuosa com acabamento de alto padrão no Setor Noroeste. Imóvel com ampla área útil, jardim privativo e todas as comodidades para uma família moderna.",
    features: [
      "Jardim privativo",
      "Churrasqueira",
      "Home theater",
      "Escritório",
      "Lavanderia",
      "Depósito",
      "Área gourmet",
      "Quarto de serviço"
    ],
    images: ["/background.jpg", "/background.jpg", "/background.jpg"],
    contactPhone: "(61) 3045-5454",
    contactWhatsApp: "556130455454"
  },
  {
    id: 3,
    title: "Apartamento em Condomínio Fechado",
    location: "Setor Sudoeste, Brasília",
    address: "SQSW 305 Bloco L, Apartamento 205",
    area: "82 m²",
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    price: "R$ 860.000",
    condominium: "R$ 750",
    iptu: "R$ 420",
    priceDetail: "$ Preço abaixo do mercado",
    imagePlaceholderColor: "bg-gray-200",
    description: "Apartamento em condomínio fechado com excelente localização. Imóvel com acabamento de qualidade e infraestrutura completa para toda a família.",
    features: [
      "Condomínio fechado",
      "Segurança 24h",
      "Piscina",
      "Quadra esportiva",
      "Playground",
      "Área gourmet",
      "Salão de festas",
      "Vaga coberta"
    ],
    images: ["/background.jpg", "/background.jpg", "/background.jpg"],
    contactPhone: "(61) 3045-5454",
    contactWhatsApp: "556130455454"
  },
  {
    id: 4,
    title: "Apartamento na Asa Sul",
    location: "Asa Sul, Brasília",
    address: "SRTVS Quadra 701, Bloco A, Apartamento 301",
    area: "79 m²",
    bedrooms: 2,
    bathrooms: 2,
    garage: 1,
    price: "R$ 545.000",
    condominium: "R$ 805",
    iptu: "R$ 380",
    priceDetail: null,
    imagePlaceholderColor: "bg-gray-300",
    description: "Apartamento bem localizado na Asa Sul, próximo ao centro comercial e com fácil acesso ao transporte público. Imóvel em bom estado de conservação.",
    features: [
      "Localização privilegiada",
      "Próximo ao metrô",
      "Armários embutidos",
      "Sacada",
      "Portaria",
      "Vaga descoberta",
      "Área comum",
      "Próximo a comércios"
    ],
    images: ["/background.jpg", "/background.jpg", "/background.jpg"],
    contactPhone: "(61) 3045-5454",
    contactWhatsApp: "556130455454"
  }
];

// Função para buscar um imóvel por ID
export const getPropertyById = (id: number): PropertyDetails | undefined => {
  return propertiesDetails.find(property => property.id === id);
};
