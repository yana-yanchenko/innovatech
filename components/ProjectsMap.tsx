'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  location: string;
  lat: number;
  lng: number;
  area: string;
  type: string;
  year: string;
  image: string;
  description: string;
}

const ProjectsMap = ({ dict }: { dict: any }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Sample projects data - replace with real data
  const projects: Project[] = dict.items || [];

  const projectTypes = [
    { id: 'all', label: dict.all || 'Все проекты', color: 'bg-primary' },
    { id: 'industrial', label: dict.industrial || 'Промышленные', color: 'bg-blue-500' },
    { id: 'farm', label: dict.farm || 'Фермерские', color: 'bg-green-500' },
    { id: 'seedling', label: dict.seedling || 'Рассадные', color: 'bg-amber-500' },
  ];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.type === filter);

  const visibleProjects = isExpanded ? filteredProjects : filteredProjects.slice(0, 6);

  return (
    <>
      <section className=" bg-background">
        <div className="container mx-auto px-3 md:px-4 lg:px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-semibold">
              <MapPin className="w-4 h-4" />
              {dict.tag}
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {dict.title}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {dict.description}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {projectTypes.map((type) => (
              <Button
                key={type.id}
                onClick={() => {
                  setFilter(type.id);
                  setIsExpanded(false);
                }}
                variant={filter === type.id ? 'default' : 'outline'}
                className="rounded-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                {type.label}
              </Button>
            ))}
          </div>

          {/* Map Visualization */}
          <div className="max-w-6xl mx-auto mb-12">
            <Card className="gap-0 overflow-hidden border py-0 shadow-sm">
              <CardContent className="p-0">
                <div className="relative h-[650px] w-full md:h-[720px] bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

                  {/* Professional grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, currentColor 1px, transparent 1px),
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)
                      `,
                      backgroundSize: '60px 60px'
                    }}
                  />

                  {/* Subtle connection lines between projects */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.15] dark:opacity-[0.25] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="connectionLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                        <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line x1="20%" y1="35%" x2="35%" y2="30%" stroke="url(#connectionLine)" strokeWidth="1.5" className="text-primary"/>
                    <line x1="35%" y1="30%" x2="70%" y2="55%" stroke="url(#connectionLine)" strokeWidth="1.5" className="text-primary"/>
                    <line x1="30%" y1="20%" x2="35%" y2="30%" stroke="url(#connectionLine)" strokeWidth="1.5" className="text-primary"/>
                  </svg>

                  {/* Project markers with better positioning */}
                  {filteredProjects.map((project, index) => {
                    // Positioning markers on decorative map (representing CIS region)
                    // Scale: lng [20 to 140] maps to x [10% to 90%], lat [40 to 65] maps to y [85% to 15%]
                    const x = ((project.lng - 20) / (140 - 20)) * 80 + 10;
                    const y = 100 - (((project.lat - 40) / (65 - 40)) * 70 + 15);
                    const position = { x, y };

                    return (
                      <motion.div
                        key={project.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                        className="absolute cursor-pointer group z-10"
                        style={{ left: `${position.x}%`, top: `${position.y}%` }}
                        onClick={() => setSelectedProject(project)}
                      >
                        {/* Subtle pulse rings */}
                        <div className="absolute inset-0 w-10 h-10 -translate-x-1 -translate-y-1">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping" style={{ animationDuration: '3s' }}></span>
                        </div>

                        <div className="relative">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-125 transition-all duration-300 border-2 border-background">
                            <MapPin className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg z-20">
                            <p className="text-xs font-semibold text-foreground">{project.title}</p>
                            <p className="text-xs text-muted-foreground">{project.location}</p>
                            <p className="text-xs text-primary font-medium mt-1">{project.area}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Minimalist Legend */}
                  <div className="absolute top-4 right-6 bg-background/90 backdrop-blur-md border border-border/50 rounded-xl px-6 py-3 shadow-sm">
                    <p className="text-xs font-medium mb-1.5 text-foreground/80">{dict.mapNote || 'География СНГ'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium">{filteredProjects.length} {dict.countLabel || 'проектов'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 6) * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "cursor-pointer",
                  !isExpanded && index >= 3 && "hidden md:block"
                )}
              >
                <Card className="h-full hover:border-primary/50 hover:shadow-xl transition-all group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm">{project.year}</Badge>
                    <Badge variant="outline" className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm border-none text-[10px] uppercase tracking-wider font-bold">
                      {project.type === 'seedling' ? dict.seedling : project.type === 'industrial' ? dict.industrial : dict.farm}
                    </Badge>
                  </div>
                  <CardHeader className="p-5">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1 mb-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {project.location}
                      </div>
                      <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {project.area}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic border-l-2 border-primary/20 pl-3 py-1">
                        {project.description}
                      </p>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {!isExpanded && (
            <div className="mt-12 text-center">
              {filteredProjects.length > 3 && filteredProjects.length <= 6 && (
                <Button
                  onClick={() => setIsExpanded(true)}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 md:hidden"
                >
                  {dict.showMore || 'Показать еще'}
                </Button>
              )}
              {filteredProjects.length > 6 && (
                <Button
                  onClick={() => setIsExpanded(true)}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  {dict.showMore || 'Показать еще'}
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-background/85 p-2 backdrop-blur-sm transition-colors hover:bg-muted sm:right-4 sm:top-4"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[90vh] overflow-y-auto">
              <div className="relative h-44 w-full sm:h-64">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute left-4 top-4">{selectedProject.year}</Badge>
              </div>

              <div className="space-y-4 p-4 pb-6 sm:p-8">
                <h3 className="pr-12 text-2xl font-bold text-foreground sm:text-3xl">
                  {selectedProject.title}
                </h3>

                <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedProject.location}</span>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {selectedProject.area}
                  </Badge>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {selectedProject.description}
                </p>

                {/*<Button className="w-full rounded-2xl">*/}
                {/*  {dict.viewDetails || 'Подробнее о проекте'}*/}
                {/*</Button>*/}
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsMap;
