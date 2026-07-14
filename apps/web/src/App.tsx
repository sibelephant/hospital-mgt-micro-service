import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { apiRequest } from "./api/client";
import { readStoredSession } from "./api/client";
import { LoginScreen } from "./auth/LoginScreen";
import { Sidebar } from "./layout/Sidebar";
import { Topbar } from "./layout/Topbar";
import { Dashboard } from "./pages/Dashboard";
import { ModuleDetail } from "./pages/ModuleDetail";
import type { AuthSession } from "./types";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());

  if (!session) {
    return <LoginScreen onAuthenticated={setSession} />;
  }

  return (
    <BrowserRouter>
      <main className="grid min-h-screen grid-cols-1 bg-slate-50 text-slate-900 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar />
        <section className="min-w-0 p-4 sm:p-6 lg:p-7">
          <Topbar
            searchQuery={searchQuery}
            session={session}
            onLogout={async () => {
              try {
                await apiRequest("/auth/logout", {
                  method: "POST",
                  body: JSON.stringify({ refreshToken: session.refreshToken })
                });
              } catch {
                // Local logout still clears stale credentials if the server is unavailable.
              }
              window.localStorage.removeItem("caregrid-auth");
              setSession(null);
            }}
            onSearchChange={setSearchQuery}
          />
          <Routes>
            <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
            <Route path="/modules/:slug" element={<ModuleDetail searchQuery={searchQuery} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  );
}
