'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContactDialog } from './ContactDialogProvider';
import ProductHero from './ProductHero';
import StickyCategoryTabs from './StickyCategoryTabs';

// ── Types ────────────────────────────────────────────────────────────────────

interface TabItem {
  id: string;
  label: string;
}

interface SpecRow {
  param: string;
  value: string;
}

interface Highlight {
  value: string;
  label: string;
}

interface ProductSection {
  id: string;
  sectionNumber: string;
  title: string;
  brand?: string;
  image: string;
  description: string;
  highlights?: Highlight[];
  // 'stacked' (default) — 2×2 grid under the image; 'row' — full-width strip below the block
  highlightsLayout?: string;
  features?: string[];
  specs: SpecRow[];
}

interface TechSpecHeaders {
  param: string;
  value: string;
}

interface PeatFillingDict {
  heroTag: string;
  heroTitle: string;
  heroDescription: string;
  heroStats?: Highlight[];
  getQuote: string;
  configurationLabel: string;
  specsLabel: string;
  techSpecHeaders: TechSpecHeaders;
  tabs: TabItem[];
  sections: ProductSection[];
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
            overflowWrap: 'break-word',
          }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

// ── Spec Table (param / value) ───────────────────────────────────────────────

function SpecTable({
  specs,
  headers,
}: {
  specs: SpecRow[];
  headers: TechSpecHeaders;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm min-w-[320px]">
        <thead>
          <tr className="bg-muted/50 text-left">
            <th className="px-4 py-3 font-semibold text-foreground">{headers.param}</th>
            <th className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
              {headers.value}
            </th>
          </tr>
        </thead>
        <tbody>
          {specs.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
              <td
                className="px-4 py-3 text-muted-foreground"
                style={{ overflowWrap: 'break-word' }}
              >
                {row.param}
              </td>
              <td
                className="px-4 py-3 text-foreground font-medium"
                style={{ overflowWrap: 'break-word' }}
              >
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Highlight Card ───────────────────────────────────────────────────────────

function HighlightCard({ h }: { h: Highlight }) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent px-4 py-4 sm:px-5 sm:py-5">
      <div
        className="font-bold text-primary leading-none"
        style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2rem)' }}
      >
        {h.value}
      </div>
      <div
        className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-snug"
        style={{ overflowWrap: 'break-word' }}
      >
        {h.label}
      </div>
    </div>
  );
}

// ── Product Section ──────────────────────────────────────────────────────────

function ProductSectionBlock({
  section,
  getQuote,
  configurationLabel,
  specsLabel,
  techSpecHeaders,
}: {
  section: ProductSection;
  getQuote: string;
  configurationLabel: string;
  specsLabel: string;
  techSpecHeaders: TechSpecHeaders;
}) {
  const { openDialog } = useContactDialog();

  const highlights = section.highlights ?? [];
  const layout = section.highlightsLayout ?? 'stacked';
  const showStacked = layout === 'stacked' && highlights.length > 0;
  const showRow = layout === 'row' && highlights.length > 0;

  return (
    <div className="space-y-8 lg:space-y-10">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Image (+ stacked highlights) */}
        <div className="space-y-4">
          <div className="group relative rounded-2xl overflow-hidden border border-border bg-muted/30 flex items-center aspect-[4/3]">
            <Image
              src={section.image}
              alt={section.title}
              fill
              className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {showStacked && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {highlights.map((h, i) => (
                <HighlightCard key={i} h={h} />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {section.brand && (
            <Badge
              variant="outline"
              className="text-primary border-primary/30 bg-primary/5 rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase"
            >
              {section.brand}
            </Badge>
          )}

          <p
            className="text-muted-foreground leading-relaxed text-sm"
            style={{ overflowWrap: 'break-word' }}
          >
            {section.description}
          </p>

          {section.features && section.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {configurationLabel}
              </h4>
              <ul className="space-y-2.5">
                {section.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-primary mt-0.5 flex-shrink-0"
                    />
                    <span style={{ overflowWrap: 'break-word' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {specsLabel}
            </h4>
            <SpecTable specs={section.specs} headers={techSpecHeaders} />
          </div>

          <Button onClick={openDialog} className="rounded-full group" size="lg">
            {getQuote}
            <ArrowRight
              size={16}
              className="ml-1 transition-transform group-hover:translate-x-1"
            />
          </Button>
        </div>
      </div>

      {/* Full-width highlights strip */}
      {showRow && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {highlights.map((h, i) => (
            <HighlightCard key={i} h={h} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PeatFillingPage({ dict }: { dict: PeatFillingDict }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    const timer = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <ProductHero
        tag={dict.heroTag}
        title={dict.heroTitle}
        description={dict.heroDescription}
        stats={dict.heroStats}
      />

      {/* Sticky tabs */}
      <StickyCategoryTabs tabs={dict.tabs} sectionIds={dict.sections.map((s) => s.id)} />

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
            <ProductSectionBlock
              section={section}
              getQuote={dict.getQuote}
              configurationLabel={dict.configurationLabel}
              specsLabel={dict.specsLabel}
              techSpecHeaders={dict.techSpecHeaders}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
