import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ui/ButtonLink";
import DraftBadge from "@/components/ui/DraftBadge";
import ModuleHeader from "@/components/ui/ModuleHeader";
import SchoolImage from "@/components/ui/SchoolImage";
import { getModule } from "@/data/modules";
import { getNews, getNewsBySlug } from "@/lib/data";
import Markdown from "@/lib/markdown";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getNews();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getNewsBySlug(params.slug);
  if (!post) return { title: "Noticia no encontrada" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/noticias/${post.slug}` },
    // Las publicaciones de ejemplo no se indexan.
    robots: post.isPlaceholder ? { index: false, follow: false } : undefined,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default async function NewsPostPage({ params }: PageProps) {
  const post = await getNewsBySlug(params.slug);
  if (!post) notFound();

  return (
    <article>
      <ModuleHeader module={getModule("noticias")} title={post.title} intro={null} compact>
        <p className="mt-6 flex flex-wrap items-center gap-3 border-y-2 border-noche py-2 text-[15px] text-tinta/75">
          <span className="font-semibold text-rojo-700">{post.category}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.isPlaceholder && <DraftBadge label="Publicación de ejemplo" />}
        </p>
      </ModuleHeader>

      <div className="bg-tiza pb-24 pt-10 md:pb-36 md:pt-14">
        <div className="mx-auto max-w-site px-5 md:px-10">
          <SchoolImage
            src={post.image}
            alt={post.title}
            label="Imagen principal de la noticia"
            tone="light"
            className="aspect-[16/9] rounded-panel lg:aspect-[21/9]"
            sizes="100vw"
            priority
          />
          <div className="mx-auto mt-12 max-w-[68ch]">
            <p className="text-xl font-medium leading-relaxed text-noche md:text-2xl">{post.excerpt}</p>
            {(post.author || post.updated) && (
              <p className="mt-4 text-sm text-niebla">
                {post.author && <>Por {post.author}</>}
                {post.author && post.updated && " · "}
                {post.updated && <>Actualizada el {formatDate(post.updated)}</>}
              </p>
            )}
            <Markdown text={post.bodyRaw} />
            <ButtonLink href="/noticias" variant="outline-dark" className="mt-12">
              Volver a noticias
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
