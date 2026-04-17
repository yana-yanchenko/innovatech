'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ShowcaseProps {
  dict: {
    tag: string;
    title: string;
    description: string;
    projects?: Array<{
      src: string;
      title: string;
      location: string;
      area: string;
      className: string;
      delay: number;
    }>;
  };
}

const Showcase = ({ dict }: ShowcaseProps) => {
  const projects = dict.projects || [
    {
      src: "/carl-raw-f6wVRC7Y4aI-unsplash.jpg",
      title: "Промышленный комплекс",
      location: "Московская область, РФ",
      area: "15 Га",
      className: "md:col-span-2 md:row-span-2",
      delay: 0.1
    },
    {
      src: "/8cb72ba24912f6fc185c2ec5e97f8b3f3cce12eb.png",
      title: "Фермерское хозяйство",
      location: "Минская область, BY",
      area: "3.5 Га",
      className: "md:col-span-1 md:row-span-1",
      delay: 0.2
    },
    {
      src: "/22da4f7424356bc87bde97f4481b79932f1f4954.jpg",
      title: "Рассадный комплекс",
      location: "Алматы, KZ",
      area: "8 Га",
      className: "md:col-span-1 md:row-span-2",
      delay: 0.3
    },
    {
      src: "/1287acee185014c2f581f67f2dfd56bafea7012e.jpg",
      title: "Салатная линия",
      location: "Санкт-Петербург, РФ",
      area: "2 Га",
      className: "md:col-span-1 md:row-span-1",
      delay: 0.4
    },
    {
      src: "/c4f85a9b6c6c290cf23558c8df585c3b8596d2d0.jpg",
      title: "Лесной питомник",
      location: "Гродненская область, BY",
      area: "12 Га",
      className: "md:col-span-2 md:row-span-1",
      delay: 0.5
    },
    {
      src: "/cover-scaled.webp",
      title: "Эко-резиденция",
      location: "Подмосковье, РФ",
      area: "0.5 Га",
      className: "md:col-span-2 md:row-span-1",
      delay: 0.6
    }
  ];

  return (
    <section id="showcase" className="pt-24 bg-muted/30">
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <div className="max-w-3xl mb-16 space-y-6">
          <h2 className="text-primary font-bold tracking-wider uppercase text-sm">{dict.tag}</h2>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {dict.title}
            </span>
          </h3>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
            {dict.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {projects.map((project: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: project.delay }}
              className={`relative overflow-hidden rounded-3xl border border-border group ${project.className} bg-muted cursor-pointer`}
            >
              <motion.div
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: project.delay + 0.2 }}
                className="absolute inset-0 bg-muted z-10 pointer-events-none"
              />
              <Image
                src={project.src}
                alt={`${project.title} - ${project.location}, ${project.area}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA3gAAA/9k="
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Project info on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-bold text-lg mb-1">{project.title}</h4>
                <p className="text-sm text-white/80 mb-2">{project.location}</p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {project.area}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
