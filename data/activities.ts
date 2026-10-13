import type { Activity } from "@/types";

/**
 * Actividades y talleres. Son ejemplos del brief: reemplazar por la oferta real del colegio.
 * El orden importa: los primeros ocupan los espacios más grandes de la composición.
 */
export const activities: Activity[] = [
  { id: "ciencia", title: "Ciencia", description: "Experimentos, ferias y proyectos de investigación.", image: null, confirmed: false },
  { id: "tecnologia", title: "Tecnología", description: "Herramientas digitales para crear y resolver.", image: null, confirmed: false },
  { id: "arte", title: "Arte", description: "Música, dibujo, teatro y expresión.", image: null, confirmed: false },
  { id: "deportes", title: "Deportes", description: "Trabajo en equipo y vida saludable.", image: null, confirmed: false },
  { id: "cultura", title: "Cultura", description: "Identidad, tradiciones y fechas cívicas.", image: "/images/actividades/cultura/cultura-01.png", confirmed: false },
  { id: "proyectos", title: "Proyectos", description: "Ideas de los estudiantes llevadas a la práctica.", image: null, confirmed: false },
  { id: "eventos", title: "Eventos", description: "Aniversario, celebraciones y encuentros con las familias.", image: null, confirmed: false },
  { id: "escolares", title: "Actividades escolares", description: "Visitas, concursos y jornadas especiales.", image: "/images/actividades/escolares/actividad-escolar-01.png", confirmed: false },
];
