'use client';

import { useEffect, useState } from 'react';

export interface CategoryTab {
  id: string;
  label: string;
}

interface StickyCategoryTabsProps {
  tabs: CategoryTab[];
  /** Ids of the DOM sections to scroll-spy. Defaults to the tab ids. */
  sectionIds?: string[];
  /** Sticky offset from the top of the viewport (px). */
  stickyTop?: number;
  /** Amount subtracted when scrolling to a section (navbar + tab bar height, px). */
  headerOffset?: number;
  /** IntersectionObserver rootMargin used to highlight the active tab. */
  rootMargin?: string;
}

/**
 * Sticky category navigation: a horizontally scrollable tab bar that smoothly
 * scrolls to the matching page section on click and highlights the section
 * currently in view. Shared across product pages.
 */
export default function StickyCategoryTabs({
  tabs,
  sectionIds,
  stickyTop = 84,
  headerOffset = 140,
  rootMargin = '-30% 0px -60% 0px',
}: StickyCategoryTabsProps) {
  const ids = sectionIds ?? tabs.map((t) => t.id);
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const timer = setTimeout(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveId(id);
          },
          { rootMargin, threshold: 0 }
        );
        obs.observe(el);
        observers.push(obs);
      });
    }, 0);
    return () => {
      clearTimeout(timer);
      observers.forEach((obs) => obs.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|'), rootMargin]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div
      className="sticky z-40 bg-background/95 backdrop-blur-md border-b border-border"
      style={{ top: `${stickyTop}px` }}
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
