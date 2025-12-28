import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Slider } from '@/components/ui/slider';
import { Zap, Activity, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function SimulationOverlay() {
  const propagationSpeed = useSimulationStore(s => s.propagationSpeed);
  const setPropagationSpeed = useSimulationStore(s => s.setPropagationSpeed);
  const shockMagnitude = useSimulationStore(s => s.shockMagnitude);
  const setShockMagnitude = useSimulationStore(s => s.setShockMagnitude);
  const lastEvent = useSimulationStore(s => s.lastEvent);
  return (
    <div className="absolute right-6 top-32 bottom-6 w-80 pointer-events-none flex flex-col gap-6 z-30">
      <div className="pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2 mb-6">
            <Activity className="w-3 h-3 text-orange-500" />
            Simulation Engine
          </h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                <span>Prop. Speed</span>
                <span className="text-white">{(propagationSpeed * 10).toFixed(0)}x</span>
              </div>
              <Slider
                value={[propagationSpeed * 10]}
                min={1}
                max={20}
                step={1}
                onValueChange={(v) => setPropagationSpeed(v[0] / 10)}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                <span>Shock Intensity</span>
                <span className="text-white">{shockMagnitude}ms</span>
              </div>
              <Slider
                value={[shockMagnitude]}
                min={10}
                max={200}
                step={5}
                onValueChange={(v) => setShockMagnitude(v[0])}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
            <Zap className="w-4 h-4 text-orange-500 shrink-0" />
            <p className="text-[10px] text-zinc-300 leading-tight">
              Click any node on the globe to inject a spatio-temporal latency shock.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {lastEvent && (
            <motion.div
              key={lastEvent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 p-3 rounded-lg flex items-center gap-3 pointer-events-auto"
            >
              <Info className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-mono text-white truncate">{lastEvent}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}