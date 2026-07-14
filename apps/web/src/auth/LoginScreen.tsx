import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { apiRequest } from "../api/client";
import { AuthField } from "./AuthField";
import type { AuthSession } from "../types";

export function LoginScreen({ onAuthenticated }: { onAuthenticated: (session: AuthSession) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [values, setValues] = useState({
    hospitalName: "",
    hospitalSlug: "",
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <section className="w-full max-w-xl rounded-lg border border-blue-100 bg-white p-6 shadow-[0_20px_50px_rgba(16,56,112,0.12)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-700 text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">Hospital access</p>
            <h1 className="text-2xl font-extrabold text-blue-950">CareGrid</h1>
          </div>
        </div>
        <div className="mb-5 grid grid-cols-2 rounded-lg bg-blue-50 p-1">
          {(["login", "register"] as const).map((item) => (
            <button
              className={`rounded-md px-3 py-2 text-sm font-bold ${mode === item ? "bg-white text-blue-800 shadow-sm" : "text-slate-600"}`}
              key={item}
              onClick={() => setMode(item)}
              type="button"
            >
              {item === "login" ? "Login" : "Register Hospital"}
            </button>
          ))}
        </div>
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");
            setIsSubmitting(true);
            try {
              const session = await apiRequest<AuthSession>(
                mode === "login" ? "/auth/login" : "/auth/register-hospital",
                {
                  method: "POST",
                  body: JSON.stringify(
                    mode === "login"
                      ? { email: values.email, password: values.password }
                      : {
                          hospitalName: values.hospitalName,
                          hospitalSlug: values.hospitalSlug,
                          firstName: values.firstName,
                          lastName: values.lastName,
                          email: values.email,
                          password: values.password
                        }
                  )
                }
              );
              window.localStorage.setItem("caregrid-auth", JSON.stringify(session));
              onAuthenticated(session);
            } catch {
              setError("Authentication failed. Check the credentials or hospital registration values.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {mode === "register" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <AuthField label="Hospital name" name="hospitalName" value={values.hospitalName} onChange={updateValue} />
              <AuthField label="Hospital slug" name="hospitalSlug" value={values.hospitalSlug} onChange={updateValue} />
              <AuthField label="First name" name="firstName" value={values.firstName} onChange={updateValue} />
              <AuthField label="Last name" name="lastName" value={values.lastName} onChange={updateValue} />
            </div>
          ) : null}
          <AuthField label="Email" name="email" type="email" value={values.email} onChange={updateValue} />
          <AuthField label="Password" name="password" type="password" value={values.password} onChange={updateValue} />
          {error ? <div className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div> : null}
          <button
            className="min-h-11 rounded-lg bg-blue-700 px-4 text-sm font-extrabold text-white hover:bg-blue-800 disabled:bg-blue-300"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Please wait" : mode === "login" ? "Login" : "Create Hospital"}
          </button>
        </form>
      </section>
    </main>
  );
}
