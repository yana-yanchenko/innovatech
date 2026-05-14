'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, Clock } from 'lucide-react';
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

interface ProductCard {
  name: string;
  image?: string | null;
  images?: (string | null)[];
  specs: string[];
}

interface TierItem {
  name: string;
  specs: string[];
}

interface Section {
  id: string;
  sectionNumber: string;
  title: string;
  type: string;
  // single
  product?: ProductSingle;
  // two-products
  description?: string;
  products?: ProductCard[];
  // automation
  image?: string;
  tiers?: TierItem[];
}

interface EngineeringSystemsDict {
  heroTag: string;
  heroTitle: string;
  heroDescription: string;
  getQuote: string;
  comingSoon: string;
  comingSoonDescription: string;
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
      const offset = 84 + 56; // navbar + tab bar height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky z-40 bg-background/95 backdrop-blur-md border-b border-border" style={{ top: '84px' }}>
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
          {spec}
        </li>
      ))}
    </ul>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  sectionNumber,
  title,
  description,
}: {
  sectionNumber: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 md:mb-12">
      <div className="flex items-center gap-3 mb-4">
        <Badge
          variant="outline"
          className="text-primary border-primary/30 bg-primary/5 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase"
        >
          {sectionNumber}
        </Badge>
        <h2
          className="font-bold tracking-tight text-foreground leading-tight"
          style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
        >
          {title}
        </h2>
      </div>
      {description && (
        <p
          className="text-muted-foreground leading-relaxed max-w-3xl"
          style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)' }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// ── Product Image ────────────────────────────────────────────────────────────

function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-border bg-muted/30 flex items-center justify-center"
      style={{ minHeight: '220px' }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-4"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-border border-dashed bg-muted/20 flex items-center justify-center"
      style={{ minHeight: '220px' }}>
      <p className="text-xs text-muted-foreground/60 text-center px-4">{label}</p>
    </div>
  );
}

// ── Single Product Section (Вентиляция, Отопление) ───────────────────────────

function SingleProductSection({
  section,
  reversed,
  getQuote,
}: {
  section: Section & { product: ProductSingle };
  reversed: boolean;
  getQuote: string;
}) {
  const { openDialog } = useContactDialog();
  const { product } = section;

  return (
    <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-start ${reversed ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}>
      {/* Images */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {product.images.map((src, i) =>
          src ? (
            <ProductImage key={i} src={src} alt={`${product.name} ${i + 1}`} />
          ) : (
            <ImagePlaceholder key={i} label={product.name} />
          )
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h3
            className="font-bold text-foreground"
            style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}
          >
            {product.name}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
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

// ── Two Products Section (Зашторивание, Проветривание) ───────────────────────

function ProductCard({ product, getQuote }: { product: ProductCard; getQuote: string }) {
  const { openDialog } = useContactDialog();
  const images = product.images || (product.image ? [product.image] : []);
  const hasImages = images.length > 0 && images.some(img => img);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-background overflow-hidden">
      {hasImages && images.length === 1 ? (
        // Single image - original layout
        <div className="h-48 relative">
          {images[0] ? (
            <Image
              src={images[0]}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center border-b border-dashed border-border/50">
              <p className="text-xs text-muted-foreground/50">Фото оборудования</p>
            </div>
          )}
        </div>
      ) : hasImages && images.length > 1 ? (
        // Multiple images - grid layout
        <div className="grid grid-cols-2 gap-4 p-4">
          {images.map((src, i) =>
            src ? (
              <div key={i} className="relative rounded-lg overflow-hidden border border-border/50 bg-muted/30 flex items-center justify-center" style={{ minHeight: '200px' }}>
                <Image
                  src={src}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div key={i} className="rounded-lg overflow-hidden border border-border/50 border-dashed bg-muted/20 flex items-center justify-center" style={{ minHeight: '200px' }}>
                <p className="text-xs text-muted-foreground/50 text-center">{product.name}</p>
              </div>
            )
          )}
        </div>
      ) : (
        // No images
        <div className="h-48 relative">
          <div className="absolute inset-0 bg-muted/20 flex items-center justify-center border-b border-dashed border-border/50">
            <p className="text-xs text-muted-foreground/50">Фото оборудования</p>
          </div>
        </div>
      )}
      <div className="p-5 md:p-6 flex flex-col flex-1 space-y-4">
        <h3 className="font-bold text-foreground text-lg">{product.name}</h3>
        <SpecList specs={product.specs} />
        <div className="pt-2 mt-auto">
          <Button onClick={openDialog} variant="outline" className="rounded-full group w-full sm:w-auto" size="default">
            {getQuote}
            <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function TwoProductsSection({
  section,
  getQuote,
}: {
  section: Section & { products: ProductCard[]; description: string };
  getQuote: string;
}) {
  return (
    <div className="space-y-8">
      <p className="text-muted-foreground leading-relaxed max-w-3xl" style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)' }}>
        {section.description}
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {section.products.map((product, i) => (
          <ProductCard key={i} product={product} getQuote={getQuote} />
        ))}
      </div>
    </div>
  );
}

// ── Automation Section ───────────────────────────────────────────────────────

function AutomationSection({
  section,
  getQuote,
}: {
  section: Section & { image: string; tiers: TierItem[]; description: string };
  getQuote: string;
}) {
  const { openDialog } = useContactDialog();

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Image */}
      <div className="rounded-2xl overflow-hidden border border-border" style={{ minHeight: '300px', position: 'relative' }}>
        <Image
          src={section.image}
          alt={section.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Tiers */}
      <div className="space-y-6">
        <div className="space-y-4">
          {section.tiers.map((tier, i) => (
            <div key={i} className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold" style={{ fontSize: '10px' }}>{i + 1}</span>
                </div>
                <h4 className="font-semibold text-foreground text-sm">{tier.name}</h4>
              </div>
              <SpecList specs={tier.specs} />
            </div>
          ))}
        </div>
        <Button onClick={openDialog} className="rounded-full group" size="lg">
          {getQuote}
          <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}

// ── Coming Soon Section ──────────────────────────────────────────────────────

function ComingSoonSection({
  comingSoon,
  comingSoonDescription,
  getQuote,
}: {
  comingSoon: string;
  comingSoonDescription: string;
  getQuote: string;
}) {
  const { openDialog } = useContactDialog();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
        <Clock size={24} className="text-primary" />
      </div>
      <h3 className="font-bold text-foreground text-xl mb-3">{comingSoon}</h3>
      <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-6">
        {comingSoonDescription}
      </p>
      <Button onClick={openDialog} variant="outline" className="rounded-full group">
        {getQuote}
        <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────

export default function EngineeringSystemsPage({ dict }: { dict: EngineeringSystemsDict }) {
  const [activeId, setActiveId] = useState(dict.tabs[0]?.id ?? '');

  // Intersection Observer to highlight active tab
  useEffect(() => {
    const sectionEls = dict.sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the topmost visible section
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId((topmost.target as HTMLElement).id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [dict.sections]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-12 overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, var(--color-primary), transparent 70%)' }}
          />
        </div>

        <div className="container mx-auto px-3 md:px-4 lg:px-6 relative">
          <div className="max-w-4xl">
            <Badge
              variant="outline"
              className="mb-6 text-primary border-primary/30 bg-primary/5 rounded-full px-4 py-3 text-xs font-semibold tracking-widest uppercase"
            >
              {dict.heroTag}
            </Badge>

            <h1
              className="font-bold tracking-tight text-foreground leading-[1.08] mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, var(--color-foreground) 0%, color-mix(in oklch, var(--color-foreground) 60%, transparent) 100%)' }}
              >
                {dict.heroTitle}
              </span>
            </h1>

            <p
              className="text-muted-foreground leading-relaxed max-w-2xl"
              style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)' }}
            >
              {dict.heroDescription}
            </p>
          </div>

          <div className="mt-12 h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
        </div>
      </section>

      {/* Sticky Tab Navigation */}
      <StickyTabNav tabs={dict.tabs} activeId={activeId} />

      {/* Sections */}
      {dict.sections.map((section, index) => {
        const sectionBg = index % 2 === 0 ? 'bg-background' : 'bg-muted/20';

        return (
          <section
            key={section.id}
            id={section.id}
            className={`py-5 md:py-12 ${sectionBg}`}
          >
            <div className="container mx-auto px-3 md:px-4 lg:px-6">
              <SectionHeader
                sectionNumber={section.sectionNumber}
                title={section.title}
              />

              {section.type === 'single' && section.product && (
                <SingleProductSection
                  section={section as Section & { product: ProductSingle }}
                  reversed={index % 2 !== 0}
                  getQuote={dict.getQuote}
                />
              )}

              {section.type === 'coming-soon' && (
                <ComingSoonSection
                  comingSoon={dict.comingSoon}
                  comingSoonDescription={dict.comingSoonDescription}
                  getQuote={dict.getQuote}
                />
              )}

              {section.type === 'two-products' && section.products && section.description && (
                <TwoProductsSection
                  section={section as Section & { products: ProductCard[]; description: string }}
                  getQuote={dict.getQuote}
                />
              )}

              {section.type === 'automation' && section.image && section.tiers && section.description && (
                <AutomationSection
                  section={section as Section & { image: string; tiers: TierItem[]; description: string }}
                  getQuote={dict.getQuote}
                />
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
