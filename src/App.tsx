import { Link, Outlet, useLocation } from "react-router-dom";
// import { Separator } from "@/components/ui/separator";

export default function App() {
  const loc = useLocation();
  const active = (p: string) =>
    loc.pathname === p ||
    (p !== "/" && loc.pathname.startsWith(p))
      ? "text-white"
      : "text-zinc-400 hover:text-white";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/30 border-b border-border">
        <div className="container flex items-center gap-6 py-3">
          <div className="text-lg font-semibold">Vehicle Collector</div>

          <nav className="ml-auto flex items-center gap-6 text-sm">
            <Link className={active("/")} to="/">Sessions</Link>
            <Link className={active("/library")} to="/library">Library</Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-5xl py-6">
        <Outlet />
      </main>
    </div>
  );
}
