'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, FileText, Hammer, Rocket, HeadphonesIcon } from 'lucide-react';

const Process = ({ dict }: { dict: any }) => {
  const stepIcons = [
    <MessageCircle key="consult" className="w-6 h-6" />,
    <FileText key="project" className="w-6 h-6" />,
    <Hammer key="install" className="w-6 h-6" />,
    <Rocket key="launch" className="w-6 h-6" />,
    <HeadphonesIcon key="support" className="w-6 h-6" />,
  ];

  const steps = dict.steps.map((step: any, i: number) => ({
    ...step,
    icon: stepIcons[i],
    number: i + 1
  }));

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-6">
            {dict.tag}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {dict.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {dict.description}
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" style={{ top: '48px' }} />
            
            {steps.map((step: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center text-center relative"
              >
                {/* Step number circle */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-card border-2 border-primary flex items-center justify-center relative group-hover:scale-110 transition-transform">
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-pulse" />
                    <div className="text-primary relative z-10">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-20">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
                
                {/* Duration badge */}
                {step.duration && (
                  <div className="mt-4 inline-flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {step.duration}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
