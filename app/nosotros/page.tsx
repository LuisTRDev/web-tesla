import type { Metadata } from "next";
import type { CSSProperties } from "react";
import About from "@/components/sections/About";
import Achievements from "@/components/sections/Achievements";
import Philosophy from "@/components/sections/Philosophy";
import Team from "@/components/sections/Team";
import Testimonials from "@/components/sections/Testimonials";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { getModule } from "@/data/modules";
import { getAchievements, getTeam, getTestimonials } from "@/lib/data";

const mod = getModule("nosotros");

export const metadata: Metadata = {
  title: mod.label,
  description: mod.seoDescription,
  alternates: { canonical: mod.href },
};

/** Los valores del escudo oficial. */
const crestValues = ["Disciplina", "Liderazgo", "Excelencia"];

export default async function AboutPage() {
  const [testimonials, team, achievements] = await Promise.all([getTestimonials(), getTeam(), getAchievements()]);

  return (
    <>
      <ModuleHeader module={mod}>
        <ul className="hero-in mt-10 flex flex-wrap gap-2" style={{ "--d": "0.5s" } as CSSProperties}>
          {crestValues.map((value) => (
            <li key={value} className="rounded-full border border-noche/25 bg-white/60 px-4 py-2 text-[15px] font-semibold text-noche">
              {value}
            </li>
          ))}
        </ul>
      </ModuleHeader>
      <About />
      <Philosophy />
      <Team members={team} />
      <Achievements items={achievements} />
      <Testimonials testimonials={testimonials} />
      <NextModule current={mod.id} />
    </>
  );
}
