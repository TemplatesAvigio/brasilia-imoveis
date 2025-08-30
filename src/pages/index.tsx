import Image from "next/image";
import { Geist } from "next/font/google";
import SearchForm from "@/components/SearchForm";
import StatsSection from "@/components/StatsSection";
import PropertyCardSection from "@/components/PropertyCardSection";
import SearchProperty from "@/components/SearchProperty";

const geist = Geist({
  subsets: ["latin"],
});

export default function Home() {
  const handleScrollDown = () => {
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      const targetPosition = statsSection.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition - 80;
      const duration = 1000; // 2 segundos para o scroll
      let start: number | null = null;

      function animation(currentTime: number) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      // Função de easing para movimento mais suave
      function ease(t: number, b: number, c: number, d: number): number {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }
  };

  return (
    <div className={`${geist.className} min-h-screen bg-white`}>
      {/* Seção Hero */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.jpg"
            alt="Modern office workspace"
            fill
            className="object-cover blur-xs"
            priority
          />
          {/* Overlay vermelho escuro semi-transparente */}
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(151, 21, 27, 0.3)' }}></div>
        </div>

        {/* Conteúdo Central */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Label Superior */}
          <div className="mb-4">
            <span className="text-white text-sm font-medium tracking-wider uppercase" style={{ color: '#FFF' }}>
              IMÓVEIS EM BRASÍLIA
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-12 leading-tight">
            Encontre o imóvel dos seus sonhos em Brasília
          </h1>

          {/* Formulário de Busca */}
          <SearchForm />

          {/* Call-to-Action */}
          {/* <div className="flex items-center justify-center gap-3 text-white hover:text-gray-300 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span className="text-lg">Faça um tour virtual dos nossos imóveis</span>
          </div> */}
        </div>

        {/* Indicador de Scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div 
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce cursor-pointer hover:bg-white/30 transition-colors"
            onClick={handleScrollDown}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Seção de Estatísticas */}
      <div id="stats-section">
        <StatsSection />
      </div>
      
      {/* Seção de Imóveis em Destaque */}
      <PropertyCardSection />
      
      {/* Seção SearchProperty */}
      <SearchProperty />
    </div>
  );
}
