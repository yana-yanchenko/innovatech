import React from 'react';
import { Factory, Wind, Droplets, Cpu, Sprout, Package, Layers, TreePine, Wrench, Leaf, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface SolutionItem {
  title: string;
  description: string;
}

interface SolutionDict {
  items: SolutionItem[];
  tag: string;
  title: string;
  description: string;
  learnMore: string;
  comingSoon?: string;
}

interface SolutionWithMeta extends SolutionItem {
  icon: React.ReactNode;
  link: string | null;
  color: string;
}

const Solutions = ({ dict, lang }: { dict: SolutionDict; lang: string }) => {
  // link: null — раздел без реализованной страницы (карточка некликабельна)
  const solutionMeta = [
    { icon: <Factory className="w-8 h-8" />, link: `/${lang}/greenhouse-structures`, color: 'bg-primary/10 text-primary' },
    { icon: <Wind className="w-8 h-8" />, link: `/${lang}/engineering-systems`, color: 'bg-blue-500/10 text-blue-500' },
    { icon: <Droplets className="w-8 h-8" />, link: `/${lang}/irrigation-systems`, color: 'bg-cyan-500/10 text-cyan-500' },
    { icon: <Cpu className="w-8 h-8" />, link: `/${lang}/substrate-equipment`, color: 'bg-purple-500/10 text-purple-500' },
    { icon: <Package className="w-8 h-8" />, link: `/${lang}/peat-filling-equipment`, color: 'bg-green-500/10 text-green-500' },
    { icon: <Layers className="w-8 h-8" />, link: `/${lang}/paperpot-equipment`, color: 'bg-orange-500/10 text-orange-500' },
    { icon: <Sprout className="w-8 h-8" />, link: `/${lang}/cultivation-equipment`, color: 'bg-emerald-500/10 text-emerald-500' },
    { icon: <TreePine className="w-8 h-8" />, link: null, color: 'bg-lime-500/10 text-lime-600' },
    { icon: <Wrench className="w-8 h-8" />, link: null, color: 'bg-slate-500/10 text-slate-500' },
    { icon: <Leaf className="w-8 h-8" />, link: null, color: 'bg-teal-500/10 text-teal-500' },
  ];

  const solutions: SolutionWithMeta[] = dict.items.map((item, i) => ({
    ...item,
    ...(solutionMeta[i] ?? { icon: <Factory className="w-8 h-8" />, link: null, color: 'bg-muted text-muted-foreground' })
  }));

  return (
    <section id="solutions" className="py-24 bg-muted/30">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((item, index) => {
            const cardInner = (
              <Card className={`relative h-full transition-all ${item.link ? 'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5' : 'border-dashed'}`}>
                {!item.link && dict.comingSoon && (
                  <span className="absolute top-4 right-4 z-10 rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {dict.comingSoon}
                  </span>
                )}
                <CardHeader>
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-4 transition-transform ${item.link ? 'group-hover:scale-110' : 'grayscale'}`}>
                    {item.icon}
                  </div>
                  <CardTitle className={`transition-colors flex items-center gap-2 ${item.link ? 'group-hover:text-primary' : 'text-muted-foreground'}`}>
                    {item.title}
                    {item.link && (
                      <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
                {item.link && (
                  <CardFooter className="border-t pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-bold text-primary">
                      {dict.learnMore}
                    </span>
                  </CardFooter>
                )}
              </Card>
            );

            return item.link ? (
              <Link key={index} href={item.link} className="group">
                {cardInner}
              </Link>
            ) : (
              <div key={index} className="cursor-not-allowed opacity-60" aria-disabled="true">
                {cardInner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Solutions;
