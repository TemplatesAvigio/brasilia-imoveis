export default function StatsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          {/* Coluna 1 */}
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold" style={{ color: '#97151B' }}>
              500+
            </div>
            <div className="space-y-1">
              <div className="text-lg font-medium text-black">
                Imóveis disponíveis
              </div>
              <div className="text-lg font-medium text-black">
                em Brasília
              </div>
            </div>
          </div>

          {/* Coluna 2 */}
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold" style={{ color: '#97151B' }}>
              1.200+
            </div>
            <div className="space-y-1">
              <div className="text-lg font-medium text-black">
                Clientes satisfeitos
              </div>
              <div className="text-lg font-medium text-black">
                em todo DF
              </div>
            </div>
          </div>

          {/* Coluna 3 */}
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold" style={{ color: '#97151B' }}>
              15
            </div>
            <div className="space-y-1">
              <div className="text-lg font-medium text-black">
                Anos de experiência
              </div>
              <div className="text-lg font-medium text-black">
                no mercado
              </div>
            </div>
          </div>

        </div>
        
        {/* Linha divisória */}
        <div className="mt-12 border-t border-white/20"></div>
      </div>
    </section>
  );
}
