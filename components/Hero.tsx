'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useScroll, motion, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { AnimatedCounter } from './AnimatedCounter';
import { useContactDialog } from './ContactDialogProvider';

const Hero = ({ dict }: { dict: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { openDialog } = useContactDialog();

  const directions = dict.directions || [];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Initial video playback with slow speed, then loop
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      video.playbackRate = 0.6; // Slower playback for cinematic effect
      video.play().catch(err => console.log('Video autoplay prevented:', err));
    };

    if (video.readyState >= 2) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Handle scroll progress for text changes only
  useEffect(() => {
    if (directions.length === 0) return;

    const unsubscribe = smoothProgress.on("change", (latest) => {
      setScrollProgress(latest);
      const index = Math.min(
        Math.floor(latest * directions.length),
        directions.length - 1
      );
      if (index !== currentIndex && index >= 0) {
        setCurrentIndex(index);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [smoothProgress, currentIndex, directions.length]);

  if (directions.length === 0) {
    return null;
  }

  const currentDirection = directions[currentIndex] || directions[0];

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        {/* Video Background Layer - 60% width, right aligned */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[60%]">
          <div className="relative w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: 'brightness(0.85)',
              }}
            >
              <source src="/video/video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Text Content Overlay - left 45%, overlapping video */}
        <div className="container mx-auto relative z-20 h-full flex items-center">
          <div className="w-full lg:w-[48%] relative">
            <div className="lg:col-span-4 flex flex-col relative" style={{ gap: 'clamp(1.5rem, 4vw, 2rem)' }}>
              {/* Apple-style glass card with irregular right edge */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 -inset-x-6 -inset-y-12 bg-black/70 backdrop-blur-3xl -z-10"
                style={{
                  clipPath: 'polygon(0 0, 92% 0, 100% 8%, 100% 92%, 95% 100%, 0 100%)',
                  boxShadow: '30px 0 60px rgba(0, 0, 0, 0.5), 15px 0 30px rgba(0, 0, 0, 0.3), inset -1px 0 1px rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRight: 'none',
                }}
              />
              
              {/* Статичный H1 для SEO - НЕ меняется */}
              <h1 className="sr-only">{dict.title}</h1>

              {/* Меняющийся контент при скролле */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}
                >
                  {/* Badge с названием направления */}
                  <div
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full text-white font-semibold w-fit backdrop-blur-sm"
                    style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      padding: 'clamp(0.4rem, 1vw, 0.6rem) clamp(1rem, 2vw, 1.25rem)'
                    }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                    {currentDirection.badge}
                  </div>

                  {/* H2 для меняющегося заголовка */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    <h2
                      className="font-bold tracking-tight text-white leading-[1.05]"
                      style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.02em' }}
                    >
                      {currentDirection.title.split(' ')[0]} <br />
                      <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        {currentDirection.title.split(' ').slice(1).join(' ')}
                      </span>
                    </h2>
                    <p
                      className="text-white/70 leading-relaxed font-light"
                      style={{
                        fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                        maxWidth: 'min(100%, 28rem)'
                      }}
                    >
                      {currentDirection.description}
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row" style={{ gap: 'clamp(0.75rem, 2vw, 1rem)', marginTop: 'clamp(0.5rem, 1vw, 1rem)' }}>
                    <button
                      onClick={openDialog}
                      className="bg-white text-black rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-2xl group"
                      style={{
                        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                        padding: 'clamp(0.875rem, 2vw, 1.125rem) clamp(1.75rem, 3vw, 2.5rem)'
                      }}
                    >
                      {dict.ctaPrimary}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Stats для текущего направления */}
                  <div
                    className="grid grid-cols-3 border-t border-white/10"
                    style={{
                      gap: 'clamp(1rem, 3vw, 2rem)',
                      paddingTop: 'clamp(1.5rem, 3vw, 2.5rem)',
                      marginTop: 'clamp(1rem, 2vw, 1.5rem)'
                    }}
                  >
                    {currentDirection.stats?.map((stat: any, i: number) => {
                      const numericValue = parseInt(stat.value.replace(/[^0-9]/g, ''));
                      const suffix = stat.value.replace(/[0-9]/g, '');

                      return (
                        <div key={i} className="flex flex-col" style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
                          <span
                            className="font-semibold text-white"
                            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', letterSpacing: '-0.01em' }}
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
                            className="text-white/60 font-light"
                            style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)' }}
                          >
                            {stat.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-30"
        >
          <span className="text-sm font-light tracking-wide">{dict.scrollHint}</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={24} className="opacity-60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
