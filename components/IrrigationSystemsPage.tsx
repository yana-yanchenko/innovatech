'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
        <div className="w-full max-w-[984px] mx-auto">
          <div className="relative">
            {/* Frosted-glass backing */}
            <div className="relative rounded-[2.25rem] p-8 sm:p-16 border border-border/50 bg-background/40 backdrop-blur-xl shadow-[0_24px_70px_-20px_rgba(0,0,0,0.35)]">
              {/* Main slide */}
              <div
                className="group relative rounded-2xl overflow-hidden border border-border/60 bg-muted/30 shadow-lg ring-1 ring-black/5 select-none cursor-grab active:cursor-grabbing"
                style={{ aspectRatio: '1057 / 630' }}
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
                  className="object-cover scale-[1.01]"
                  sizes="100%"
                  draggable={false}
                />

                {/* Bottom vignette for control legibility */}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16" />

                {/* Counter */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/60 border border-border/50 backdrop-blur-md text-xs font-medium tabular-nums z-10">
                  {currentIndex + 1} / {images.length}
                </div>

                {/* Prev */}
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-background/70 border border-border/50 backdrop-blur-md shadow-md hover:bg-background hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-10"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Next */}
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-background/70 border border-border/50 backdrop-blur-md shadow-md hover:bg-background hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-10"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); goTo(i); }}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentIndex ? 'w-5 bg-primary' : 'w-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-hide mt-4 justify-center">
                {images.map((src, i) => (
                  <button
                    key={i}
                    ref={(el) => { thumbRefs.current[i] = el; }}
                    onClick={() => goTo(i)}
                    aria-label={`Thumbnail ${i + 1}`}
                    className={`relative shrink-0 w-20 h-12 rounded-xl overflow-hidden transition-all duration-200 ${
                      i === currentIndex
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.04]'
                        : 'opacity-50 hover:opacity-100 ring-1 ring-border/50'
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${title} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function IrrigationSystemsPage({ dict }: { dict: IrrigationSystemsDict }) {
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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <ProductHero
        tag={dict.heroTag}
        title={dict.heroTitle}
        description={dict.heroDescription}
      />

      {/* Sticky tabs */}
      <StickyCategoryTabs
        tabs={dict.tabs}
        sectionIds={[...dict.sections.map((s) => s.id), 'control-panel']}
      />

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
