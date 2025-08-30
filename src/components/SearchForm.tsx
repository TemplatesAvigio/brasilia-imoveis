import Button from "./Button";
import { BRASILIA_REGIONS } from "@/constants/regions";
import { PROPERTY_TYPES } from "@/constants/propertyTypes";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SearchForm() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    region: "",
    propertyType: "",
    bedrooms: "",
  });

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    if (filters.region) queryParams.append('region', filters.region);
    if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
    if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/buscar?${queryString}` : '/buscar';
    
    router.push(url);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Campo de Localização */}
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <select
            className="w-full bg-white text-black px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          >
            <option value="">Selecione a região</option>
            {BRASILIA_REGIONS.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Campo de Tipo de Imóvel */}
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <select
            className="w-full bg-white text-black px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
          >
            <option value="">Tipo de imóvel</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Campo de Quantidade de Quartos */}
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
          </div>
          <select
            className="w-full bg-white text-black px-12 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
          >
            <option value="">Quartos</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4+">4+</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Botão de Busca */}
        <Button variant="primary" onClick={handleSearch} className="cursor-pointer">Buscar Imóveis</Button>
      </div>
    </div>
  );
}
