import type { TeamMember } from "@/types";

/**
 * Equipo directivo y docentes. NO inventar nombres: completar con datos reales
 * (y con autorización para publicar cada foto). Las fotos van en /public/images/equipo/.
 * Se pueden agregar o quitar cargos libremente.
 */
export const team: TeamMember[] = [
  { id: "direccion", name: null, role: "Dirección", bio: null, image: null },
  { id: "coord-primaria", name: null, role: "Coordinación de Primaria", bio: null, image: null },
  { id: "coord-secundaria", name: null, role: "Coordinación de Secundaria", bio: null, image: null },
  { id: "tutoria", name: null, role: "Tutoría y bienestar", bio: null, image: null },
];
