import type { PhilosophyConcept } from "@/types";

/**
 * Texto de la sección "Nosotros". Es una propuesta de redacción: validar con la institución.
 */
export const aboutText = {
  confirmed: false,
  title: "Educar para descubrir.",
  quote: "Cada estudiante tiene algo que descubrir.",
  paragraphs: [
    "Creemos que aprender empieza con una pregunta. Por eso nuestras aulas son espacios donde preguntar, probar y equivocarse forma parte del camino.",
    "Acompañamos a cada estudiante de cerca, junto a su familia, para que encuentre lo que le apasiona y tenga las herramientas para llegar lejos.",
  ],
};

/**
 * IMPORTANTE: estos conceptos son propuestas de diseño, NO valores oficiales.
 * Cuando la institución los valide, edita los textos y cambia `confirmed` a true.
 */
export const philosophy: PhilosophyConcept[] = [
  {
    id: "curiosidad",
    title: "Curiosidad",
    description: "Las buenas preguntas valen tanto como las buenas respuestas.",
    confirmed: false,
  },
  {
    id: "innovacion",
    title: "Innovación",
    description: "Buscar nuevas formas de resolver, crear y aprender.",
    confirmed: false,
  },
  {
    id: "disciplina",
    title: "Disciplina",
    description: "La constancia convierte el talento en logros.",
    confirmed: false,
  },
  {
    id: "creatividad",
    title: "Creatividad",
    description: "Imaginar primero, construir después.",
    confirmed: false,
  },
  {
    id: "respeto",
    title: "Respeto",
    description: "Convivir, escuchar y valorar a los demás.",
    confirmed: false,
  },
  {
    id: "pensamiento-critico",
    title: "Pensamiento crítico",
    description: "Analizar, contrastar y decidir con criterio propio.",
    confirmed: false,
  },
];
