import { headers } from "next/headers";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EngineeringSystemsPage from "@/components/EngineeringSystemsPage";
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
  const es = dict.engineeringSystems;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://innovatech.com';

  return {
    title: es.heroTitle,
    description: es.heroDescription,
    alternates: {
      canonical: `/${lang}/engineering-systems`,
      languages: {
        en: '/en/engineering-systems',
        ru: '/ru/engineering-systems',
        kk: '/kk/engineering-systems',
      },
    },
    openGraph: {
      title: es.heroTitle,
      description: es.heroDescription,
      url: `${baseUrl}/${lang}/engineering-systems`,
      siteName: 'InnovaTech',
      locale: lang === 'en' ? 'en_US' : lang === 'ru' ? 'ru_RU' : 'kk_KZ',
      type: 'website',
    },
  };
}

export default async function EngineeringSystems({
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
        <EngineeringSystemsPage dict={dict.engineeringSystems} />
      </main>
      <Footer dict={dict.footer} region={region} />
    </ContactDialogProvider>
  );
}
