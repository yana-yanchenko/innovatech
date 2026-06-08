import { headers } from "next/headers";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CultivationEquipmentPage from "@/components/CultivationEquipmentPage";
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
  const ce = dict.cultivationEquipment;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://innovatech.com';

  return {
    title: ce.heroTitle,
    description: ce.heroDescription,
    alternates: {
      canonical: `/${lang}/cultivation-equipment`,
      languages: {
        en: '/en/cultivation-equipment',
        ru: '/ru/cultivation-equipment',
        kk: '/kk/cultivation-equipment',
      },
    },
    openGraph: {
      title: ce.heroTitle,
      description: ce.heroDescription,
      url: `${baseUrl}/${lang}/cultivation-equipment`,
      siteName: 'InnovaTech',
      locale: lang === 'en' ? 'en_US' : lang === 'ru' ? 'ru_RU' : 'kk_KZ',
      type: 'website',
    },
  };
}

export default async function CultivationEquipment({
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
        <CultivationEquipmentPage dict={dict.cultivationEquipment} />
      </main>
      <Footer dict={dict.footer} region={region} />
    </ContactDialogProvider>
  );
}
