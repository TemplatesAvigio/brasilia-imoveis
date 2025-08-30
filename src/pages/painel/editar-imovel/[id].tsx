import { Geist } from "next/font/google";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PanelHeader from "@/components/PanelHeader";
import Button from "@/components/Button";
import Image from "next/image";
import { PROPERTY_TYPES } from "@/constants/propertyTypes";
import { BRASILIA_REGIONS } from "@/constants/regions";
import { applyCurrencyMask, removeCurrencyMask, applyPhoneMask, removePhoneMask } from "@/utils/masks";
import { getPropertyById, updateProperty } from "@/lib/supabase-utils";
import { uploadMultipleImages, deleteImage } from "@/lib/image-upload";
import { useRouter } from "next/router";

const geist = Geist({
  subsets: ["latin"],
});



export default function EditarImovel() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    garage: "",
    price: "",
    priceType: "sale",
    condominium: "",
    iptu: "",
    priceDetail: "",
    propertyType: "",
    region: "",
    features: [] as string[],
    images: [] as string[],
    contactPhone: "",
    contactWhatsApp: "",
  });

  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      if (id) {
        try {
          setLoading(true);
          const property = await getPropertyById(id as string);
          
          if (property) {
            setFormData({
              title: property.title,
              description: property.description,
              location: property.location,
              address: property.address,
              area: property.area.toString(),
              bedrooms: property.bedrooms?.toString() || "",
              bathrooms: property.bathrooms?.toString() || "",
              garage: property.garage?.toString() || "",
              price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price),
              priceType: property.price_type,
              condominium: property.condominium ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.condominium) : "",
              iptu: property.iptu ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.iptu) : "",
              priceDetail: property.price_detail || "",
              propertyType: property.property_type,
              region: property.region,
              features: property.features || [],
              images: property.images || [],
              contactPhone: property.contact_phone,
              contactWhatsApp: property.contact_whatsapp,
            });
          } else {
            setError("Imóvel não encontrado");
          }
        } catch (err) {
          setError("Erro ao carregar imóvel");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'condominium' || name === 'iptu') {
      setFormData({
        ...formData,
        [name]: applyCurrencyMask(value),
      });
    } else if (name === 'contactPhone' || name === 'contactWhatsApp') {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        address: formData.address,
        area: parseFloat(formData.area),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        garage: formData.garage ? parseInt(formData.garage) : null,
        price: parseFloat(removeCurrencyMask(formData.price)),
        price_type: formData.priceType,
        condominium: formData.condominium ? parseFloat(removeCurrencyMask(formData.condominium)) : null,
        iptu: formData.iptu ? parseFloat(removeCurrencyMask(formData.iptu)) : null,
        price_detail: formData.priceDetail || null,
        property_type: formData.propertyType,
        region: formData.region,
        features: formData.features,
        images: formData.images,
        contact_phone: removePhoneMask(formData.contactPhone),
        contact_whatsapp: removePhoneMask(formData.contactWhatsApp),
      };

      await updateProperty(id as string, propertyData);

      setSuccess(true);
      setTimeout(() => {
        router.push('/painel/imovel');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar imóvel";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.images.length + files.length > 20) {
      alert("Máximo de 20 imagens permitido!");
      return;
    }

    setUploadingImages(true);

    try {
      const results = await uploadMultipleImages(files);
      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);

      if (failedUploads.length > 0) {
        const errorMessages = failedUploads.map(result => result.error).join('\n');
        alert(`Alguns uploads falharam:\n${errorMessages}`);
      }

      const uploadedUrls = successfulUploads.map(result => result.url!);
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls]
      });

    } catch (error) {
      console.error('Erro geral no upload:', error);
      alert('Erro ao fazer upload das imagens');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = formData.images[index];
    
    try {
      // Tentar deletar do storage
      await deleteImage(imageUrl);
    } catch (error) {
      console.error('Erro ao deletar imagem do storage:', error);
    }

    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
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
                <p className="mt-4 text-gray-600">Carregando imóvel...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className={`${geist.className} min-h-screen bg-gray-50`}>
          <PanelHeader />
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Erro</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => router.push('/painel/imovel')}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Editar Imóvel
              </h1>
              <p className="text-gray-600">
                Atualize os dados do imóvel
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Imóvel atualizado com sucesso! Redirecionando...
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Ex: Apartamento Moderno no Setor Sudoeste"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Imóvel *
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Descreva o imóvel, suas características e benefícios..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  />
                </div>

                {/* Localização */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Região *
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione a região</option>
                      {BRASILIA_REGIONS.map((region) => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localização *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ex: Setor Sudoeste, Brasília"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço Completo *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ex: SQSW 504 Bloco K, Apartamento 101"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  />
                </div>

                {/* Características */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Área (m²) *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quartos
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banheiros
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vagas
                    </label>
                    <input
                      type="number"
                      name="garage"
                      value={formData.garage}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Preços */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Preço *
                    </label>
                    <select
                      name="priceType"
                      value={formData.priceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    >
                      <option value="sale">Venda</option>
                      <option value="rent">Aluguel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="R$ 500.000,00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destaque de Preço
                    </label>
                    <input
                      type="text"
                      name="priceDetail"
                      value={formData.priceDetail}
                      onChange={handleChange}
                      placeholder="Ex: Preço abaixo do mercado"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condomínio
                    </label>
                    <input
                      type="text"
                      name="condominium"
                      value={formData.condominium}
                      onChange={handleChange}
                      placeholder="R$ 850,00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IPTU
                    </label>
                    <input
                      type="text"
                      name="iptu"
                      value={formData.iptu}
                      onChange={handleChange}
                      placeholder="R$ 385,00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Diferenciais */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diferenciais
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Ex: Ar condicionado"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                    <Button
                      type="button"
                      onClick={addFeature}
                      className="px-6"
                    >
                      Adicionar
                    </Button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Imagens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens do Imóvel ({formData.images.length}/20)
                  </label>
                  <div className="mb-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImages || formData.images.length >= 20}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Máximo 20 imagens, 5MB cada. Formatos: JPG, PNG, GIF, WebP
                    </p>
                    {uploadingImages && (
                      <div className="mt-2 flex items-center text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Fazendo upload das imagens...
                      </div>
                    )}
                  </div>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image}
                            alt={`Imagem ${index + 1}`}
                            width={96}
                            height={96}
                            className="w-full h-24 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = '/background.jpg';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contato */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone de Contato *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="(61) 3045-5454"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp de Contato *
                    </label>
                    <input
                      type="tel"
                      name="contactWhatsApp"
                      value={formData.contactWhatsApp}
                      onChange={handleChange}
                      placeholder="(61) 3045-5454"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push('/painel/imovel')}
                    className="px-8"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
