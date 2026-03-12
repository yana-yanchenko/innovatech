import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import Innovation from "@/components/Innovation";
import Benefits from "@/components/Benefits";
import Process from "@/components/Process";
import Showcase from "@/components/Showcase";
import Testimonials from "@/components/Testimonials";
import Impact from "@/components/Impact";
import Awards from "@/components/Awards";
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
  
  // Determine region for contact info
  const region = (lang === 'by' ? 'by' : lang === 'kk' ? 'kk' : 'ru') as 'ru' | 'by' | 'kk';

  return (
    <ContactDialogProvider dict={dict}>
      <div className="flex min-h-screen flex-col">
        <Navbar lang={lang} dict={dict.navbar} />
        <main>
          <Hero dict={dict.hero} />
          <Solutions dict={dict.solutions} />
          {/* <Innovation dict={dict.innovation} /> */}
          <Benefits dict={dict.benefits} />
          <Process dict={dict.process} />
          <Showcase dict={dict.showcase} />
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
