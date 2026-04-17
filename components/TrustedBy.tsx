'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const TrustedBy = ({ dict }: { dict: any }) => {
  // Placeholder for client logos - можно заменить на реальные logo
  const clients = dict.clients || [];

  return (
    <section className="py-16 bg-background border-y border-border overflow-hidden">
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{dict.title}</h3>
              <p className="text-muted-foreground text-sm">{dict.subtitle}</p>
            </div>
          </div>
          
          <div className="flex gap-8 items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1,200+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{dict.clientsCount}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">12+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{dict.countriesCount}</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{dict.satisfactionRate}</div>
            </div>
          </div>
        </div>

        {/* Running line of client types/industries */}
        <div className="relative">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{
              x: [0, -1000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {[...dict.industries, ...dict.industries].map((industry: string, i: number) => (
              <span
                key={i}
                className="text-muted-foreground font-medium text-lg px-4"
              >
                {industry}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
