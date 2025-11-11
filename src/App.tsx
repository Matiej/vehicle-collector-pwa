import { NavLink, Outlet } from "react-router-dom";

const linkBase = "text-l font-medium transition-colors";
const linkInactive = "text-zinc-500 hover:text-zinc-300";
const linkActive =
  "text-white after:block after:h-[2px] after:bg-white after:rounded-full after:mt-1";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/30 border-b border-border">
        <div className="container flex items-center gap-6 py-3">
          {/* (opcjonalnie favicon jako mini-logo) */}
          {/* <img src="/icons/icon-192.png" alt="" className="h-5 w-5 rounded mr-2" /> */}
          <div className="text-lg font-semibold">Vehicle Collector</div>

          <nav className="ml-auto flex items-center gap-6">
            <NavLink
              to="/sessions"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Sessions
            </NavLink>
            <NavLink
              to="/library"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Library
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}
