'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnimatedCounter } from './AnimatedCounter';

const TrustMetrics = ({ dict }: { dict: any }) => {
  const metricsData = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: 87,
      suffix: '%',
      label: dict.npsScore || 'NPS Score',
      description: dict.npsDesc || 'Индекс потребительской лояльности',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: 78,
      suffix: '%',
      label: dict.repeatOrders || 'Повторных заказов',
      description: dict.repeatOrdersDesc || 'Клиенты возвращаются снова',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: 8,
      suffix: '+',
      label: dict.partnership || 'лет партнёрства',
      description: dict.partnershipDesc || 'Средняя длительность сотрудничества',
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      value: 15,
      suffix: '+',
      label: dict.regions || 'регионов СНГ',
      description: dict.regionsDesc || 'География наших проектов',
      color: 'bg-amber-500/10 text-amber-500',
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-foreground via-primary/90 to-foreground/70 bg-clip-text text-transparent">
                {dict.title}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {dict.description}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:border-primary/50 hover:shadow-xl transition-all group">
                  <CardHeader className="text-center">
                    <div className={`w-14 h-14 ${metric.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      {metric.icon}
                    </div>
                    <CardTitle className="text-4xl md:text-5xl font-bold mb-2">
                      <AnimatedCounter
                        end={metric.value}
                        suffix={metric.suffix}
                        duration={2500}
                      />
                    </CardTitle>
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {metric.label}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {metric.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
              <CardHeader>
                <CardDescription className="text-base leading-relaxed">
                  {dict.bottomText || 'Эти показатели отражают нашу приверженность качеству и долгосрочным отношениям с клиентами. Более 78% наших клиентов возвращаются для новых проектов.'}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustMetrics;
