import { Geist } from "next/font/google";
import { useState } from "react";
import Button from "@/components/Button";
import { useInsurance } from "@/hooks/useSupabase";
import { applyPhoneMask, removePhoneMask } from "@/utils/masks";

const geist = Geist({
  subsets: ["latin"],
});

export default function Seguro() {
  const { createInsurance, loading, error } = useInsurance();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await createInsurance({
        name: formData.nome,
        phone: removePhoneMask(formData.telefone),
        email: formData.email,
      });
      
      setSuccess(true);
      setFormData({
        nome: "",
        telefone: "",
        email: "",
      });
    } catch (err) {
      console.error("Erro ao enviar formulário:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefone') {
      // Aplica máscara apenas para telefone
      setFormData({
        ...formData,
        [name]: applyPhoneMask(value),
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Faça seu Seguro</h1>
          
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
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enviando..." : "Solicitar Cotação"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}