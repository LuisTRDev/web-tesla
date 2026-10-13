import type { Level } from "@/types";

/**
 * Niveles educativos: el colegio ofrece solo Primaria y Secundaria. NO se inventan grados ni edades:
 * completa `grades` con la información oficial, p. ej. ["1.º grado", "2.º grado"].
 */
export const levels: Level[] = [
  {
    slug: "primaria",
    name: "Primaria",
    summary: "Aprender a aprender.",
    description:
      "[DESCRIPCIÓN PENDIENTE] Texto breve sobre el nivel Primaria: hábitos de estudio, áreas y proyectos.",
    grades: null,
    image: "/images/niveles/primaria/aula-primaria-01.png",
    confirmed: false,
  },
  {
    slug: "secundaria",
    name: "Secundaria",
    summary: "Preparados para lo que viene.",
    description:
      "[DESCRIPCIÓN PENDIENTE] Texto breve sobre el nivel Secundaria: preparación académica y proyecto de vida.",
    grades: null,
    image: "/images/niveles/secundaria/aula-secundaria-01.png",
    confirmed: false,
  },
];
