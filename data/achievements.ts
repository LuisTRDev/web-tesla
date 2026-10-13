import type { Achievement } from "@/types";

/**
 * Logros de la institución y sus estudiantes: concursos, olimpiadas, juegos deportivos, ingresos.
 * Estos son espacios reservados (isPlaceholder: true). Reemplazar por logros reales.
 */
export const achievements: Achievement[] = [
  {
    id: "logro-1",
    year: null,
    title: "[LOGRO ACADÉMICO]",
    description: "[DESCRIPCIÓN PENDIENTE] Concurso u olimpiada, puesto obtenido y estudiantes participantes.",
    isPlaceholder: true,
  },
  {
    id: "logro-2",
    year: null,
    title: "[LOGRO DEPORTIVO]",
    description: "[DESCRIPCIÓN PENDIENTE] Disciplina, campeonato y resultado.",
    isPlaceholder: true,
  },
  {
    id: "logro-3",
    year: null,
    title: "[LOGRO CULTURAL O ARTÍSTICO]",
    description: "[DESCRIPCIÓN PENDIENTE] Concurso de danza, música, oratoria u otro.",
    isPlaceholder: true,
  },
];
