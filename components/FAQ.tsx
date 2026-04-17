'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FAQJsonLd } from '@/components/SEO/JsonLd';

const FAQ = ({ dict }: { dict: any }) => {

  return (
    <section className="py-18 bg-background">
      <FAQJsonLd questions={dict.questions} />
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-semibold">
              <HelpCircle className="w-4 h-4" />
              {dict.tag}
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {dict.title}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {dict.description}
            </p>
          </div>

          {/* FAQ List */}
          <Accordion type="single" collapsible defaultValue="item-0" className="space-y-4">
            {dict.questions.map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-2xl px-6 hover:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-lg font-bold hover:text-primary hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-12 p-8 bg-muted/50 rounded-3xl border border-border text-center">
            <h3 className="font-bold text-xl mb-2">{dict.stillHaveQuestions}</h3>
            <p className="text-muted-foreground mb-6">{dict.contactPrompt}</p>
            <Button size="lg" className="rounded-xl">
              {dict.contactButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
