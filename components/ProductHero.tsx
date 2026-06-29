import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HeroStat {
  value: string;
  label: string;
}

interface ProductHeroProps {
  tag: string;
  title: string;
  description: string;
  stats?: HeroStat[];
  aside?: React.ReactNode;
}

/**
 * Shared hero block for product pages (PaperPot, cultivation, peat-filling, …).
 * Full-width headline + intro, with an optional stats strip below a divider.
 * An optional `aside` renders as a right-hand column next to the headline.
 */
export default function ProductHero({ tag, title, description, stats, aside }: ProductHeroProps) {
  return (
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
        <div className={aside ? 'grid lg:grid-cols-12 gap-8 lg:gap-12 items-center' : ''}>
          <div className={`space-y-6 ${aside ? 'lg:col-span-7' : 'max-w-4xl'}`}>
            <Badge
              variant="outline"
              className="text-primary border-primary/30 bg-primary/5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
            >
              {tag}
            </Badge>
            <h1
              className="font-bold tracking-tight text-foreground leading-tight text-balance"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', overflowWrap: 'normal', hyphens: 'none' }}
            >
              {title}
            </h1>
            <p
              className="text-muted-foreground leading-relaxed"
              style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.3rem)', overflowWrap: 'break-word' }}
            >
              {description}
            </p>
          </div>

          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>

        {stats && stats.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-x-10 sm:gap-x-16 gap-y-6">
            {stats.map((s, i) => (
              <div key={i} className="min-w-[6rem]">
                <div
                  className="font-bold text-primary leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
                >
                  {s.value}
                </div>
                <div className="mt-2 text-xs sm:text-sm text-muted-foreground leading-snug">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
