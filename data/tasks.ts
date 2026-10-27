import raw from "@/content/tareas.json";
import { bool, isoDate, list, oneOf, rec, str } from "@/lib/content";

/** Notas y tareas internas del equipo (panel → Personalizar la web → Notas y tareas). Se muestran en el Inicio del panel. */
export interface TeamTask {
  title: string;
  kind: "tarea" | "nota";
  due: string | null;
  who: string;
  done: boolean;
}

export const teamTasks: TeamTask[] = list(rec(raw).items)
  .map((item) => ({
    title: str(item.title).trim(),
    kind: oneOf(item.kind, ["tarea", "nota"] as const, "tarea"),
    due: isoDate(item.due) || null,
    who: str(item.who).trim(),
    done: bool(item.done),
  }))
  .filter((task) => task.title);
