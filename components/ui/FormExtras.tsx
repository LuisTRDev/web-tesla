import { settings } from "@/data/settings";

const field =
  "mt-2 w-full rounded-2xl border border-noche/20 bg-white px-4 py-3.5 text-base text-noche placeholder:text-niebla/70 focus:border-noche focus:outline-none focus:ring-2 focus:ring-filamento";

/** Pregunta opcional "¿Cómo nos conociste?" con las opciones que define el colegio (Datos del colegio → Formularios). */
export function SourceField({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const { enabled, question, options } = settings.forms.source;
  if (!enabled || options.length === 0) return null;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-noche">
        {question}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={field}>
        <option value="">Prefiero no decirlo</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

/** Mensaje de gracias que se ve tras enviar un formulario (texto editable). */
export function Thanks({ show }: { show: boolean }) {
  return (
    <p role="status" aria-live="polite" className={show ? "rounded-2xl bg-filamento/25 px-4 py-3 text-[15px] font-semibold text-noche" : "sr-only"}>
      {show ? "✓ " + settings.forms.thanks : ""}
    </p>
  );
}
