import { headers } from "next/headers";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaperPotPage from "@/components/PaperPotPage";
import { ContactDialogProvider } from "@/components/ContactDialogProvider";
import { getDictionary } from "@/lib/get-dictionaries";

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ru' }, { lang: 'kk' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ru' | 'kk');
  const pp = dict.paperPot;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://innovatech.com';

  return {
    title: pp.heroTitle,
    description: pp.heroDescription,
    alternates: {
      canonical: `/${lang}/paperpot-equipment`,
      languages: {
        en: '/en/paperpot-equipment',
        ru: '/ru/paperpot-equipment',
        kk: '/kk/paperpot-equipment',
      },
    },
    openGraph: {
      title: pp.heroTitle,
      description: pp.heroDescription,
      url: `${baseUrl}/${lang}/paperpot-equipment`,
      siteName: 'InnovaTech',
      locale: lang === 'en' ? 'en_US' : lang === 'ru' ? 'ru_RU' : 'kk_KZ',
      type: 'website',
    },
  };
}

export default async function PaperPotEquipment({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ru' | 'kk');
  const headersList = await headers();
  const country = headersList.get('x-vercel-ip-country');

  let region: 'ru' | 'by' | 'kk' = lang === 'kk' ? 'kk' : 'ru';
  if (lang === 'ru') {
    if (country === 'BY') region = 'by';
    else if (country === 'KZ') region = 'kk';
  }

  return (
    <ContactDialogProvider dict={dict}>
      <Navbar lang={lang} dict={dict.navbar} />
      <main>
        <PaperPotPage dict={dict.paperPot} />
      </main>
      <Footer dict={dict.footer} region={region} />
    </ContactDialogProvider>
  );
}
