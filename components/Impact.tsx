'use client';

import React from 'react';
import { Globe2, Users2, Award, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';

const Impact = ({ dict }: { dict: any }) => {
  const statIcons = [
    <Globe2 key="globe" className="w-5 h-5" />,
    <Users2 key="users" className="w-5 h-5" />,
    <Award key="award" className="w-5 h-5" />,
    <Building2 key="building" className="w-5 h-5" />,
  ];

  const stats = dict.stats.map((s: any, i: number) => ({
    ...s,
    icon: statIcons[i]
  }));

  const topClients = dict.clients || [];

  return (
    <section id="impact" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-32" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <h2 className="text-primary-foreground/80 font-bold tracking-wider uppercase text-sm mb-4">{dict.tag}</h2>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            {dict.title}
          </h3>
          <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed">
            {dict.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((s: any, i: number) => {
            const numericValue = parseInt(s.value.replace(/[^0-9]/g, ''));
            const suffix = s.value.replace(/[0-9]/g, '');

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-3xl group hover:bg-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <div className="text-4xl font-bold mb-2">
                  {numericValue ? (
                    <AnimatedCounter
                      end={numericValue}
                      suffix={suffix}
                      duration={2500}
                    />
                  ) : (
                    s.value
                  )}
                </div>
                <div className="text-primary-foreground/60 font-medium uppercase tracking-wider text-xs">{s.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Top Clients Section */}
        <div className="max-w-5xl mx-auto">
          <h4 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {dict.trustedBy || 'Нам доверяют'}
          </h4>

          {/* Infinite scroll effect */}
          <div className="relative overflow-hidden">
            <div className="flex gap-8 animate-scroll">
              {[...topClients, ...topClients].map((client, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % topClients.length) * 0.1 }}
                  className="flex-shrink-0 group cursor-pointer"
                >
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{client.abbr}</div>
                      <div className="text-xs text-primary-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        {client.name}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-center text-primary-foreground/70 mt-8 text-sm">
            {dict.clientsNote || 'И более 100 других компаний в СНГ'}
          </p>
        </div>

      </div>
    </section>
  );
};

export default Impact;
