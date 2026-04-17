'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { useContactDialog } from './ContactDialogProvider';

interface ContactInfo {
  country: string;
  company: string;
  phones: string[];
  email: string;
  address?: string;
}

const ContactCTA = ({ dict, region }: { dict: any; region: 'ru' | 'by' | 'kk' }) => {
  const { openDialog } = useContactDialog();

  const contactData: Record<string, ContactInfo> = {
    ru: {
      country: dict.russia,
      company: 'ООО Инноватек РУС',
      phones: ['+7 910 110 73 77', '+7 910 110 14 94'],
      email: 'innovatech-rus@mail.ru',
    },
    by: {
      country: dict.belarus,
      company: 'ООО Инноватек Про',
      phones: ['+375 17 303 41 63', '+375 17 354 64 44'],
      email: 'info@innovatech.by',
    },
    kk: {
      country: dict.kazakhstan,
      company: 'InnovaTech',
      phones: ['+7 910 110 73 77'],
      email: 'innovatech-rus@mail.ru',
    },
  };

  const contact = contactData[region];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-3 md:px-4 lg:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {dict.tag}
              </div>

              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  {dict.title}
                </span>
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {dict.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={openDialog}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 group"
                >
                  <MessageCircle className="w-5 h-5" />
                  {dict.requestConsultation}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-border px-8 py-4 rounded-2xl font-bold text-lg hover:border-primary hover:text-primary transition-all">
                  {dict.downloadCatalog}
                </button>
              </div>
            </motion.div>

            {/* Right column - Contact info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-3xl p-8 space-y-6"
            >
              <div className="border-b border-border pb-4">
                <h3 className="text-2xl font-bold mb-2">{contact.company}</h3>
                <p className="text-muted-foreground">{contact.country}</p>
              </div>

              <div className="space-y-4">
                {/* Phones */}
                <div className="space-y-3">
                  {contact.phones.map((phone, index) => (
                    <a
                      key={index}
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="font-semibold">{phone}</span>
                    </a>
                  ))}
                </div>

                {/* Email */}
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="font-semibold break-all">{contact.email}</span>
                </a>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  {dict.availableTime}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
