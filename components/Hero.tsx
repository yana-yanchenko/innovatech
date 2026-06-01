'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import SproutAnimation from './SproutAnimation';
import { AnimatedCounter } from './AnimatedCounter';
import { useContactDialog } from './ContactDialogProvider';

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -60 : 60 }),
};

interface HeroDirection {
  badge: string;
  title: string;
  description: string;
  color?: string;
  stats?: { value: string; label: string }[];
}

interface HeroDict {
  title: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollHint: string;
  directions?: HeroDirection[];
}

const Hero = ({ dict }: { dict: HeroDict }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [growth, setGrowth] = useState(0);
  const { openDialog } = useContactDialog();

  const directions = dict.directions || [];

  // Анимация роста проигрывается один раз при загрузке и не зависит от прокрутки.
  useEffect(() => {
    const controls = animate(0, 1, {
      duration: 4,
      ease: 'easeInOut',
      onUpdate: (v) => setGrowth(v),
    });
    return () => controls.stop();
  }, []);

  // Слайдер направлений переключается только вручную (точки + стрелки).
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((i) => (i - 1 + directions.length) % directions.length);
  };
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((i) => (i + 1) % directions.length);
  };

  if (directions.length === 0) {
    return null;
  }

  const currentDirection = directions[currentIndex] || directions[0];

  return (
    <section className="relative bg-background">
      <div className="min-h-screen w-full flex items-center overflow-hidden pt-24 md:pt-28 lg:pt-20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-3 md:px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 items-center" style={{ gap: 'clamp(2rem, 5vw, 3rem)' }}>
            <div className="flex flex-col z-10" style={{ gap: 'clamp(1.5rem, 4vw, 2rem)' }}>
              {/* Статичный H1 для SEO - НЕ меняется */}
              <h1 className="sr-only">{dict.title}</h1>

              {/* Контент слайдера направлений */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}
                >
                  {/* Badge с названием направления */}
                  <div
                    className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold w-fit"
                    style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.75rem, 2vw, 1rem)'
                    }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    {currentDirection.badge}
                  </div>

                  {/* H2 для меняющегося заголовка */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    <h2
                      className="font-bold tracking-tight text-foreground leading-[1.1]"
                      style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
                    >
                      {currentDirection.title.split(' ')[0]} <br />
                      <span className="text-primary italic">
                        {currentDirection.title.split(' ').slice(1).join(' ')}
                      </span>
                    </h2>
                    <p
                      className="text-muted-foreground leading-relaxed"
                      style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)',
                        maxWidth: 'min(100%, 28rem)'
                      }}
                    >
                      {currentDirection.description}
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    <button
                      onClick={openDialog}
                      className="bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 group"
                      style={{
                        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                        padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)'
                      }}
                    >
                      {dict.ctaPrimary}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a
                      href="#projects-map"
                      className="border-2 border-border rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-muted/50 transition-all group"
                      style={{
                        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                        padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)'
                      }}
                    >
                      {dict.ctaSecondary}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  {/* Stats для текущего направления */}
                  <div
                    className="grid grid-cols-3 border-t border-border"
                    style={{
                      gap: 'clamp(0.75rem, 3vw, 1.5rem)',
                      paddingTop: 'clamp(1rem, 3vw, 2rem)'
                    }}
                  >
                    {currentDirection.stats?.map((stat, i: number) => {
                      const numericValue = parseInt(stat.value.replace(/[^0-9]/g, ''));
                      const suffix = stat.value.replace(/[0-9]/g, '');

                      return (
                        <div key={i} className="flex flex-col" style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
                          <span
                            className="font-bold text-foreground"
                            style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}
                          >
                            {numericValue ? (
                              <AnimatedCounter
                                end={numericValue}
                                suffix={suffix}
                                duration={2500}
                              />
                            ) : (
                              stat.value
                            )}
                          </span>
                          <span
                            className="text-muted-foreground"
                            style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}
                          >
                            {stat.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Управление слайдером: стрелки + точки */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={prevSlide}
                  aria-label="Предыдущее направление"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground hover:bg-muted/60 hover:border-primary/40 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2">
                  {directions.map((_: unknown, i: number) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      aria-label={`Направление ${i + 1}`}
                      aria-current={i === currentIndex}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-primary/50'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  aria-label="Следующее направление"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground hover:bg-muted/60 hover:border-primary/40 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            {/* Анимация ростка */}
            <div className="relative hidden md:flex items-center justify-center lg:h-[600px]">
              <div
                className="relative w-full rounded-[2rem] overflow-hidden"
                style={{
                  height: 'clamp(350px, 45vw, 600px)',
                  maxWidth: 'clamp(350px, 45vw, 600px)'
                }}
              >
                <SproutAnimation
                  progress={growth}
                  color={currentDirection.color}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm font-medium">{dict.scrollHint}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
