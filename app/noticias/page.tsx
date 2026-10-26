import type { Metadata } from "next";
import News from "@/components/sections/News";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { getModule } from "@/data/modules";
import { settings } from "@/data/settings";
import { getNews } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { moduleMetadata } from "@/lib/seo";

const mod = getModule("noticias");

export const metadata: Metadata = moduleMetadata(mod);

export default async function NewsPage() {
  const posts = await getNews();
  const latest = posts[0]?.date;

  return (
    <>
      <ModuleHeader module={mod}>
        {/* Línea de "edición", como la cabecera de un periódico */}
        <p className="hero-in mt-10 flex flex-wrap gap-x-4 gap-y-1 border-y-2 border-noche py-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-noche">
          <span>{settings.shortName}</span>
          <span aria-hidden="true">·</span>
          <span>
            {settings.location.district}, {settings.location.province}
          </span>
          {latest && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Última publicación: <time dateTime={latest}>{formatDate(latest)}</time>
              </span>
            </>
          )}
        </p>
      </ModuleHeader>
      <News posts={posts} showAllLink={false} showIntro={false} />
      <NextModule current={mod.id} />
    </>
  );
}
