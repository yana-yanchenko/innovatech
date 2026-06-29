'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  ArrowRight,
  Settings2,
  ListOrdered,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Leaf,
  Sprout,
  Network,
  TrendingUp,
  Timer,
  Recycle,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useContactDialog } from './ContactDialogProvider';
import ProductHero from './ProductHero';
import StickyCategoryTabs from './StickyCategoryTabs';

// ── Types ────────────────────────────────────────────────────────────────────

interface SpecRow {
  param: string;
  value: string;
}
interface Highlight {
  value: string;
  label: string;
}
interface Principle {
  label: string;
  text: string;
}
interface ProductSection {
  id: string;
  sectionNumber: string;
  title: string;
  images: string[];
  description: string;
  principle?: Principle;
  nodes?: string[];
  configs?: string[];
  features?: string[];
  highlights?: Highlight[];
  specs?: SpecRow[];
}
interface Category {
  id: string;
  title: string;
  sectionIds: string[];
}
interface TechSpecHeaders {
  param: string;
  value: string;
}
interface FiltersDict {
  title: string;
  all: string;
  single: string;
  dual: string;
  multi: string;
  sortLabel: string;
  sortDefault: string;
  sortThroughput: string;
  results: string;
  empty: string;
  reset: string;
}
interface BenefitItem {
  icon: string;
  title: string;
  text: string;
}
interface BenefitsDict {
  tag: string;
  title: string;
  subtitle: string;
  items: BenefitItem[];
  applicationsLabel: string;
  applications: string[];
}
interface PaperPotDict {
  heroTag: string;
  heroTitle: string;
  heroDescription: string;
  heroStats?: Highlight[];
  benefits?: BenefitsDict;
  getQuote: string;
  detailsLabel: string;
  breadcrumbParent: string;
  filters: FiltersDict;
  nodesLabel: string;
  configsLabel: string;
  featuresLabel: string;
  specsLabel: string;
  techSpecHeaders: TechSpecHeaders;
  categories: Category[];
  sections: ProductSection[];
}

type ChannelKind = 1 | 2 | 'multi' | null;

// Language-neutral attributes for filtering/sorting (kept out of the dictionaries).
const PRODUCT_META: Record<string, { channels: ChannelKind; throughput: number }> = {
  agib: { channels: 1, throughput: 9000 },
  agib202: { channels: 2, throughput: 18000 },
  ati: { channels: 1, throughput: 6000 },
  atib: { channels: 1, throughput: 9000 },
  'atib-turbo': { channels: 2, throughput: 18000 },
  pal: { channels: 1, throughput: 6000 },
  palb: { channels: 1, throughput: 9000 },
  'palb-turbo': { channels: 2, throughput: 9000 },
  mae: { channels: 'multi', throughput: 54000 },
  paper: { channels: null, throughput: 0 },
  'miniline-1': { channels: 1, throughput: 9000 },
  'miniline-2': { channels: 2, throughput: 18000 },
};

// ── Benefit icon map ─────────────────────────────────────────────────────────

const BENEFIT_ICONS: Record<string, LucideIcon> = {
  leaf: Leaf,
  sprout: Sprout,
  roots: Network,
  yield: TrendingUp,
  labor: Timer,
  eco: Recycle,
};

// ── Reduced-motion + reveal-on-scroll ────────────────────────────────────────

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const reduced = usePrefersReducedMotion();
  const visible = shown || reduced;

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(16px)',
        transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)',
        transitionDelay: visible ? `${delay}ms` : '0ms',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

// ── Image with skeleton + fade-in (fully visible, never cropped) ─────────────

function ContainImage({
  src,
  alt,
  priority,
  sizes,
  cover = false,
  onClick,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  cover?: boolean;
  onClick?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`absolute inset-0 ${cover ? '' : 'p-2'} ${onClick ? 'cursor-zoom-in' : ''}`}
      onClick={onClick}
    >
      <div className="relative h-full w-full">
        {!loaded && (
          <div className="absolute inset-0 bg-muted/60 animate-pulse" aria-hidden />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={`${cover ? 'object-cover' : 'object-contain'} transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

// ── Channel badge text ───────────────────────────────────────────────────────

function channelLabel(channels: ChannelKind, f: FiltersDict): string | null {
  if (channels === 1) return f.single;
  if (channels === 2) return f.dual;
  if (channels === 'multi') return f.multi;
  return null;
}

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  section,
  detailsLabel,
  filters,
  onOpen,
}: {
  section: ProductSection;
  detailsLabel: string;
  filters: FiltersDict;
  onOpen: () => void;
}) {
  const metric = section.highlights?.[0];
  const chan = channelLabel(PRODUCT_META[section.id]?.channels ?? null, filters);

  return (
    <button
      onClick={onOpen}
      className="group flex h-full w-full flex-col text-left rounded-2xl border border-primary/40 bg-card overflow-hidden shadow-md shadow-primary/10 hover:shadow-2xl hover:shadow-primary/30 transition-shadow duration-300"
    >
      <div className="relative aspect-[4/3] w-full bg-white overflow-hidden">
        <ContainImage
          src={section.images[0]}
          alt={section.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {chan && (
          <span className="absolute right-3 top-3 rounded-full bg-primary/90 text-primary-foreground px-2.5 py-1 text-[11px] font-semibold">
            {chan}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <h3 className="font-semibold leading-snug text-foreground text-base sm:text-[1.05rem] group-hover:text-primary transition-colors">
          {section.title}
        </h3>

        {metric && (
          <div className="flex items-baseline gap-2">
            <span className="text-primary font-bold text-lg leading-none">{metric.value}</span>
            <span className="text-xs text-muted-foreground leading-tight">{metric.label}</span>
          </div>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary pt-1">
          {detailsLabel}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}

// ── Lightbox (fullscreen zoom) ───────────────────────────────────────────────

function Lightbox({
  images,
  index,
  setIndex,
  alt,
  onClose,
}: {
  images: string[];
  index: number;
  setIndex: (updater: (i: number) => number) => void;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.stopImmediatePropagation();
        setIndex((i) => (i - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        e.stopImmediatePropagation();
        setIndex((i) => (i + 1) % images.length);
      }
    };
    // Capture phase so this preempts the Dialog's Escape-to-close handler.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [images.length, onClose, setIndex]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        aria-label="close"
        onClick={onClose}
        className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <X size={20} />
      </button>

      <div className="relative h-full w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${alt} — ${index + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
        />
        {images.length > 1 && (
          <>
            <button
              aria-label="prev"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              aria-label="next"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            >
              <ChevronRight size={22} />
            </button>
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-white/80 text-sm">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Modal gallery ────────────────────────────────────────────────────────────

function ModalGallery({
  images,
  index,
  setIndex,
  alt,
  onZoom,
}: {
  images: string[];
  index: number;
  setIndex: (updater: (i: number) => number) => void;
  alt: string;
  onZoom: () => void;
}) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="group relative w-full rounded-xl overflow-hidden border border-border bg-gradient-to-br from-muted/50 to-muted/10 aspect-[4/3] sm:aspect-[16/10]">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-300 ${
              i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ContainImage
              src={src}
              alt={`${alt} — ${i + 1}`}
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 720px"
              onClick={onZoom}
            />
          </div>
        ))}

        <button
          onClick={onZoom}
          aria-label="zoom"
          className="absolute right-2 bottom-2 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
        >
          <ZoomIn size={16} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="prev"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              aria-label="next"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(() => i)}
              aria-label={`${alt} — ${i + 1}`}
              aria-pressed={i === index}
              className={`relative h-16 w-16 rounded-lg overflow-hidden border bg-muted/40 transition-all ${
                i === index
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={src} alt="" fill className="object-contain p-0.5" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Detail sub-blocks ────────────────────────────────────────────────────────

function PrincipleBlock({ principle }: { principle: Principle }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4 sm:p-5 space-y-2.5">
      <div className="flex items-center gap-2.5">
        <Settings2 size={18} className="text-primary flex-shrink-0" />
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          {principle.label}
        </h4>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed" style={{ overflowWrap: 'break-word' }}>
        {principle.text}
      </p>
    </div>
  );
}

function NumberedList({
  label,
  items,
  icon,
}: {
  label: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        {icon}
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{label}</h4>
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {items.map((v, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-foreground leading-snug" style={{ overflowWrap: 'break-word' }}>
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureList({ label, features }: { label: string; features: string[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{label}</h4>
      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
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

function SpecTable({
  specs,
  headers,
  label,
}: {
  specs: SpecRow[];
  headers: TechSpecHeaders;
  label: string;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{label}</h4>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm min-w-[320px]">
          <thead>
            <tr className="bg-muted/50 text-left">
              <th className="px-4 py-2.5 font-semibold text-foreground">{headers.param}</th>
              <th className="px-4 py-2.5 font-semibold text-foreground whitespace-nowrap">{headers.value}</th>
            </tr>
          </thead>
          <tbody>
            {specs.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                <td className="px-4 py-2.5 text-muted-foreground" style={{ overflowWrap: 'break-word' }}>
                  {row.param}
                </td>
                <td className="px-4 py-2.5 text-foreground font-medium" style={{ overflowWrap: 'break-word' }}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Product Modal ────────────────────────────────────────────────────────────

function ProductModal({
  section,
  navList,
  dict,
  onClose,
  onNav,
}: {
  section: ProductSection | null;
  navList: string[];
  dict: PaperPotDict;
  onClose: () => void;
  onNav: (id: string) => void;
}) {
  const { openDialog } = useContactDialog();
  const [imgIndex, setImgIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [prevSecId, setPrevSecId] = useState(section?.id);

  // Reset the gallery when the product changes — during render to avoid a
  // cascading effect re-render.
  if (section?.id !== prevSecId) {
    setPrevSecId(section?.id);
    setImgIndex(0);
    setLightbox(false);
  }

  const pos = section ? navList.indexOf(section.id) : -1;
  const prevId = pos > 0 ? navList[pos - 1] : null;
  const nextId = pos >= 0 && pos < navList.length - 1 ? navList[pos + 1] : null;

  // Gallery keyboard nav (when no lightbox open). Lightbox handles its own keys in capture phase.
  useEffect(() => {
    if (!section) return;
    const onKey = (e: KeyboardEvent) => {
      if (!section.images || section.images.length < 2) return;
      if (e.key === 'ArrowLeft') setImgIndex((i) => (i - 1 + section.images.length) % section.images.length);
      else if (e.key === 'ArrowRight') setImgIndex((i) => (i + 1) % section.images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [section]);

  const highlights = section?.highlights ?? [];

  return (
    <>
      <Dialog open={!!section} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-3xl lg:max-w-4xl w-[calc(100vw-1.5rem)] max-h-[90vh] p-0 gap-0 overflow-hidden rounded-3xl flex flex-col">
          {section && (
            <>
              <DialogHeader className="shrink-0 px-5 sm:px-7 pt-6 pb-4 border-b border-border text-left space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="w-fit text-primary border-primary/30 bg-primary/5 rounded-full px-3 py-0.5 text-[11px] font-semibold tracking-widest uppercase"
                  >
                    {section.sectionNumber}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {pos + 1} / {navList.length}
                  </span>
                  <div className="ml-auto flex items-center gap-1.5 pr-8">
                    <button
                      disabled={!prevId}
                      onClick={() => prevId && onNav(prevId)}
                      aria-label="previous product"
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={17} />
                    </button>
                    <button
                      disabled={!nextId}
                      onClick={() => nextId && onNav(nextId)}
                      aria-label="next product"
                      className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
                <DialogTitle
                  className="font-bold tracking-tight text-foreground leading-tight"
                  style={{ fontSize: 'clamp(1.3rem, 3vw, 1.9rem)' }}
                >
                  {section.title}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth px-5 sm:px-7 py-6 space-y-6 [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/40">
                <ModalGallery
                  images={section.images}
                  index={imgIndex}
                  setIndex={(u) => setImgIndex(u)}
                  alt={section.title}
                  onZoom={() => setLightbox(true)}
                />

                {highlights.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {highlights.map((h, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent px-3 py-3"
                      >
                        <div
                          className="font-bold text-primary leading-none"
                          style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}
                        >
                          {h.value}
                        </div>
                        <div className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground leading-snug">
                          {h.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-muted-foreground leading-relaxed text-sm" style={{ overflowWrap: 'break-word' }}>
                  {section.description}
                </p>

                {section.principle && <PrincipleBlock principle={section.principle} />}

                {section.configs && section.configs.length > 0 && (
                  <NumberedList
                    label={dict.configsLabel}
                    items={section.configs}
                    icon={<Layers size={18} className="text-primary flex-shrink-0" />}
                  />
                )}

                {section.nodes && section.nodes.length > 0 && (
                  <NumberedList
                    label={dict.nodesLabel}
                    items={section.nodes}
                    icon={<ListOrdered size={18} className="text-primary flex-shrink-0" />}
                  />
                )}

                {section.features && section.features.length > 0 && (
                  <FeatureList label={dict.featuresLabel} features={section.features} />
                )}

                {section.specs && section.specs.length > 0 && (
                  <SpecTable specs={section.specs} headers={dict.techSpecHeaders} label={dict.specsLabel} />
                )}
              </div>

              <div className="shrink-0 px-5 sm:px-7 py-4 border-t border-border bg-background/95 backdrop-blur">
                <Button onClick={openDialog} className="rounded-full group w-full sm:w-auto" size="lg">
                  {dict.getQuote}
                  <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {lightbox && section && (
        <Lightbox
          images={section.images}
          index={imgIndex}
          setIndex={(u) => setImgIndex(u)}
          alt={section.title}
          onClose={() => setLightbox(false)}
        />
      )}
    </>
  );
}

// ── Benefits section ─────────────────────────────────────────────────────────

// Intro text shown on the right side of the hero block.
function BenefitsHeroAside({ data }: { data: BenefitsDict }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-card/60 backdrop-blur p-6 sm:p-7 shadow-sm">
      <h2
        className="font-bold tracking-tight text-foreground leading-tight"
        style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)' }}
      >
        {data.title}
      </h2>
      <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
        {data.subtitle}
      </p>
    </div>
  );
}

function BenefitsSection({ data }: { data: BenefitsDict }) {
  return (
    <section className="border-b border-border bg-gradient-to-b from-primary/[0.06] to-transparent">
      <div className="container mx-auto px-3 md:px-4 lg:px-6 py-12 md:py-16">
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {data.items.map((item, i) => {
            const Icon = BENEFIT_ICONS[item.icon] ?? Leaf;
            return (
              <Reveal key={i} delay={i * 100} className="h-full">
                <div className="group h-full rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-foreground text-base sm:text-[1.05rem] leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed" style={{ overflowWrap: 'break-word' }}>
                    {item.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Applications — bottom, full width */}
        {data.applications.length > 0 && (
          <Reveal delay={120} className="mt-10 md:mt-14 pt-8 border-t border-border flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-semibold text-foreground mr-1">{data.applicationsLabel}</span>
            {data.applications.map((app, i) => (
              <span
                key={i}
                className="rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1.5 text-sm font-medium text-foreground"
              >
                {app}
              </span>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PaperPotPage({ dict }: { dict: PaperPotDict }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sectionsById = useMemo(() => {
    const map: Record<string, ProductSection> = {};
    dict.sections.forEach((s) => (map[s.id] = s));
    return map;
  }, [dict.sections]);

  const orderedIds = useMemo(
    () => dict.categories.flatMap((c) => c.sectionIds).filter((id) => sectionsById[id]),
    [dict.categories, sectionsById]
  );

  // Only categories that actually have products become tabs / sections.
  const visibleCategories = useMemo(
    () => dict.categories.filter((c) => c.sectionIds.some((id) => sectionsById[id])),
    [dict.categories, sectionsById]
  );

  const tabs = useMemo(
    () => visibleCategories.map((c) => ({ id: `cat-${c.id}`, label: c.title })),
    [visibleCategories]
  );

  // The list used for in-modal prev/next.
  const navList = orderedIds;
  const selected = selectedId ? sectionsById[selectedId] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    const timer = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  const f = dict.filters;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <ProductHero
        tag={dict.heroTag}
        title={dict.heroTitle}
        description={dict.heroDescription}
        stats={dict.heroStats}
        aside={dict.benefits ? <BenefitsHeroAside data={dict.benefits} /> : undefined}
      />

      {/* Advantages of paper pots */}
      {dict.benefits && <BenefitsSection data={dict.benefits} />}

      {/* Sticky category tabs — scroll to the matching section on click */}
      <StickyCategoryTabs tabs={tabs} headerOffset={150} />

      {/* Content */}
      <div className="container mx-auto px-3 md:px-4 lg:px-6 py-10 md:py-14">
        <div className="space-y-14 md:space-y-20">
          {visibleCategories.map((cat) => {
            const items = cat.sectionIds.map((id) => sectionsById[id]).filter(Boolean);
            return (
              <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-[150px]">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <h2
                    className="font-bold tracking-tight text-foreground leading-tight"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
                  >
                    {cat.title}
                  </h2>
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground font-medium flex-shrink-0">
                    {items.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {items.map((section, i) => (
                    <Reveal key={section.id} delay={Math.min(i, 5) * 70} className="h-full">
                      <ProductCard
                        section={section}
                        detailsLabel={dict.detailsLabel}
                        filters={f}
                        onOpen={() => setSelectedId(section.id)}
                      />
                    </Reveal>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <ProductModal
        section={selected}
        navList={navList}
        dict={dict}
        onClose={() => setSelectedId(null)}
        onNav={(id) => setSelectedId(id)}
      />
    </div>
  );
}
