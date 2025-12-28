import React from 'react';
import { NavLink } from 'react-router-dom';
import { Globe, BookOpen, BarChart3, Settings2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function AppNavbar() {
  const items = [
    { to: '/', icon: Globe, label: 'Global Monitor' },
    { to: '/architecture', icon: BookOpen, label: 'Blueprint' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings2, label: 'Settings' },
  ];
  return (
    <TooltipProvider>
      <nav className="fixed left-0 top-0 bottom-0 w-20 flex flex-col items-center py-8 bg-zinc-950/80 backdrop-blur-xl border-r border-white/5 z-50">
        <div className="mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-600 center shadow-2xl shadow-orange-500/20 group cursor-pointer hover:scale-110 transition-transform">
            <div className="w-6 h-6 border-2 border-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          {items.map((item) => (
            <Tooltip key={item.to} delayDuration={0}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "p-3.5 rounded-2xl transition-all duration-300 relative group",
                      isActive 
                        ? "bg-orange-500/10 text-orange-500 shadow-inner" 
                        : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                    )
                  }
                >
                  <item.icon className="w-6 h-6" />
                  {({ isActive }) => isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-zinc-900 border-zinc-800 text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 ml-2">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="mt-auto space-y-6 flex flex-col items-center">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="center flex-col gap-1 cursor-help group">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:scale-125 transition-transform" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-zinc-900 border-zinc-800 text-[10px] font-mono uppercase tracking-widest p-2 ml-2">
              <span className="text-emerald-500">System Nominal</span>
            </TooltipContent>
          </Tooltip>
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 center overflow-hidden opacity-50">
            <ShieldCheck className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}