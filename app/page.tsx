import Admission from "@/components/sections/Admission";
import Hero from "@/components/sections/Hero";
import ModuleIndex from "@/components/sections/ModuleIndex";
import News from "@/components/sections/News";
import { getNews } from "@/lib/data";

/**
 * PORTADA
 * Ya no es una página larga: es la puerta de entrada. Presenta el colegio (hero),
 * ofrece un índice de módulos con su propio color, lo más reciente y la invitación a la admisión.
 * Cada módulo vive en su propia ruta (ver data/modules.ts).
 */
export default async function HomePage() {
  const news = await getNews(4);

  return (
    <>
      <Hero />
      <ModuleIndex />
      <News posts={news} />
      <Admission />
    </>
  );
}
