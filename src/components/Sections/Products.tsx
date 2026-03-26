export default function Products() {
  const products = [
    {
      id: 1,
      name: "CAMISETA 'ENVIADO'",
      missionary: "APOIA: LUCAS M. — ORIENTE MÉDIO",
      price: "R$ 119",
      imgPlaceholder: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "MOLETOM 'ATOS 1:8'",
      missionary: "APOIA: SARAH K. — LESTE EUROPEU",
      price: "R$ 249",
      imgPlaceholder: "https://images.unsplash.com/photo-1556821840-0a63f95609a7?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "BONÉ 'CAMPO'",
      missionary: "APOIA: PROJETO FRONTEIRA",
      price: "R$ 89",
      imgPlaceholder: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <section className="border-b border-ink/10 pt-32 pb-16">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <h2 className="font-heading font-bold uppercase text-[64px] tracking-wide text-ink leading-none">
            MISSÃO VESTÍVEL
          </h2>
          <p className="font-serif italic font-medium text-muted text-[16px] max-w-[320px] leading-[1.6] md:text-right">
            Cada peça carrega o testemunho de um missionário. A venda apoia quem foi enviado.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 md:gap-y-0 border-t border-b border-ink/10 divide-y md:divide-y-0 md:divide-x divide-ink/10">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col p-8 lg:p-12 hover:bg-ink/5 transition-colors duration-500">
              
              {/* Product Image Wrapper */}
              <div className="relative aspect-[3/4] w-full mb-8 overflow-hidden bg-ink/5 mix-blend-multiply">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.imgPlaceholder} 
                  alt={product.name}
                  className="object-cover w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-heading font-bold uppercase tracking-wide text-[28px] text-ink mb-2">
                    {product.name}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-[1px] text-muted mb-6">
                    {product.missionary}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-heading font-bold text-[32px] text-ink">
                    {product.price}
                  </span>
                  
                  <button className="h-10 px-6 uppercase font-mono text-[11px] tracking-[2px] font-bold text-ink border border-ink/20 hover:border-ink hover:bg-ink hover:text-paper transition-all duration-300">
                    Ver Peça
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
