'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const Partners = ({ dict }: { dict: any }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section id="partners" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Video Header Section */}
        <div className="relative w-full h-[600px] mb-24 overflow-hidden">
          {/* Video Layer - shifted right 60% */}
          <div className="absolute right-0 top-0 w-full md:w-[60%] h-full">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              autoPlay
              onEnded={(e) => {
                const video = e.currentTarget;
                video.pause();
              }}
              style={{ filter: 'brightness(0.9)' }}
            >
              <source src="/video/video.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Text Overlay - left 40%, overlapping video */}
          <div className="absolute left-0 top-0 h-full w-full md:w-[45%] flex items-center z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative bg-background/95 backdrop-blur-xl p-8 md:p-12"
              style={{
                clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0 100%)',
                boxShadow: '20px 0 40px rgba(0, 0, 0, 0.3), 10px 0 20px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-6">
                <Award className="w-4 h-4" />
                {dict.tag}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                {dict.title}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                {dict.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Scientific Partners */}
        <div className="mb-24">
          <h3 className="text-2xl font-bold mb-8 text-center">{dict.scientificPartnersTitle}</h3>
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
          <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-8 md:p-16 text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center">
                <Award className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">{dict.associationTitle}</h3>
            <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto">{dict.associationDescription}</p>
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
                  <div className="font-bold text-lg max-w-xs">{assoc.name}</div>
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
