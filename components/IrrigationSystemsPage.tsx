'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

interface ContentPair {
  image: string;
  title: string;
  description: string;
  specs: string[];
}

interface Section {
  id: string;
  sectionNumber: string;
  title: string;
  type: string;
  // single
  product?: ProductSingle;
  // split-content
  pairs?: ContentPair[];
}

interface IrrigationSystemsDict {
  heroTag: string;
  heroTitle: string;
  heroDescription: string;
  getQuote: string;
  controlPanelTitle: string;
  controlPanelDescription: string;
  controlPanelImages: string[];
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
    <div className="mb-7 md:mb-12">
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

function ProductImage({ src, alt, cover, fullHeight }: { src: string; alt: string; cover?: boolean; fullHeight?: boolean }) {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border border-border bg-muted/30 flex items-center  ${fullHeight ? 'h-full' : ''}`}
      style={{ minHeight: fullHeight ? undefined : '320px' }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`${cover ? 'object-cover' : 'object-contain p-4'} transition-transform duration-500 ease-out group-hover:scale-105`}
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
      {/* Images grid */}
      <div className="grid  gap-3 sm:gap-4 h-full">
        {product.images.map((src, i) =>
          src ? (
            <ProductImage  key={i} src={src} alt={`${product.name} ${i + 1}`} />
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
            style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}
          >
            {product.name}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>
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

// ── Split Content Section ─────────────────────────────────────────────────────

function SplitContentSection({
  section,
  getQuote,
}: {
  section: Section & { pairs: ContentPair[] };
  getQuote: string;
}) {
  const { openDialog } = useContactDialog();

  return (
    <div className="space-y-16 lg:space-y-20">
      {section.pairs.map((pair, i) => (
        <div key={i}>
          {i > 0 && <div className="border-t border-border mb-16 lg:mb-20" />}
          <div
            className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch ${
              i % 2 === 1
                ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1'
                : ''
            }`}
          >
            <ProductImage
              src={pair.image}
              alt={pair.title}
              cover={pair.image.includes('field-ramp') || pair.image.includes('greenhouse-ramp-photo')}
              fullHeight={true}
            />
            <div className="space-y-6">
              <div className="space-y-3">
                <h3
                  className="font-bold text-foreground"
                  style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}
                >
                  {pair.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{pair.description}</p>
              </div>
              {pair.specs.length > 0 && <SpecList specs={pair.specs} />}
              <Button onClick={openDialog} className="rounded-full group" size="lg">
                {getQuote}
                <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Control Panel Gallery ─────────────────────────────────────────────────────

function ControlPanelGallery({
  title,
  description,
  images,
  sectionNumber,
}: {
  title: string;
  description: string;
  images: string[];
  sectionNumber: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const goTo = (i: number) => {
    setCurrentIndex(i);
  };

  const prev = () => goTo((currentIndex - 1 + images.length) % images.length);
  const next = () => goTo((currentIndex + 1) % images.length);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, images.length]);

  // Scroll active thumbnail into view
  useEffect(() => {
    thumbRefs.current[currentIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [currentIndex]);

  // Drag / swipe handlers
  const onDragStart = (x: number) => {
    dragStartX.current = x;
  };
  const onDragEnd = (x: number) => {
    if (dragStartX.current !== null) {
      const delta = dragStartX.current - x;
      if (Math.abs(delta) > 50) {
        delta > 0 ? next() : prev();
      }
      dragStartX.current = null;
    }
  };

  return (
    <div>
      <SectionHeader sectionNumber={sectionNumber} title={title} />
      <div className="grid  gap-10 lg:gap-16">
        {/* Text */}
        <p className="text-muted-foreground leading-relaxed text-sm ">{description}</p>

        {/* Slider column */}
        <div>
          {/* Main slide */}
          <div
            className="relative rounded-2xl overflow-hidden border border-border bg-muted/30 select-none cursor-grab active:cursor-grabbing"
            style={{ height: '600px' }}
            onMouseDown={(e) => { e.preventDefault(); onDragStart(e.clientX); }}
            onMouseUp={(e) => onDragEnd(e.clientX)}
            onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
            onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
          >

            <Image
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              draggable={false}
            />

            {/* Counter */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/70 border border-border backdrop-blur-sm text-xs font-medium z-10">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-background/70 border border-border backdrop-blur-sm hover:bg-background/90 transition z-10"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-background/70 border border-border backdrop-blur-sm hover:bg-background/90 transition z-10"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-4 bg-primary' : 'w-1.5 bg-foreground/30 hover:bg-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide mt-2 justify-center">
            {images.map((src, i) => (
              <button
                key={i}
                ref={(el) => { thumbRefs.current[i] = el; }}
                onClick={() => goTo(i)}
                className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  i === currentIndex ? 'border-primary' : 'border-transparent hover:border-border'
                }`}
              >
                <Image
                  src={src}
                  alt={`${title} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function IrrigationSystemsPage({ dict }: { dict: IrrigationSystemsDict }) {
  const [activeId, setActiveId] = useState(dict.tabs[0]?.id ?? '');

  useEffect(() => {
    // Reset scroll position on page load - multiple times to ensure it works
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
    const sectionIds = [...dict.sections.map((s) => s.id), 'control-panel'];
    const observers: IntersectionObserver[] = [];

    // Delay observer setup to prevent initial scroll issues
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
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              {dict.heroTitle}
            </h1>
            <p
              className="text-muted-foreground leading-relaxed"
              style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)' }}
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
            <SectionHeader sectionNumber={section.sectionNumber} title={section.title} />

            {section.type === 'single' && section.product && (
              <SingleProductSection
                section={section as Section & { product: ProductSingle }}
                getQuote={dict.getQuote}
              />
            )}

            {section.type === 'split-content' && section.pairs && (
              <SplitContentSection
                section={section as Section & { pairs: ContentPair[] }}
                getQuote={dict.getQuote}
              />
            )}
          </section>
        ))}

        {/* Control Panel Gallery */}
        <section
          id="control-panel"
          className="py-16 md:py-20 lg:py-24 scroll-mt-[140px]"
        >
          <ControlPanelGallery
            sectionNumber="03"
            title={dict.controlPanelTitle}
            description={dict.controlPanelDescription}
            images={dict.controlPanelImages}
          />
        </section>
      </div>
    </div>
  );
}
