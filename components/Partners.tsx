'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const Partners = ({ dict }: { dict: any }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  return (
    <section id="partners" className="pb-6 lg:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        {/* Video Header Section */}
        <div className="relative w-full lg:h-[600px] mb-12 lg:mb-24 overflow-hidden">
          {/* Video Layer - shifted right 60% */}
          <div className={cn(
            "absolute right-0 top-0 w-full lg:w-[60%] h-full transition-all duration-[2000ms] hidden lg:block bg-muted"
          )}>
            <video
              ref={videoRef}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-[2000ms]",
                isVideoEnded ? "opacity-0" : "opacity-100"
              )}
              muted
              playsInline
              autoPlay
              onEnded={() => setIsVideoEnded(true)}
              style={{ filter: 'brightness(0.9)' }}
            >
              <source src="/video/video.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Text Overlay - left 40%, overlapping video on large screens */}
          <div className="pt-20 lg:absolute lg:left-0 lg:top-0 lg:h-full w-full lg:w-[50%] flex items-center justify-center lg:justify-start z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ 
                opacity: 1, 
                x: isVideoEnded ? 200 : 0
              }}
              transition={{ 
                duration: 0.8,
                x: { duration: 1.5, ease: "easeInOut" }
              }}
              className={cn(
                "relative lg:bg-background/95 lg:backdrop-blur-xl p-0 lg:p-16 text-center lg:text-left flex flex-col items-center lg:items-start",
                "lg:shadow-[20px_0_40px_rgba(0,0,0,0.3),10px_0_20px_rgba(0,0,0,0.2)]",
                "lg:[clip-path:polygon(0_0,_95%_0,_100%_100%,_0_100%)]"
              )}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-6 lg:mb-6">
                <Award className="w-4 h-4" />
                {dict.tag}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 lg:mb-6">
                {dict.title}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                {dict.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Scientific Partners */}
        <div className="mb-12 lg:mb-24">
          <h3 className="text-2xl font-bold mb-6 lg:mb-8 text-center">{dict.scientificPartnersTitle}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {dict.scientificPartners.map((partner: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg group"
              >
               <div className="flex items-start justify-between mb-4">
                  <div className="relative h-12 w-full max-w-[160px]">
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain object-left  transition-all duration-500"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform">
                        {partner.abbreviation}
                      </div>
                    )}
                  </div>
                  {partner.url && (
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <h4 className="font-semibold text-sm leading-snug mb-2">{partner.name}</h4>

              </motion.div>
            ))}
          </div>
        </div>

        {/* Association Membership */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-6 md:p-16 text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center">
                <Award className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl md:text-4xl font-bold mb-4">{dict.associationTitle}</h3>
            <p className="text-muted-foreground text-lg md:text-xl mb-8 lg:mb-12 max-w-2xl mx-auto">{dict.associationDescription}</p>
            <div className="flex flex-wrap justify-center gap-8">
              {dict.associations.map((assoc: any, index: number) => (
                <div
                  key={index}
                  className="bg-background border border-border rounded-2xl p-8 flex flex-col items-center gap-6 hover:border-primary/50 transition-all hover:shadow-xl group min-w-[300px]"
                >
                  {assoc.logo && (
                    <div className="relative h-20 w-48">
                      <Image
                        src={assoc.logo}
                        alt={assoc.name}
                        fill
                        className="object-contain  transition-all duration-500"
                      />
                    </div>
                  )}
                  <div className="font-bold text-base md:text-lg max-w-xs">{assoc.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
