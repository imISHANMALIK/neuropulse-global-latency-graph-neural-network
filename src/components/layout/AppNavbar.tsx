import React from 'react';
import { NavLink } from 'react-router-dom';
import { Globe, BookOpen, BarChart3, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
export function AppNavbar() {
  const items = [
    { to: '/', icon: Globe, label: 'Monitor' },
    { to: '/architecture', icon: BookOpen, label: 'Blueprint' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings2, label: 'Settings' },
  ];
  return (
    <nav className="fixed left-0 top-0 bottom-0 w-20 flex flex-col items-center py-8 bg-zinc-950 border-r border-zinc-900 z-50">
      <div className="mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <div className="w-5 h-5 border-2 border-white rounded-full opacity-80" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-8">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "group relative p-3 rounded-2xl transition-all duration-300",
                isActive ? "bg-orange-500/10 text-orange-500" : "text-zinc-500 hover:text-zinc-200"
              )
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-zinc-100 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}