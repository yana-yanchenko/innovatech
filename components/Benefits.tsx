'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Award, Headphones, CheckCircle2, Wrench } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Benefits = ({ dict }: { dict: any }) => {
  const benefitIcons = [
    <Shield key="shield" className="w-6 h-6" />,
    <Clock key="clock" className="w-6 h-6" />,
    <Award key="award" className="w-6 h-6" />,
    <Headphones key="support" className="w-6 h-6" />,
    <CheckCircle2 key="check" className="w-6 h-6" />,
    <Wrench key="wrench" className="w-6 h-6" />,
  ];

  const benefits = dict.items.map((item: any, i: number) => ({
    ...item,
    icon: benefitIcons[i]
  }));

  return (
    <section className="pb-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background pointer-events-none" />
      
      <div className="container mx-auto px-3 md:px-4 lg:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-semibold">
            <Award className="w-4 h-4" />
            {dict.tag}
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="bg-gradient-to-r from-foreground via-primary/90 to-foreground/70 bg-clip-text text-transparent">
              {dict.title}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            {dict.description}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:border-primary/50 hover:shadow-xl transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    {benefit.icon}
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-19 text-center">
          <p className="text-muted-foreground mb-6 text-lg">{dict.cta}</p>
          <Button size="lg" className="rounded-2xl shadow-lg shadow-primary/25 text-lg px-8">
            {dict.ctaButton}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
