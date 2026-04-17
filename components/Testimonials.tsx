'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, TrendingUp, Users } from 'lucide-react';

const Testimonials = ({ dict }: { dict: any }) => {
  return (
    <section className="pt-24 bg-muted/30">
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-6">
            <Users className="w-4 h-4" />
            {dict.tag}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {dict.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {dict.description}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {dict.testimonials.map((testimonial: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-3xl p-6 hover:border-primary/50 transition-all hover:shadow-xl group relative"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Quote className="w-5 h-5" />
              </div>

              {/* Testimonial text */}
              <p className="text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Results */}
              {testimonial.results && (
                <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-border">
                  {testimonial.results.map((result: any, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-primary">{result.value}</div>
                        <div className="text-xs text-muted-foreground">{result.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.position}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="border-2 border-border px-8 py-4 rounded-2xl font-bold text-lg hover:border-primary hover:text-primary transition-all">
            {dict.ctaButton}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
