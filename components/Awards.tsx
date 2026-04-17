'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Shield, CheckCircle2, Star, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AwardItem {
  title: string;
  organization: string;
  year: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const Awards = ({ dict }: { dict: any }) => {
  const [selectedAward, setSelectedAward] = useState<any | null>(null);

  const awardsData: AwardItem[] = [
    {
      title: dict.iso9001 || 'ISO 9001:2015',
      organization: dict.isoOrg || 'Международная организация по стандартизации',
      year: '2020',
      description: dict.iso9001Desc || 'Сертификат системы менеджмента качества',
      icon: <Shield className="w-8 h-8" />,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: dict.gost || 'ГОСТ Р ИСО 9001-2015',
      organization: dict.gostOrg || 'Росстандарт',
      year: '2020',
      description: dict.gostDesc || 'Российский стандарт системы менеджмента качества',
      icon: <CheckCircle2 className="w-8 h-8" />,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: dict.qualityStandards || 'Европейские стандарты',
      organization: dict.euOrg || 'Европейский союз',
      year: '2021',
      description: dict.euDesc || 'Соответствие европейским стандартам качества',
      icon: <Star className="w-8 h-8" />,
      color: 'bg-amber-500/10 text-amber-500',
    },
    {
      title: dict.bestSupplier || 'Лучший поставщик года',
      organization: dict.industryOrg || 'Ассоциация производителей',
      year: '2023',
      description: dict.bestSupplierDesc || 'Награда за качество продукции и сервиса',
      icon: <Award className="w-8 h-8" />,
      color: 'bg-primary/10 text-primary',
    },
  ];

  // Map projects to timeline items if provided
  // const timelineItems = projects ? projects.map(p => ({
  //   title: p.title,
  //   organization: p.location,
  //   year: p.year,
  //   description: p.description,
  //   icon: <Award className="w-8 h-8" />,
  //   color: 'bg-primary text-primary-foreground'
  // })).sort((a, b) => b.year.localeCompare(a.year)) : awardsData;
  const timelineItems = awardsData;

  return (
    <>
      <section className="pb-24 bg-muted/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

        <div className="container mx-auto px-3 md:px-4 lg:px-6 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-semibold">
              <Award className="w-4 h-4" />
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

          {/* Awards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {awardsData.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedAward(award)}
                className="cursor-pointer"
              >
                <Card className="h-full hover:border-primary/50 hover:shadow-xl transition-all group">
                  <CardHeader className="text-center">
                    <div className={`w-20 h-20 ${award.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      {award.icon}
                    </div>
                    <Badge variant="outline" className="mb-2 mx-auto">
                      {award.year}
                    </Badge>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {award.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {award.organization}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Timeline - Commented out as requested
          <div className="mt-20 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
              {dict.timeline || 'Временная шкала достижений'}
            </h3>
            <div className="relative">
              <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-8 md:space-y-12">
                {timelineItems.map((award, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(index * 0.1, 0.5) }}
                    className={`flex items-center gap-4 md:gap-8 cursor-pointer ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                    onClick={() => setSelectedAward(award)}
                  >
                    <div className="relative flex-shrink-0 md:hidden">
                      <div className={`w-4 h-4 ${award.color.split(' ')[0]} rounded-full border-4 border-background shadow-lg`} />
                    </div>

                    <div className="flex-1 md:text-left">
                      <div className={`${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <Badge variant="outline" className="mb-2">
                          {award.year}
                        </Badge>
                        <h4 className="text-lg font-bold text-foreground mb-1">
                          {award.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {award.organization}
                        </p>
                      </div>
                    </div>

                    <div className="relative hidden md:block flex-shrink-0">
                      <div className={`w-4 h-4 ${award.color.split(' ')[0]} rounded-full border-4 border-background shadow-lg`} />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          */}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAward(null)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-8 max-w-lg w-full relative"
            >
              <button
                onClick={() => setSelectedAward(null)}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-24 h-24 ${selectedAward.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                {selectedAward.icon}
              </div>

              <div className="text-center space-y-4">
                <Badge variant="outline" className="mb-2">
                  {selectedAward.year}
                </Badge>
                <h3 className="text-2xl font-bold text-foreground">
                  {selectedAward.title}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {selectedAward.organization}
                </p>
                <p className="text-muted-foreground leading-relaxed pt-4">
                  {selectedAward.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Awards;
