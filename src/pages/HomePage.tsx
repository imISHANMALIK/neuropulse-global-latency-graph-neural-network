import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { useSimulationStore } from '@/store/useSimulationStore';
import { SimulationOverlay } from '@/components/SimulationOverlay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Activity, Shield, Zap, Globe as GlobeIcon, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function HomePage() {
  const globeRef = useRef<any>();
  const nodes = useSimulationStore(s => s.nodes);
  const edges = useSimulationStore(s => s.edges);
  const tick = useSimulationStore(s => s.tick);
  const injectShock = useSimulationStore(s => s.injectShock);
  const [isReady, setIsReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const handleResize = useCallback(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    if (globeRef.current) {
      globeRef.current.controls().handleResize();
    }
  }, []);
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  useEffect(() => {
    const timer = setInterval(() => tick(), 1000);
    return () => clearInterval(timer);
  }, [tick]);
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      const altitude = window.innerWidth < 768 ? 1.8 : 2.5;
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude });
    }
  }, []);
  const handleNodeClick = (node: any) => {
    injectShock(node.id);
  };
  const responsiveMultiplier = Math.min(Math.max(window.innerWidth / 1440, 0.4), 1.2);
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="bg-zinc-950 h-dvh w-dvh overflow-hidden relative">
        <AppNavbar />
        <div className="absolute inset-0 cursor-crosshair">
          <Globe
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            pointsData={nodes}
            pointLat="lat"
            pointLng="lng"
            pointColor={(d: any) => d.status === 'critical' ? '#ef4444' : d.status === 'warning' ? '#f59e0b' : '#3b82f6'}
            pointAltitude={(d: any) => ((d.latency - d.baseline) / 200 + 0.01) * responsiveMultiplier}
            pointRadius={0.6 * responsiveMultiplier}
            pointsMerge={false}
            onPointClick={handleNodeClick}
            pointLabel={(d: any) => `
              <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl font-mono text-[10px] sm:text-xs">
                <div class="text-[#F48120] font-bold mb-1">${d.name} (${d.id})</div>
                <div class="text-zinc-400">Latency: <span class="text-white">${d.latency.toFixed(1)}ms</span></div>
                <div class="text-zinc-400">Status: <span class="${d.status === 'critical' ? 'text-red-500' : 'text-emerald-500'}">${d.status.toUpperCase()}</span></div>
              </div>
            `}
            arcsData={edges}
            arcStartLat={(d: any) => nodes.find(n => n.id === d.source)?.lat}
            arcStartLng={(d: any) => nodes.find(n => n.id === d.source)?.lng}
            arcEndLat={(d: any) => nodes.find(n => n.id === d.target)?.lat}
            arcEndLng={(d: any) => nodes.find(n => n.id === d.target)?.lng}
            arcColor={() => ['#3b82f6', '#F48120']}
            arcDashLength={0.4}
            arcDashGap={2}
            arcDashAnimateTime={2000}
            arcStroke={0.2 * responsiveMultiplier}
          />
        </div>
        <div className="absolute inset-0 pointer-events-none z-10 md:pl-20">
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 py-4 md:py-8 flex flex-col justify-between">
            <header className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="pointer-events-auto md:hidden bg-black/40 backdrop-blur-md border border-white/10 p-1.5 rounded-lg">
                  <SidebarTrigger className="text-white size-8" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 backdrop-blur-md border border-white/10 p-2 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-4 pointer-events-auto shadow-2xl"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#F48120] center shadow-lg shadow-orange-500/20">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-[10px] sm:text-sm font-bold tracking-widest text-white uppercase">NeuroPulse v1.4</h1>
                    <p className="hidden xs:block text-[8px] sm:text-[10px] text-zinc-500 font-mono tracking-tighter">GLOBAL EDGE INFERENCE</p>
                  </div>
                </motion.div>
              </div>
              <div className="flex gap-2 sm:gap-4 pointer-events-auto items-center">
                <ThemeToggle className="static" />
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">System Live</span>
                </div>
              </div>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pointer-events-auto pb-4 md:pb-6">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-xl space-y-1 sm:space-y-2 group hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-2 text-zinc-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest">
                  <GlobeIcon className="w-3 h-3 shrink-0" /> <span className="truncate">Topology Health</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-lg sm:text-2xl font-mono text-white">99.98%</span>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-xl space-y-1 sm:space-y-2 group hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-2 text-zinc-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest">
                  <Activity className="w-3 h-3 shrink-0" /> <span className="truncate">Avg Jitter</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-lg sm:text-2xl font-mono text-white">4.2ms</span>
                </div>
              </div>
              <div className="hidden md:block bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-2 group hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                  <Shield className="w-3 h-3 shrink-0" /> <span className="truncate">Active Threats</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-mono text-red-500">02</span>
                  <span className="text-[10px] text-zinc-400 mb-1 font-mono uppercase">Mitigated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {!isReady && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl center p-4"
            >
              <div className="max-w-md w-full p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F48120] mx-auto center floating shadow-2xl shadow-orange-500/40">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">Mission Control</h2>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Welcome to the NeuroPulse ST-GNN Global Dashboard. You are viewing a live spatio-temporal simulation of Cloudflare's edge network.
                </p>
                <button
                  onClick={() => setIsReady(true)}
                  className="w-full py-3 sm:py-4 bg-[#F48120] hover:bg-[#E55A1B] text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/20 text-sm"
                >
                  INITIALIZE MONITOR
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <SimulationOverlay />
      </SidebarInset>
    </SidebarProvider>
  );
}