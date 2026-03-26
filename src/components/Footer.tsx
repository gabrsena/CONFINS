import RotatingGlobe from "./RotatingGlobe";

export default function Footer() {
  return (
    <footer className="py-32 px-8 relative overflow-hidden">
      {/* Animated Globe Background */}
      <RotatingGlobe />
      
      <div className="max-w-[720px] mx-auto flex flex-col items-center text-center relative z-10">
        
        <h4 className="text-[40px] font-heading font-bold uppercase text-paper opacity-5 tracking-[8px] mb-12">
          CONFINS
        </h4>
        
        <p className="font-serif italic font-medium text-[19px] text-paper leading-[1.8] mb-8 max-w-[550px] drop-shadow-lg">
          "Mas recebereis poder, ao descer sobre vós o Espírito Santo, e ser-me-eis testemunhas, tanto em Jerusalém como em toda a Judéia e Samaria, e até os confins da terra."
        </p>
        
        <p className="font-mono text-[14px] uppercase tracking-[4px] text-rust mb-20 font-bold">
          ATOS 1:8
        </p>
        
        <p className="text-[11px] font-mono uppercase tracking-[2px] text-paper/40">
          © {new Date().getFullYear()} CONFINS. FEITO PARA A MISSÃO.
        </p>

      </div>
    </footer>
  );
}
