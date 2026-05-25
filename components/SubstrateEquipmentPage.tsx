'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContactDialog } from './ContactDialogProvider';

// ── Types ────────────────────────────────────────────────────────────────────

interface TabItem {
  id: string;
  label: string;
}

interface ProductSingle {
  name: string;
  description: string;
  images: (string | null)[];
  specs: string[];
}

interface TechSpecRow {
  param: string;
  unit: string;
  value: string;
}

interface LG2400Detail {
  purpose: string;
  image: string;
  techSpecs: TechSpecRow[];
  features: string[];
}

interface Section {
  id: string;
  sectionNumber: string;
  title: string;
  type: string;
  // single
  product?: ProductSingle;
  // lg2400
  lg2400?: LG2400Detail;
}

interface TechSpecHeaders {
  param: string;
  unit: string;
  value: string;
}

interface SubstratEquipmentDict {
  heroTag: string;
  heroTitle: string;
  heroDescription: string;
  getQuote: string;
  techSpecHeaders: TechSpecHeaders;
  tabs: TabItem[];
  sections: Section[];
}

// ── Sticky Tab Navigation ────────────────────────────────────────────────────

function StickyTabNav({
  tabs,
  activeId,
}: {
  tabs: TabItem[];
  activeId: string;
}) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 84 + 56;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="sticky z-40 bg-background/95 backdrop-blur-md border-b border-border"
      style={{ top: '84px' }}
    >
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <div className="flex overflow-x-auto scrollbar-hide gap-1 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeId === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Spec List ────────────────────────────────────────────────────────────────

function SpecList({ specs }: { specs: string[] }) {
  return (
    <ul className="space-y-2.5">
      {specs.map((spec, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
          <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <span className="break-words" style={{ wordBreak: 'break-word', hyphens: 'auto' }}>
            {spec}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  sectionNumber,
  title,
}: {
  sectionNumber: string;
  title: string;
}) {
  return (
    <div className="mb-7 md:mb-12">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Badge
          variant="outline"
          className="text-primary border-primary/30 bg-primary/5 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase flex-shrink-0"
        >
          {sectionNumber}
        </Badge>
        <h2
          className="font-bold tracking-tight text-foreground leading-tight"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

// ── Product Image ────────────────────────────────────────────────────────────

function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden border border-border bg-muted/30 flex items-center"
      style={{ minHeight: '320px' }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

// ── Single Product Section ────────────────────────────────────────────────────

function SingleProductSection({
  section,
  getQuote,
}: {
  section: Section & { product: ProductSingle };
  getQuote: string;
}) {
  const { openDialog } = useContactDialog();
  const { product } = section;

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Images */}
      <div className="grid gap-3 sm:gap-4">
        {product.images.map((src, i) =>
          src ? (
            <ProductImage key={i} src={src} alt={`${product.name} ${i + 1}`} />
          ) : (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden border border-border border-dashed bg-muted/20 flex items-center justify-center"
              style={{ minHeight: '320px' }}
            >
              <p className="text-xs text-muted-foreground/60 text-center px-4">{product.name}</p>
            </div>
          )
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h3
            className="font-bold text-foreground"
            style={{
              fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
              wordBreak: 'break-word',
              hyphens: 'auto',
            }}
          >
            {product.name}
          </h3>
          <p
            className="text-muted-foreground leading-relaxed text-sm"
            style={{ wordBreak: 'break-word', hyphens: 'auto' }}
          >
            {product.description}
          </p>
        </div>
        <SpecList specs={product.specs} />
        <Button onClick={openDialog} className="rounded-full group" size="lg">
          {getQuote}
          <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}

// ── LG2400 Section ────────────────────────────────────────────────────────────

function LG2400Section({
  section,
  getQuote,
  techSpecHeaders,
}: {
  section: Section & { lg2400: LG2400Detail };
  getQuote: string;
  techSpecHeaders: TechSpecHeaders;
}) {
  const { openDialog } = useContactDialog();
  const detail = section.lg2400;

  return (
    <div className="space-y-10">
      {/* Image + Purpose + Specs */}
      <div className="grid lg:grid-cols-[minmax(0,420px)_1fr] gap-10 lg:gap-16 items-start">
        {/* Vertical (portrait) product image */}
        <div className="group relative rounded-2xl overflow-hidden border border-border bg-muted/30 w-full max-w-[420px] mx-auto lg:mx-0 aspect-[3/4]">
          <Image
            src={detail.image}
            alt={section.title}
            fill
            className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
        </div>

        {/* Purpose + tech spec table */}
        <div className="space-y-6">
          <p
            className="text-muted-foreground leading-relaxed text-sm"
            style={{ wordBreak: 'break-word', hyphens: 'auto' }}
          >
            {detail.purpose}
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">
                    {techSpecHeaders.param}
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                    {techSpecHeaders.unit}
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                    {techSpecHeaders.value}
                  </th>
                </tr>
              </thead>
              <tbody>
                {detail.techSpecs.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <td
                      className="px-4 py-3 text-muted-foreground"
                      style={{ wordBreak: 'break-word', hyphens: 'auto' }}
                    >
                      {row.param}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {row.unit}
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Features */}
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {detail.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span style={{ wordBreak: 'break-word', hyphens: 'auto' }}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <Button onClick={openDialog} className="rounded-full group" size="lg">
        {getQuote}
        <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SubstrateEquipmentPage({
  dict,
}: {
  dict: SubstratEquipmentDict;
}) {
  const [activeId, setActiveId] = useState(dict.tabs[0]?.id ?? '');

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer1 = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    const timer2 = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => {
      cancelAnimationFrame(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const sectionIds = dict.sections.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveId(id);
          },
          { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
        );
        obs.observe(el);
        observers.push(obs);
      });
    }, 0);

    return () => {
      clearTimeout(timer);
      observers.forEach((obs) => obs.disconnect());
    };
  }, [dict.sections]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-3 md:px-4 lg:px-6">
          <div className="max-w-3xl space-y-6">
            <Badge
              variant="outline"
              className="text-primary border-primary/30 bg-primary/5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
            >
              {dict.heroTag}
            </Badge>
            <h1
              className="font-bold tracking-tight text-foreground leading-tight"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                wordBreak: 'break-word',
                hyphens: 'auto',
              }}
            >
              {dict.heroTitle}
            </h1>
            <p
              className="text-muted-foreground leading-relaxed"
              style={{
                fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                wordBreak: 'break-word',
                hyphens: 'auto',
              }}
            >
              {dict.heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Sticky tabs */}
      <StickyTabNav tabs={dict.tabs} activeId={activeId} />

      {/* Sections */}
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        {dict.sections.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            className={`py-16 md:py-10 lg:py-20 scroll-mt-[140px] ${
              idx < dict.sections.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <SectionHeader
              sectionNumber={section.sectionNumber}
              title={section.title}
            />

            {section.type === 'single' && section.product && (
              <SingleProductSection
                section={section as Section & { product: ProductSingle }}
                getQuote={dict.getQuote}
              />
            )}

            {section.type === 'lg2400' && section.lg2400 && (
              <LG2400Section
                section={section as Section & { lg2400: LG2400Detail }}
                getQuote={dict.getQuote}
                techSpecHeaders={dict.techSpecHeaders}
              />
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
