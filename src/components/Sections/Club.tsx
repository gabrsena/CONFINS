"use client";

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: "Semente",
    price: "14",
    features: ["Acesso ao App Confins", "Newsletter semanal", "Newsletter com missionários"]
  },
  {
    name: "Enviado",
    price: "29",
    features: ["Todos do Semente", "10% de desconto em produtos", "Acesso a relatórios mensais", "Comunidade Discord"]
  },
  {
    name: "Confins",
    price: "49",
    features: ["Todos do Enviado", "Brinde exclusivo semestral", "Chamada trimestral com missionários", "Conteúdo premium"]
  }
];

export default function Club() {
  return (
    <section className="py-32 px-8 bg-confins-offwhite text-confins-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-heading mb-6">Clube Confins</h2>
          <p className="text-confins-stone max-w-2xl mx-auto">
            Faça parte da nossa rede de sustento recorrente e receba benefícios exclusivos enquanto acelera a missão.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan, idx) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 border ${plan.name === 'Confins' ? 'bg-confins-black text-confins-offwhite border-confins-black' : 'bg-white border-confins-stone/10'} shadow-sm relative overflow-hidden group`}
            >
              {plan.name === 'Confins' && (
                <div className="absolute top-0 right-0 bg-confins-terracota text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest translate-x-3 translate-y-3 rotate-45">
                  Popular
                </div>
              )}
              
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-confins-terracota mb-4">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-sm font-bold">R$</span>
                <span className="text-5xl font-heading">{plan.price}</span>
                <span className="text-confins-stone">/mês</span>
              </div>

              <ul className="space-y-4 mb-10 min-h-[160px]">
                {plan.features.map(feature => (
                  <li key={feature} className="flex gap-3 text-sm items-start">
                    <Check size={16} className="text-confins-terracota shrink-0 mt-0.5" />
                    <span className={plan.name === 'Confins' ? 'text-confins-stone' : 'text-confins-stone'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all ${
                plan.name === 'Confins' 
                ? 'bg-confins-terracota text-white hover:brightness-110' 
                : 'bg-confins-black text-white hover:bg-confins-terracota'
              }`}>
                Selecionar Plano
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
