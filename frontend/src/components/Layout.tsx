import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/raw-materials", label: "Raw Materials" },
  { to: "/products", label: "Products" },
  { to: "/production", label: "Production" },
];

export default function Layout() {
  return (
    <div
      className="flex min-h-screen"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <aside className="border-border flex w-56 shrink-0 flex-col border-r bg-white">
        <div className="border-border border-b px-6 py-5">
          <span className="text-primary text-base font-bold tracking-tight">
            Projedata
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "rounded px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="bg-surface flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
