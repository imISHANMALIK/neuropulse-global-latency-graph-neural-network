import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Slider } from '@/components/ui/slider';
import { Zap, Activity, Info, RotateCcw, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
export function SimulationOverlay() {
  const propagationSpeed = useSimulationStore(s => s.propagationSpeed);
  const setPropagationSpeed = useSimulationStore(s => s.setPropagationSpeed);
  const shockMagnitude = useSimulationStore(s => s.shockMagnitude);
  const setShockMagnitude = useSimulationStore(s => s.setShockMagnitude);
  const resetSimulation = useSimulationStore(s => s.resetSimulation);
  const lastEvent = useSimulationStore(s => s.lastEvent);
  const simTimeElapsed = useSimulationStore(s => s.simTimeElapsed);
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const isWarning = simTimeElapsed > 10000;
  return (
    <TooltipProvider>
      <div className="absolute left-4 right-4 bottom-4 md:left-auto md:right-6 md:top-32 md:bottom-6 w-auto max-w-full md:w-80 pointer-events-none flex flex-col gap-4 sm:gap-6 z-30">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
              <Activity className="w-3 h-3 text-orange-500" />
              Engine Config
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetSimulation}
              className="h-6 w-6 text-zinc-400 hover:text-white"
              title="Reset Simulation"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <Timer className={cn("w-4 h-4 transition-colors", isWarning ? "text-orange-500 animate-pulse" : "text-zinc-500")} />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Event Clock</span>
            </div>
            <span className={cn(
              "text-lg font-mono font-bold tracking-tighter transition-colors",
              isWarning ? "text-orange-500" : "text-white"
            )}>
              {formatTime(simTimeElapsed)}
            </span>
          </div>
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                <Tooltip>
                  <TooltipTrigger className="cursor-help">Prop. Speed</TooltipTrigger>
                  <TooltipContent>
                    <p className="w-48">How quickly latency shocks travel across the graph structure.</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-white">{(propagationSpeed * 10).toFixed(0)}x</span>
              </div>
              <Slider
                value={[propagationSpeed * 10]}
                min={1}
                max={20}
                step={1}
                onValueChange={(v) => setPropagationSpeed(v[0] / 10)}
                className="cursor-pointer h-8 md:h-4"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                <Tooltip>
                  <TooltipTrigger className="cursor-help">Shock Intensity</TooltipTrigger>
                  <TooltipContent>
                    <p className="w-48">The baseline latency spike added when a node is triggered.</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-white">{shockMagnitude}ms</span>
              </div>
              <Slider
                value={[shockMagnitude]}
                min={10}
                max={500}
                step={10}
                onValueChange={(v) => setShockMagnitude(v[0])}
                className="cursor-pointer h-8 md:h-4"
              />
            </div>
          </div>
          <div className="hidden xs:block pt-3 sm:pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
              <Zap className="w-3 h-3 sm:w-4 h-4 text-orange-500 shrink-0" />
              <p className="text-[9px] sm:text-[10px] text-zinc-300 leading-tight">
                GNN Message Passing active. Click nodes to inject shocks.
              </p>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex mt-auto space-y-2 overflow-hidden max-h-[120px] md:max-h-[200px] flex-col justify-end">
          <AnimatePresence mode="popLayout">
            {lastEvent && (
              <motion.div
                key={lastEvent}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                className="bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 p-2 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 pointer-events-auto shadow-lg"
              >
                <Info className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-mono text-white truncate">{lastEvent}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}