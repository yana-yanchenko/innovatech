import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
// import Innovation from "@/components/Innovation";
import Benefits from "@/components/Benefits";
import Process from "@/components/Process";
// import Testimonials from "@/components/Testimonials";
// import Impact from "@/components/Impact";
// import Awards from "@/components/Awards";
import TrustMetrics from "@/components/TrustMetrics";
import ProjectsMap from "@/components/ProjectsMap";
import Partners from "@/components/Partners";
import FAQ from "@/components/FAQ";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import { ContactDialogProvider } from "@/components/ContactDialogProvider";
import { getDictionary } from "@/lib/get-dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as 'en' | 'ru' | 'kk');
  const headersList = await headers();
  const country = headersList.get('x-vercel-ip-country');
  
  // Determine region for contact info
  let region: 'ru' | 'by' | 'kk' = (lang === 'kk' ? 'kk' : 'ru');
  
  if (lang === 'ru') {
    if (country === 'BY') {
      region = 'by';
    } else if (country === 'KZ') {
      region = 'kk';
    }
  }

  return (
    <ContactDialogProvider dict={dict}>
      <div className="flex min-h-screen flex-col">
        <Navbar lang={lang} dict={dict.navbar} />
        <main>
          <Hero dict={dict.hero} />
          <Solutions dict={dict.solutions} lang={lang} />
          {/* <Innovation dict={dict.innovation} /> */}
          <Benefits dict={dict.benefits} />
          <Process dict={dict.process} />
          {/* <Testimonials dict={dict.testimonials} /> */}
          {/* <Impact dict={dict.impact} /> */}
          {/* <Awards dict={dict.awards} /> */}
          <TrustMetrics dict={dict.trustMetrics} />
          <ProjectsMap dict={dict.projectsMap} />
          <Partners dict={dict.partners} />
          <FAQ dict={dict.faq} />
          <ContactCTA dict={dict.contactCTA} region={region} />
        </main>
        <Footer dict={dict.footer} region={region} />
      </div>
    </ContactDialogProvider>
  );
}
