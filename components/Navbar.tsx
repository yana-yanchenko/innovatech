'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Building2, Droplets, Sun, Bot, Sprout, Package, Salad, Wrench, MessageCircle, Settings2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { useContactDialog } from './ContactDialogProvider';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';

interface NavbarSolutionItem {
  name: string;
  description: string;
  href: string;
}

interface NavbarDict {
  tagline?: string;
  technologies: string;
  company: string;
  contact: string;
  solutions: string;
  solutionsList: NavbarSolutionItem[];
  getQuote: string;
}

const Navbar = ({ lang, dict }: { lang: string, dict: NavbarDict }) => {
  const [scrolled, setScrolled] = useState(false);
  const { openDialog } = useContactDialog();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;
  const localizedPath = pathname?.replace(/^\/(en|ru|kk)(?=\/|$)/, '') || '';

  const resolveHref = (href: string) => {
    if (!href.startsWith('#')) return href;
    return `${isHomePage ? '' : `/${lang}`}${href}`;
  };

  const navLinks = [
    { name: dict.technologies, href: resolveHref('#innovation') },
    { name: dict.company, href: resolveHref('#benefits') },
    { name: dict.contact, href: resolveHref('#contact') },
  ];

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'kk', label: 'KK' },
  ];

  // Icons mapping for solutions
  const solutionIcons: Record<number, React.ReactNode> = {
    0: <Building2 className="w-5 h-5" />,      // Greenhouse Structures
    1: <Sun className="w-5 h-5" />,            // Climate Systems
    2: <Droplets className="w-5 h-5" />,       // Irrigation
    3: <Bot className="w-5 h-5" />,            // Automation
    4: <Sprout className="w-5 h-5" />,         // Seedling Equipment
    5: <Package className="w-5 h-5" />,        // Materials
    6: <Salad className="w-5 h-5" />,          // Specialized Equipment
    7: <Wrench className="w-5 h-5" />,         // Service & Installation
    8: <Settings2 className="w-5 h-5" />,      // Engineering Greenhouse Systems
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border' : 'bg-transparent border-b border-transparent'}`}
    >
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <div className="flex min-h-[72px] sm:min-h-[84px] items-center justify-between gap-2">
          {/* Logo - tagline скрывается до 1280px для экономии места */}
          <Link href={`/${lang}`} className="group flex-shrink-0">
            <div className="hidden xl:block">
              <Logo tagline={dict.tagline} />
            </div>
            {/* Компактная версия до 1280px */}
            <div className="xl:hidden">
              <Logo />
            </div>
          </Link>

          {/* Desktop Navigation - показывается с 1024px */}
          <div className="hidden lg:flex items-center flex-1 justify-end" style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
            <NavigationMenu>
              <NavigationMenuList>
                {/* Solutions Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="text-sm font-medium text-muted-foreground hover:text-primary bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent data-[state=open]:text-primary whitespace-nowrap"
                    style={{ fontSize: 'clamp(0.813rem, 0.9vw, 0.875rem)' }}
                  >
                    {dict.solutions}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[500px] gap-2 p-4 md:grid-cols-2">
                      {dict.solutionsList.map((solution, index) => (
                        <ListItem
                          key={index}
                          title={solution.name}
                          href={resolveHref(solution.href)}
                          icon={solutionIcons[index]}
                        >
                          {solution.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Other Nav Links */}
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 whitespace-nowrap"
                      style={{
                        fontSize: 'clamp(0.813rem, 0.9vw, 0.875rem)',
                        paddingLeft: 'clamp(0.5rem, 1vw, 0.75rem)',
                        paddingRight: 'clamp(0.5rem, 1vw, 0.75rem)'
                      }}
                    >
                      {link.name}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div
              className="flex items-center border-l border-border"
              style={{
                gap: 'clamp(0.375rem, 0.8vw, 0.5rem)',
                paddingLeft: 'clamp(0.5rem, 1.2vw, 0.75rem)',
                marginLeft: 'clamp(0.25rem, 0.5vw, 0.375rem)'
              }}
            >
              <ThemeToggle />
              <div className="flex items-center gap-1">
                {languages.map((l) => (
                  <Link
                    key={l.code}
                    href={`/${l.code}${localizedPath}`}
                    className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${lang === l.code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary'}`}
                    style={{ fontSize: 'clamp(0.688rem, 0.75vw, 0.75rem)' }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <Button
              size="sm"
              onClick={openDialog}
              className="rounded-full whitespace-nowrap"
              style={{
                marginLeft: 'clamp(0.25rem, 0.5vw, 0.375rem)',
                fontSize: 'clamp(0.813rem, 0.9vw, 0.875rem)',
                paddingLeft: 'clamp(0.75rem, 1.5vw, 1rem)',
                paddingRight: 'clamp(0.75rem, 1.5vw, 1rem)'
              }}
            >
              <span className="hidden xl:inline">{dict.getQuote}</span>
              <MessageCircle className="xl:hidden" size={18} />
            </Button>
          </div>

          {/* Mobile/Tablet Navigation - показывается до 1024px */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Theme Toggle и языки для планшетов */}
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />
              <div className="flex items-center gap-1">
                {languages.map((l) => (
                  <Link
                    key={l.code}
                    href={`/${l.code}${localizedPath}`}
                    className={`text-xs font-bold px-2 py-1 rounded ${lang === l.code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Drawer Button */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <button className="text-foreground p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <Menu size={24} />
                </button>
              </DrawerTrigger>
              <DrawerContent className="h-full w-[85vw] sm:w-[350px] max-w-[400px] fixed right-0 top-0 bottom-0 rounded-none">
                <DrawerHeader className="text-left border-b">
                  <DrawerTitle>
                    <Logo />
                  </DrawerTitle>
                  <DrawerDescription className="sr-only">
                    Navigation menu
                  </DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="space-y-6">
                    {/* Solutions Section */}
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                        {dict.solutions}
                      </h3>
                      <div className="space-y-1">
                        {dict.solutionsList.map((solution, index) => (
                          <DrawerClose key={index} asChild>
                            <Link
                              href={resolveHref(solution.href)}
                              className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                {solutionIcons[index]}
                              </div>
                              <div className="text-sm flex-1 min-w-0">
                                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                  {solution.name}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                  {solution.description}
                                </div>
                              </div>
                            </Link>
                          </DrawerClose>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Main Nav Links */}
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <DrawerClose key={link.name} asChild>
                          <Link
                            href={link.href}
                            className="block text-base font-medium text-foreground py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            {link.name}
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>

                    <Separator />

                    {/* Language & Theme - только для мобильных */}
                    <div className="space-y-4 sm:hidden">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                          Language
                        </h3>
                        <div className="flex items-center gap-2">
                          {languages.map((l) => (
                            <Link
                              key={l.code}
                              href={`/${l.code}${localizedPath}`}
                              className={`text-sm font-bold px-3 py-2 rounded-lg flex-1 text-center ${
                                lang === l.code
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
                              }`}
                            >
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                          Theme
                        </h3>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </div>

                <DrawerFooter className="pt-4 border-t">
                  <DrawerClose asChild>
                    <Button onClick={openDialog} className="rounded-xl w-full">
                      {dict.getQuote}
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ListItem Component with Icon
function ListItem({
  title,
  children,
  href,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
        >
          <div className="flex items-start gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                {icon}
              </div>
            )}
            <div className="flex-1 space-y-1 min-w-0">
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="text-xs leading-snug text-muted-foreground line-clamp-2">
                {children}
              </p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default Navbar;
