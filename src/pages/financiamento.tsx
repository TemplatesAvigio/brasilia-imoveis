import { Geist } from "next/font/google";
import { useState } from "react";
import Button from "@/components/Button";
import { useFinancing } from "@/hooks/useSupabase";
import { applyPhoneMask, removePhoneMask, applyCurrencyMask, removeCurrencyMask } from "@/utils/masks";

const geist = Geist({
  subsets: ["latin"],
});

export default function Financiamento() {
  const { createFinancing, loading, error } = useFinancing();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    valor: "",
    entrada: "",
    prazo: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await createFinancing({
        name: formData.nome,
        email: formData.email,
        phone: removePhoneMask(formData.telefone),
        property_value: parseFloat(removeCurrencyMask(formData.valor)),
        down_payment: parseFloat(removeCurrencyMask(formData.entrada)),
        term_years: parseInt(formData.prazo),
      });
      
      setSuccess(true);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        valor: "",
        entrada: "",
        prazo: "",
      });
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefone') {
      // Aplica máscara apenas para telefone
      setFormData({
        ...formData,
        [name]: applyPhoneMask(value),
      });
    } else if (name === 'valor' || name === 'entrada') {
      // Aplica máscara para valores monetários
      setFormData({
        ...formData,
        [name]: applyCurrencyMask(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className={`${geist.className} min-h-screen bg-gray-50 pt-24`}>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Faça seu Financiamento</h1>
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Solicitação enviada com sucesso! Entraremos em contato em breve.
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              Erro: {error}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-gray-700"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-gray-700"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-gray-700"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Imóvel (R$)
                </label>
                <input
                  type="text"
                  id="valor"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  placeholder="R$ 500.000,00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-gray-700"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="entrada" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor da Entrada (R$)
                </label>
                <input
                  type="text"
                  id="entrada"
                  name="entrada"
                  value={formData.entrada}
                  onChange={handleChange}
                  placeholder="R$ 100.000,00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-gray-700"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="prazo" className="block text-sm font-medium text-gray-700 mb-2">
                  Prazo (anos)
                </label>
                <select
                  id="prazo"
                  name="prazo"
                  value={formData.prazo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  required
                >
                  <option value="">Selecione o prazo</option>
                  <option value="15">15 anos</option>
                  <option value="20">20 anos</option>
                  <option value="25">25 anos</option>
                  <option value="30">30 anos</option>
                  <option value="35">35 anos</option>
                </select>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Simular Financiamento"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
