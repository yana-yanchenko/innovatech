'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Instagram } from 'lucide-react';
import Logo from './Logo';

interface ContactRegion {
  company: string;
  phones: string[];
  email: string;
}

const Footer = ({ dict, region }: { dict: any; region: 'ru' | 'by' | 'kk' }) => {
  const contactData: Record<string, ContactRegion> = {
    ru: {
      company: 'ООО Инноватек РУС',
      phones: ['+7 910 110 73 77', '+7 910 110 14 94'],
      email: 'innovatech-rus@mail.ru',
    },
    by: {
      company: 'ООО Инноватек Про',
      phones: ['+375 17 303 41 63', '+375 17 354 64 44'],
      email: 'info@innovatech.by',
    },
    kk: {
      company: 'InnovaTech',
      phones: ['+7 910 110 73 77'],
      email: 'innovatech-rus@mail.ru',
    },
  };

  const contact = contactData[region];

  const taglines = {
    ru: 'Вырастем вместе',
    by: 'Вырастем вместе',
    kk: 'Бірге өсеміз'
  };

  return (
    <footer id="contact" className="bg-zinc-950 text-zinc-400 pt-6 lg:pt-16 pb-12">
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <div className="flex flex-col items-center lg:items-start mb-12">
          <Link href="/" className="block">
            <Logo tagline={taglines[region]} inverted={true} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h4 className="text-white font-bold mb-6">{dict.solutions}</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#solutions" className="hover:text-primary transition-colors">{dict.solutionsList.industrial}</Link></li>
              <li><Link href="#solutions" className="hover:text-primary transition-colors">{dict.solutionsList.smartFarming}</Link></li>
              <li><Link href="#solutions" className="hover:text-primary transition-colors">{dict.solutionsList.ecoResidential}</Link></li>
              <li><Link href="#solutions" className="hover:text-primary transition-colors">{dict.solutionsList.support}</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h4 className="text-white font-bold mb-6">{dict.quickLinks}</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#innovation" className="hover:text-primary transition-colors">{dict.innovation}</Link></li>
              <li><Link href="#impact" className="hover:text-primary transition-colors">{dict.impact}</Link></li>
              <li><Link href="#partners" className="hover:text-primary transition-colors">{dict.partners}</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h4 className="text-white font-bold mb-6">{dict.contact}</h4>
            <div className="space-y-4 text-sm w-full flex flex-col items-center lg:items-start mb-8">
              <p className="font-semibold text-white">{contact.company}</p>
              {contact.phones.map((phone, index) => (
                <a
                  key={index}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 hover:text-primary transition-colors group"
                >
                  <Phone size={18} className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{phone}</span>
                </a>
              ))}
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 hover:text-primary transition-colors group"
              >
                <Mail size={18} className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="break-all">{contact.email}</span>
              </a>
            </div>

            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/innovatech.by?igsh=MWw0N2lxamliOHM3bA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <div
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-50 cursor-not-allowed"
                title="Скоро: Telegram канал"
              >
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest font-medium text-center md:text-left">
          <p className="opacity-60">© 2026 InnovaTech. {dict.rights}</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link href="#" className="hover:text-white transition-colors py-1">{dict.privacy}</Link>
            <Link href="#" className="hover:text-white transition-colors py-1">{dict.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
