import Achievements from "@/components/sections/Achievements";
import Admission from "@/components/sections/Admission";
import Documents from "@/components/sections/Documents";
import Events from "@/components/sections/Events";
import Faq from "@/components/sections/Faq";
import Hero from "@/components/sections/Hero";
import ModuleIndex from "@/components/sections/ModuleIndex";
import News from "@/components/sections/News";
import Testimonials from "@/components/sections/Testimonials";
import { homeSections } from "@/data/home";
import { getAchievements, getDocuments, getFaq, getNews, getTestimonials, getUpcomingEvents } from "@/lib/data";

/**
 * PORTADA
 * Ya no es una página larga: es la puerta de entrada. Presenta el colegio (hero) y, debajo, las secciones que la
 * clienta eligió y ordenó en el panel (data/home.ts): índice de módulos, eventos, noticias, testimonios, logros,
 * documentos, preguntas y la invitación a la admisión. Cada módulo vive en su propia ruta (ver data/modules.ts).
 */
export default async function HomePage() {
  const visible = homeSections.filter((section) => section.show).map((section) => section.id);
  const [news, events, testimonials, achievements, documents, faq] = await Promise.all([
    visible.includes("noticias") ? getNews(4) : [],
    visible.includes("eventos") ? getUpcomingEvents(4) : [],
    visible.includes("testimonios") ? getTestimonials() : [],
    visible.includes("logros") ? getAchievements() : [],
    visible.includes("documentos") ? getDocuments() : [],
    visible.includes("preguntas") ? getFaq() : [],
  ]);

  const sections = {
    modulos: <ModuleIndex />,
    eventos: <Events events={events} />,
    noticias: <News posts={news} />,
    testimonios: <Testimonials testimonials={testimonials} />,
    logros: <Achievements items={achievements} />,
    documentos: <Documents items={documents} limit={6} />,
    preguntas: <Faq items={faq} />,
    admision: <Admission />,
  };

  return (
    <>
      <Hero />
      {visible.map((id) => (
        <div key={id}>{sections[id]}</div>
      ))}
    </>
  );
}
