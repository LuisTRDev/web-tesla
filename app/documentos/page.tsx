import Documents from "@/components/sections/Documents";
import ModuleHeader from "@/components/ui/ModuleHeader";
import { documentsTheme, pageModule } from "@/data/modules";
import { settings } from "@/data/settings";
import { getDocuments } from "@/lib/data";
import { moduleMetadata } from "@/lib/seo";

const mod = pageModule({
  id: "documentos",
  label: "Documentos",
  title: "Todo lo que necesitas, a un clic.",
  intro: "Reglamentos, listas de útiles, fichas de inscripción y otros documentos del colegio para descargar.",
  seoDescription: `Documentos para descargar de la Institución Educativa Privada “Nikola Tesla” de ${settings.location.district}, ${settings.location.province}: reglamento, fichas, listas y más.`,
  motif: "periodico",
  theme: documentsTheme,
});

export const metadata = moduleMetadata(mod, "Documentos para descargar");

export default async function DocumentsPage() {
  const documents = await getDocuments();
  const hasAny = documents.some((item) => item.fileExists);

  return (
    <>
      <ModuleHeader module={mod} />
      {hasAny ? (
        <Documents items={documents} showTitle={false} />
      ) : (
        <section className="bg-white py-20">
          <p className="mx-auto max-w-site px-5 text-lg text-niebla md:px-10">Pronto publicaremos aquí los documentos del colegio. Mientras tanto, escríbenos por WhatsApp.</p>
        </section>
      )}
    </>
  );
}
