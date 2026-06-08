'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  ArrowRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Waves,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContactDialog } from './ContactDialogProvider';

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

interface PrincipleStep {
  title: string;
  text: string;
}

interface Principle {
  label: string;
  intro: string;
  steps: PrincipleStep[];
}

interface ProductSection {
  id: string;
  sectionNumber: string;
  title: string;
  images: string[];
  description: string;
  principle?: Principle;
  variants?: string[];
  features?: string[];
  highlights?: Highlight[];
  specs: SpecRow[];
}

interface TechSpecHeaders {
  param: string;
  value: string;
}

interface CultivationDict {
  heroTag: string;
  heroTitle: string;
  heroDescription: string;
  heroStats?: Highlight[];
  getQuote: string;
  variantsLabel: string;
  featuresLabel: string;
  specsLabel: string;
  techSpecHeaders: TechSpecHeaders;
  tabs: TabItem[];
  sections: ProductSection[];
}

// ── Sticky Tab Navigation ────────────────────────────────────────────────────

function StickyTabNav({ tabs, activeId }: { tabs: TabItem[]; activeId: string }) {
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

// ── Image Gallery (main + thumbnails) ────────────────────────────────────────

function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [prevImages, setPrevImages] = useState(images);
  const safeImages = images.length > 0 ? images : [];

  // Keep selection valid if the image set ever changes — reset during render
  // instead of in an effect to avoid a cascading re-render.
  if (images !== prevImages) {
    setPrevImages(images);
    setActive(0);
  }

  if (safeImages.length === 0) return null;

  return (
    <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-[150px]">
      {/* Main image — crossfade between slides */}
      <div className="group relative rounded-2xl overflow-hidden border border-border bg-muted/30 aspect-[4/3]">
        {safeImages.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${alt} — ${i + 1}`}
            fill
            priority={i === 0}
            className={`object-cover transition-opacity duration-500 ease-out ${
              i === active ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-[1.03] transition-transform`}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ))}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {safeImages.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`${alt} — ${i + 1}`}
              aria-pressed={i === active}
              className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-200 ${
                i === active
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Principle Block (flood & drain) ──────────────────────────────────────────

function PrincipleBlock({ principle }: { principle: Principle }) {
  const stepIcons = [
    <ArrowDownToLine key="in" size={18} className="text-primary" />,
    <ArrowUpFromLine key="out" size={18} className="text-primary" />,
  ];

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <Waves size={18} className="text-primary flex-shrink-0" />
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          {principle.label}
        </h4>
      </div>
      <p
        className="text-sm text-muted-foreground leading-relaxed"
        style={{ overflowWrap: 'break-word' }}
      >
        {principle.intro}
      </p>
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {principle.steps.map((step, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-background/60 p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                {stepIcons[i % stepIcons.length]}
              </span>
              <span className="font-semibold text-foreground text-sm">
                {step.title}
              </span>
            </div>
            <p
              className="text-xs sm:text-sm text-muted-foreground leading-snug"
              style={{ overflowWrap: 'break-word' }}
            >
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Variant Cards (numbered) ─────────────────────────────────────────────────

function VariantList({ label, variants }: { label: string; variants: string[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        {label}
      </h4>
      <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
        {variants.map((v, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-3.5 py-3"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
              {i + 1}
            </span>
            <span
              className="text-sm text-foreground leading-snug"
              style={{ overflowWrap: 'break-word' }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Feature List (checkmarks) ────────────────────────────────────────────────

function FeatureList({ label, features }: { label: string; features: string[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        {label}
      </h4>
      <ul className="space-y-2.5">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
            <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <span style={{ overflowWrap: 'break-word' }}>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Spec Table ───────────────────────────────────────────────────────────────

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
  variantsLabel,
  featuresLabel,
  specsLabel,
  techSpecHeaders,
}: {
  section: ProductSection;
  getQuote: string;
  variantsLabel: string;
  featuresLabel: string;
  specsLabel: string;
  techSpecHeaders: TechSpecHeaders;
}) {
  const { openDialog } = useContactDialog();
  const highlights = section.highlights ?? [];

  return (
    <div className="space-y-8 lg:space-y-10">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Gallery */}
        <Gallery images={section.images} alt={section.title} />

        {/* Content */}
        <div className="space-y-6">
          <p
            className="text-muted-foreground leading-relaxed text-sm"
            style={{ overflowWrap: 'break-word' }}
          >
            {section.description}
          </p>

          {section.principle && <PrincipleBlock principle={section.principle} />}

          {section.variants && section.variants.length > 0 && (
            <VariantList label={variantsLabel} variants={section.variants} />
          )}

          {section.features && section.features.length > 0 && (
            <FeatureList label={featuresLabel} features={section.features} />
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
      {highlights.length > 0 && (
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

export default function CultivationEquipmentPage({
  dict,
}: {
  dict: CultivationDict;
}) {
  const [activeId, setActiveId] = useState(dict.tabs[0]?.id ?? '');

  useEffect(() => {
    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    const timer = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
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
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 70%)' }}
          />
          <div
            className="absolute -bottom-24 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 70%)' }}
          />
        </div>

        <div className="container mx-auto px-3 md:px-4 lg:px-6 relative">
          <div className="max-w-4xl space-y-6">
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
                overflowWrap: 'break-word',
              }}
            >
              {dict.heroTitle}
            </h1>
            <p
              className="text-muted-foreground leading-relaxed"
              style={{
                fontSize: 'clamp(1.05rem, 1.5vw, 1.3rem)',
                overflowWrap: 'break-word',
              }}
            >
              {dict.heroDescription}
            </p>
          </div>

          {dict.heroStats && dict.heroStats.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-x-10 sm:gap-x-16 gap-y-6">
              {dict.heroStats.map((s, i) => (
                <div key={i} className="min-w-[6rem]">
                  <div
                    className="font-bold text-primary leading-none"
                    style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="mt-2 text-xs sm:text-sm text-muted-foreground leading-snug"
                    style={{ overflowWrap: 'break-word' }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <ProductSectionBlock
              section={section}
              getQuote={dict.getQuote}
              variantsLabel={dict.variantsLabel}
              featuresLabel={dict.featuresLabel}
              specsLabel={dict.specsLabel}
              techSpecHeaders={dict.techSpecHeaders}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
