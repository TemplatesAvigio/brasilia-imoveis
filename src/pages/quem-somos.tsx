import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});

export default function QuemSomos() {
  return (
    <div className={`${geist.className} min-h-screen bg-gray-50 pt-24`}>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Quem Somos</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A Brasília Imóveis & Seguros é uma empresa especializada em locação e venda de imóveis em Brasília, 
              comprometida em oferecer o melhor atendimento e as melhores opções para nossos clientes.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Com anos de experiência no mercado imobiliário da capital federal, nossa equipe está preparada para 
              auxiliar você em todas as etapas do processo, desde a busca do imóvel ideal até a finalização da 
              compra ou locação.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Oferecemos uma ampla variedade de imóveis: apartamentos, casas, sobrados, coberturas e terrenos 
              em todas as regiões de Brasília, incluindo Plano Piloto, Águas Claras, Taguatinga, Ceilândia e 
              outras localidades.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Nossa missão é facilitar a realização do sonho da casa própria ou encontrar o local ideal para 
              sua família, oferecendo atendimento personalizado e soluções que atendam às suas necessidades 
              específicas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
