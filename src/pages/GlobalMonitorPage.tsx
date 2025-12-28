import React, { useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Globe2, ShieldAlert, Zap } from 'lucide-react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { SimulationOverlay } from '@/components/SimulationOverlay';
import { motion } from 'framer-motion';
export function GlobalMonitorPage() {
  const nodes = useSimulationStore(s => s.nodes);
  const edges = useSimulationStore(s => s.edges);
  const tick = useSimulationStore(s => s.tick);
  const injectShock = useSimulationStore(s => s.injectShock);
  const globeRef = useRef<any>();
  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [tick]);
  const globeData = useMemo(() => nodes.map(n => ({
    ...n,
    size: Math.max(0.2, (n.latency / n.baseline) * 0.5),
    color: n.status === 'critical' ? '#ef4444' : n.status === 'warning' ? '#f59e0b' : '#3b82f6'
  })), [nodes]);
  const arcData = useMemo(() => edges.map(e => {
    const start = nodes.find(n => n.id === e.source);
    const end = nodes.find(n => n.id === e.target);
    return {
      startLat: start?.lat,
      startLng: start?.lng,
      endLat: end?.lat,
      endLng: end?.lng,
      color: (start?.status === 'critical' || end?.status === 'critical') ? '#f97316' : '#3b82f644'
    };
  }), [nodes, edges]);
  const avgLatency = useMemo(() => 
    (nodes.reduce((acc, n) => acc + n.latency, 0) / nodes.length).toFixed(1), 
  [nodes]);
  return (
    <AppLayout>
      <div className="relative h-screen w-full bg-black overflow-hidden">
        {/* HUD Top Bar */}
        <div className="absolute top-6 left-6 right-6 z-20 grid grid-cols-1 md:grid-cols-4 gap-4 pointer-events-none">
          <MetricCard
            title="System Latency"
            value={`${avgLatency}ms`}
            icon={<Zap className="w-4 h-4 text-orange-500" />}
            trend="+1.2%"
          />
          <MetricCard
            title="Edge Integrity"
            value="99.9%"
            icon={<Activity className="w-4 h-4 text-emerald-500" />}
          />
          <MetricCard
            title="Threat Level"
            value={parseFloat(avgLatency) > 25 ? "Elevated" : "Normal"}
            icon={<ShieldAlert className="w-4 h-4 text-blue-500" />}
          />
          <MetricCard
            title="PoP Nodes"
            value={`${nodes.length} active`}
            icon={<Globe2 className="w-4 h-4 text-purple-500" />}
          />
        </div>
        {/* Globe Visualization */}
        <div className="absolute inset-0 z-0">
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            pointsData={globeData}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointRadius="size"
            pointAltitude={0.01}
            pointsMerge={true}
            arcsData={arcData}
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={2}
            arcDashAnimateTime={2000}
            onPointClick={(point: any) => injectShock(point.id)}
            labelsData={globeData}
            labelLat="lat"
            labelLng="lng"
            labelText="name"
            labelSize={0.5}
            labelDotRadius={0.2}
            labelColor={() => '#ffffff88'}
            labelResolution={2}
          />
        </div>
        <SimulationOverlay />
      </div>
    </AppLayout>
  );
}
function MetricCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode, trend?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-black/60 backdrop-blur-xl border-white/10 pointer-events-auto shadow-2xl border">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">{icon}</div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-white">{value}</span>
              {trend && <span className="text-[10px] text-emerald-400 font-mono">{trend}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}