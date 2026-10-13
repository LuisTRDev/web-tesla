import Link from "next/link";
import ButtonLink from "@/components/ui/ButtonLink";
import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import SchoolImage from "@/components/ui/SchoolImage";
import type { NewsPost } from "@/types";
import { cn, formatDate } from "@/lib/utils";

function Meta({ post }: { post: NewsPost }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-niebla">
      <span className="font-semibold text-noche">{post.category}</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {post.isPlaceholder && <DraftBadge label="Ejemplo" />}
    </p>
  );
}

/** NOTICIAS: una publicación destacada grande y el resto como índice editorial. */
export default function News({ posts, showAllLink = true, showIntro = true }: { posts: NewsPost[]; showAllLink?: boolean; showIntro?: boolean }) {
  if (posts.length === 0) return null;
  const [featured, ...others] = posts;

  return (
    <section id="noticias" className={cn("bg-tiza", showIntro ? "py-24 md:py-36" : "py-16 md:py-24")}>
      <div className="mx-auto max-w-site px-5 md:px-10">
        {showIntro && (
          <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:mb-20">
            <h2 className="max-w-[14ch] text-balance font-display text-[clamp(2.6rem,7.5vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-noche">
              Lo que está pasando en Nikola Tesla.
            </h2>
            {showAllLink && (
              <ButtonLink href="/noticias" variant="outline-dark" className="self-start md:self-auto">
                Ver todas las noticias
              </ButtonLink>
            )}
          </Reveal>
        )}

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <article className="group">
              <Link href={`/noticias/${featured.slug}`} className="block">
                <SchoolImage
                  src={featured.image}
                  alt={featured.title}
                  label="Imagen de la noticia destacada"
                  tone="light"
                  className="aspect-[16/10] rounded-panel"
                  imgClassName="transition-transform duration-[900ms] group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
                <div className="mt-6">
                  <Meta post={featured} />
                  <h3 className="mt-3 text-balance font-display text-[clamp(1.8rem,3.6vw,3rem)] font-bold leading-[1.04] tracking-[-0.025em] text-noche">
                    {featured.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-lg leading-relaxed text-tinta/75">{featured.excerpt}</p>
                  <span className="mt-4 inline-block border-b-2 border-filamento pb-0.5 text-[15px] font-semibold text-noche">Leer más</span>
                </div>
              </Link>
            </article>
          </Reveal>

          <ul className="border-t border-noche/15 lg:col-span-5">
            {others.map((post, index) => (
              <li key={post.slug} className="border-b border-noche/15">
                <Reveal delay={index * 0.08}>
                  <article className="group">
                    <Link href={`/noticias/${post.slug}`} className="grid grid-cols-[1fr_104px] items-start gap-5 py-6 md:grid-cols-[1fr_140px]">
                      <div>
                        <Meta post={post} />
                        <h3 className="mt-2 font-display text-[1.35rem] font-bold leading-[1.12] tracking-[-0.015em] text-noche md:text-2xl">{post.title}</h3>
                        <span className="mt-3 inline-block border-b-2 border-transparent pb-0.5 text-[15px] font-semibold text-noche transition-colors group-hover:border-filamento">
                          Leer más
                        </span>
                      </div>
                      <SchoolImage src={post.image} alt={post.title} label="Imagen" tone="light" className="aspect-square rounded-2xl" sizes="140px" />
                    </Link>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
