import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, BarChart2, Settings as SettingsIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-50 font-sans">
      <aside className="w-64 border-r border-slate-800 bg-slate-950/50 p-4 flex flex-col backdrop-blur-xl">
        <div className="mb-8 flex items-center space-x-3 px-2 mt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">PostureShrimp</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-emerald-400" : "text-slate-500")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-[url('/noise.png')] bg-repeat opacity-[0.99]">
        <div className="h-full w-full p-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
};
