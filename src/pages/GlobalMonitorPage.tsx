import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Globe2, ShieldAlert, Zap } from 'lucide-react';
export function GlobalMonitorPage() {
  return (
    <AppLayout>
      <div className="relative h-screen flex flex-col">
        {/* HUD Top Bar */}
        <div className="absolute top-6 left-6 right-6 z-10 grid grid-cols-1 md:grid-cols-4 gap-4 pointer-events-none">
          <MetricCard 
            title="Avg. Latency" 
            value="14.2ms" 
            icon={<Zap className="w-4 h-4 text-orange-500" />} 
            trend="+1.2%" 
          />
          <MetricCard 
            title="Active Nodes" 
            value="284/284" 
            icon={<Activity className="w-4 h-4 text-emerald-500" />} 
          />
          <MetricCard 
            title="Attack Risk" 
            value="Low" 
            icon={<ShieldAlert className="w-4 h-4 text-blue-500" />} 
          />
          <MetricCard 
            title="Network State" 
            value="Optimized" 
            icon={<Globe2 className="w-4 h-4 text-purple-500" />} 
          />
        </div>
        {/* Main Globe Area */}
        <div className="flex-1 bg-black/95 flex items-center justify-center relative overflow-hidden">
           <div className="text-center space-y-4 animate-pulse">
              <Globe2 className="w-16 h-16 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground font-mono uppercase tracking-widest text-sm">Initializing 3D Visualizer...</p>
           </div>
           {/* Simulation Sidebar Overlay */}
           <div className="absolute right-6 top-32 bottom-6 w-80 pointer-events-auto bg-background/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Simulation Control</h3>
              <div className="space-y-4">
                <label className="text-xs text-muted-foreground block">Propagation Speed</label>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[60%]" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
                  <span>Slow</span>
                  <span>Real-time</span>
                </div>
              </div>
              <div className="mt-auto">
                <button className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-bold transition-colors">
                  INJECT DDOS SHOCK
                </button>
              </div>
           </div>
        </div>
      </div>
    </AppLayout>
  );
}
function MetricCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode, trend?: string }) {
  return (
    <Card className="bg-background/80 backdrop-blur-md border-white/5 pointer-events-auto shadow-2xl">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-2 bg-secondary/50 rounded-lg">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono">{value}</span>
            {trend && <span className="text-[10px] text-emerald-500 font-mono">{trend}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}