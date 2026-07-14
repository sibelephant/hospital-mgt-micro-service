import { useState } from "react";
import { Plus, X } from "lucide-react";
import { apiRequest } from "../api/client";
import { Field, formFields, defaultFormValues, buildPayload } from "./Field";
import type { HospitalModule } from "../types";

export function ActionModal({
  module,
  onClose,
  onSaved
}: {
  module: HospitalModule;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(defaultFormValues(module.slug));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const fields = formFields(module.slug);

  const updateValue = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-blue-100 p-5">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">{module.shortName}</p>
            <h2 className="text-xl font-extrabold text-blue-950">{module.action}</h2>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100" onClick={onClose} type="button" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <form
          className="grid gap-4 p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setState("saving");
            try {
              await apiRequest(module.endpoint.replace("/calendar", ""), {
                method: "POST",
                body: JSON.stringify(buildPayload(module.slug, values))
              });
              setState("saved");
              onSaved();
            } catch {
              setState("error");
            }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.slice(0, 2).map((field) => (
              <Field
                field={field}
                key={field.name}
                value={values[field.name] ?? ""}
                onChange={(value) => updateValue(field.name, value)}
              />
            ))}
          </div>
          {fields.slice(2).map((field) => (
            <Field
              field={field}
              key={field.name}
              value={values[field.name] ?? ""}
              onChange={(value) => updateValue(field.name, value)}
            />
          ))}
          <label className="grid gap-1.5 text-sm font-bold text-blue-950">
            Notes
            <textarea
              className="min-h-24 rounded-lg border border-blue-100 px-3 py-2 font-normal text-slate-800 outline-none focus:border-blue-400"
              onChange={(event) => updateValue("notes", event.target.value)}
              placeholder="Add operational notes"
              value={values.notes ?? ""}
            />
          </label>
          {state === "saved" ? <div className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">Record saved.</div> : null}
          {state === "error" ? (
            <div className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">
              Save failed. Check required fields and API connectivity.
            </div>
          ) : null}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button className="min-h-10 rounded-lg px-4 text-sm font-bold text-slate-600 hover:bg-slate-100" onClick={onClose} type="button">
              Cancel
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={state === "saving"}
              type="submit"
            >
              <Plus size={17} />
              {state === "saving" ? "Saving" : "Save"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
