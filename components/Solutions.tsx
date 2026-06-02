import React from 'react';
import { LayoutGrid, Factory, Home, Wind, Droplets, Cpu, Sprout, Package, ArrowUpRight } from 'lucide-react';
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
}

interface SolutionWithMeta extends SolutionItem {
  icon: React.ReactNode;
  link: string;
  color: string;
}

const Solutions = ({ dict, lang }: { dict: SolutionDict; lang: string }) => {
  const solutionMeta = [
    { icon: <Factory className="w-8 h-8" />, link: `/${lang}/greenhouse-structures`, color: 'bg-primary/10 text-primary' },
    { icon: <Wind className="w-8 h-8" />, link: '/solutions/climate', color: 'bg-blue-500/10 text-blue-500' },
    { icon: <Droplets className="w-8 h-8" />, link: `/${lang}/irrigation-systems`, color: 'bg-cyan-500/10 text-cyan-500' },
    { icon: <Cpu className="w-8 h-8" />, link: `/${lang}/substrate-equipment`, color: 'bg-purple-500/10 text-purple-500' },
    { icon: <Package className="w-8 h-8" />, link: `/${lang}/peat-filling-equipment`, color: 'bg-green-500/10 text-green-500' },
    { icon: <LayoutGrid className="w-8 h-8" />, link: '/solutions/materials', color: 'bg-orange-500/10 text-orange-500' },
    { icon: <Home className="w-8 h-8" />, link: '/solutions/specialized', color: 'bg-amber-500/10 text-amber-500' },
  ];

  const solutions: SolutionWithMeta[] = dict.items.map((item, i) => ({
    ...item,
    ...solutionMeta[i % solutionMeta.length]
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
          {solutions.map((item, index) => (
            <Link key={index} href={item.link} className="group">
              <Card className="h-full hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all">
                <CardHeader>
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                    {item.title}
                    <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="border-t pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-bold text-primary">
                    {dict.learnMore}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;
