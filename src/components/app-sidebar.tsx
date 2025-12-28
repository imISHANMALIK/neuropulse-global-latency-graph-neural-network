import React from "react";
import { NavLink } from "react-router-dom";
import { Globe, BookOpen, BarChart3, Settings2, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
export function AppSidebar(): JSX.Element {
  const navItems = [
    { to: '/', icon: Globe, label: 'Global Monitor' },
    { to: '/architecture', icon: BookOpen, label: 'Blueprint' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings2, label: 'Settings' },
  ];
  return (
    <Sidebar className="border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl">
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F48120] to-[#E55A1B] flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap className="text-white h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-display font-bold text-white tracking-tight">NeuroPulse</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Global Edge GNN</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-6 rounded-xl transition-all duration-300 relative overflow-hidden",
                        isActive 
                          ? "bg-orange-500/10 text-[#F48120]" 
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={cn("size-5 transition-transform", isActive && "scale-110")} />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#F48120] rounded-r-full shadow-[0_0_8px_#F48120]" />
                        )}
                      </>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/5">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 px-2 py-2 cursor-help group">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
                </div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-tighter group-hover:text-emerald-500 transition-colors">
                  System Nominal
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-zinc-900 border-zinc-800 text-[10px] font-mono uppercase tracking-widest p-2">
              All PoP clusters operational
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarFooter>
    </Sidebar>
  );
}