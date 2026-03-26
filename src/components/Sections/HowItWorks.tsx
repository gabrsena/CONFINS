export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "MISSIONÁRIOS SE CADASTRAM",
      desc: "Verificados por organizações reconhecidas ou igrejas locais. Criam perfil e postam do campo."
    },
    {
      num: "02",
      title: "O MUNDO ACOMPANHA",
      desc: "Qualquer pessoa vê no mapa onde eles estão e lê o que estão vivendo — em tempo real."
    },
    {
      num: "03",
      title: "DEUS ENVIA, NÓS TESTEMUNHAMOS",
      desc: "A missão não começa aqui. Ela já está acontecendo. O site apenas mostra."
    }
  ];

  return (
    <section className="border-b border-ink/10 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none mix-blend-multiply" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 relative z-10">
        
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className={`relative p-12 md:p-16 flex flex-col justify-start border-ink/10 ${idx !== 2 ? 'md:border-r border-b md:border-b-0' : ''}`}
          >
            {/* Decorative Number */}
            <span className="absolute top-8 left-12 font-heading font-black text-ink opacity-5 text-[120px] leading-none pointer-events-none select-none">
              {step.num}
            </span>

            {/* Content */}
            <div className="relative z-10 mt-16">
              <h3 className="font-heading font-bold uppercase text-ink text-[32px] md:text-[40px] leading-[0.9] mb-6 tracking-wide max-w-[280px]">
                {step.title}
              </h3>
              
              <p className="font-serif italic font-medium text-muted text-[16px] leading-[1.6] max-w-[300px]">
                {step.desc}
              </p>
            </div>
            
          </div>
        ))}

      </div>
    </section>
  );
}
