import React from 'react';
import { MotionValue } from 'framer-motion';

interface SobreProps {
  scrollProgress: MotionValue<number>;
}

export default function Sobre({ scrollProgress }: SobreProps) {
  return (
    <section className="bg-paper min-h-[80vh] flex flex-col justify-center items-center px-8 py-32 relative overflow-hidden">
      
      {/* Decorative Gold Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rust/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rust/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[720px] w-full text-center relative z-10 flex flex-col items-center">
        
        {/* Subtitle / Eyebrow */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-rust mt-1" />
          <span className="font-mono text-[11px] uppercase tracking-[2px] text-rust font-bold">
            NOSSO PROPÓSITO
          </span>
          <div className="w-12 h-[1px] bg-rust mt-1" />
        </div>

        {/* Big Title (Anton) */}
        <h2 className="text-[60px] md:text-[90px] leading-[0.9] font-heading font-bold text-ink uppercase tracking-normal mb-12">
          A MISSÃO EM<br />TEMPO REAL
        </h2>

        {/* Body Text (Playfair Display) */}
        <div className="space-y-6">
          <p className="font-serif italic text-ink/90 text-[20px] md:text-[24px] leading-[1.7] max-w-[600px] mx-auto">
            Acreditamos que a obra não terminou. Em cada continente, cidade e vilarejo há uma história de redenção sendo escrita.
          </p>
          <p className="font-serif text-[17px] md:text-[19px] leading-[1.8] text-muted max-w-[650px] mx-auto">
            A Confins nasceu para conectar o corpo global de Cristo. Não apenas relatamos o que aconteceu, mas mostramos onde está acontecendo agora. Queremos que você veja os corações que estão sendo alcançados, ore com precisão pelas necessidades do campo e seja despertado para o seu papel na Grande Comissão.
          </p>
        </div>

        {/* Decorative Vertical Line */}
        <div className="w-[1px] h-24 bg-rust/40 mt-16" />
        
        {/* Accent Dot */}
        <div className="w-2 h-2 rounded-full bg-rust mt-4" />

      </div>
    </section>
  );
}
