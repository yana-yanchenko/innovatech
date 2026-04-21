'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MousePointer2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContactDialog } from './ContactDialogProvider';
import dynamic from 'next/dynamic';

function ModelSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-muted/20">
      <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  );
}

// Dynamically import 3D models to avoid SSR issues with WebGL
const TunnelGreenhouseModel = dynamic(() => import('./TunnelGreenhouseModel'), { ssr: false, loading: () => <ModelSkeleton /> });
const MultiRowGreenhouseModel = dynamic(() => import('./MultiRowGreenhouseModel'), { ssr: false, loading: () => <ModelSkeleton /> });
const BerryTunnelModel = dynamic(() => import('./BerryTunnelModel'), { ssr: false, loading: () => <ModelSkeleton /> });
const UtilityBlockModel = dynamic(() => import('./UtilityBlockModel'), { ssr: false, loading: () => <ModelSkeleton /> });

interface NodeInfo {
  id: string;
  label: string;
  description: string;
}

interface Section {
  id: string;
  sectionNumber: string;
  title: string;
  description: string;
  specs: string[];
  nodes: NodeInfo[];
}

interface HoveredNodeState {
  nodeId: string;
  label: string;
  description: string;
}

interface GreenhouseStructuresPageProps {
  dict: {
    heroTag: string;
    heroTitle: string;
    heroDescription: string;
    exploreHint: string;
    getQuote: string;
    sections: Section[];
  };
}

function SectionBlock({
  section,
  index,
  reversed,
  exploreHint,
  getQuote,
}: {
  section: Section;
  index: number;
  reversed: boolean;
  exploreHint: string;
  getQuote: string;
}) {
  const { openDialog } = useContactDialog();
  const [hoveredNode, setHoveredNode] = useState<HoveredNodeState | null>(null);
  const activeNode = hoveredNode ? section.nodes.find((n) => n.id === hoveredNode.nodeId) ?? null : null;
  const isHovered = hoveredNode !== null;

  const handleNodeHover = useCallback((info: { nodeId: string; label: string; description: string } | null) => {
    setHoveredNode(info);
  }, []);

  const ModelComponent = {
    tunnel: TunnelGreenhouseModel,
    multirow: MultiRowGreenhouseModel,
    berry: BerryTunnelModel,
    utility: UtilityBlockModel,
  }[section.id];

  const sectionBg = index % 2 === 0 ? 'bg-background' : 'bg-muted/20';

  return (
    <section className={`py-16 md:py-24 ${sectionBg}`}>
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reversed ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}
        >
          {/* 3D Canvas side */}
          <div className="relative">
            <div
              className="relative rounded-2xl overflow-hidden border border-border h-[300px] sm:h-[380px] lg:h-[500px]"
              style={{ background: 'radial-gradient(ellipse at center, color-mix(in oklch, var(--color-primary) 4%, transparent), transparent 70%)' }}
            >
              {ModelComponent && (
                <ModelComponent
                  nodes={section.nodes}
                  onNodeHover={handleNodeHover}
                  pauseRotation={isHovered}
                />
              )}

              {/* Tooltip overlay */}
              <AnimatePresence mode="wait">
                {activeNode && (
                  <motion.div
                    key={activeNode.id}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none"
                  >
                    <div className="bg-background/95 backdrop-blur-md border border-primary/30 rounded-2xl p-4 shadow-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0 animate-pulse" />
                        <div>
                          <div className="text-sm font-bold text-foreground">{activeNode.label}</div>
                          <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{activeNode.description}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Corner badge */}
              <div className="absolute top-3 left-3 pointer-events-none">
                <div className="bg-background/70 backdrop-blur-sm border border-primary/20 rounded-lg px-2.5 py-1">
                  <span className="text-xs font-bold text-primary">{section.sectionNumber}</span>
                </div>
              </div>
            </div>

            {/* Explore hint */}
            <div className="relative mt-3 h-4" aria-live="polite">
              <AnimatePresence>
                {!activeNode && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5"
                  >
                    <MousePointer2 size={11} className="text-primary" />
                    {exploreHint}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="text-primary border-primary/30 bg-primary/5 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase"
              >
                {section.sectionNumber}
              </Badge>
              <h2
                className="font-bold tracking-tight text-foreground leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
              >
                {section.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)' }}>
                {section.description}
              </p>
            </div>

            <ul className="space-y-2.5">
              {section.specs.map((spec, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex items-start gap-2.5 text-sm text-foreground"
                >
                  <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  {spec}
                </motion.li>
              ))}
            </ul>

            <Button
              onClick={openDialog}
              className="rounded-full group"
              size="lg"
            >
              {getQuote}
              <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function GreenhouseStructuresPage({ dict }: GreenhouseStructuresPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero section */}
      <section className="relative pt-28 sm:pt-36   overflow-hidden bg-background">
        {/* Decorative blobs */}
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl"
          >
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
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent origin-left"
          />
        </div>
      </section>

      {/* Sections */}
      {dict.sections.map((section, index) => (
            <SectionBlock
              key={section.id}
              section={section}
              index={index}
              reversed={index % 2 !== 0}
              exploreHint={dict.exploreHint}
              getQuote={dict.getQuote}
            />
      ))}
    </div>
  );
}
