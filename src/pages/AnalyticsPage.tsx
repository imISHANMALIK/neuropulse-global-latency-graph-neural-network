import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { MapPin, Activity, History, Info, Loader2, Network, Cpu } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export function AnalyticsPage() {
  const nodes = useSimulationStore(s => s.nodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const selectedNode = useMemo(() => 
    nodes.find(n => n.id === selectedNodeId),
  [nodes, selectedNodeId]);
  return (
    <AppLayout container>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold text-foreground">Node Analytics</h1>
            <p className="text-muted-foreground text-lg">Detailed telemetry and ST-GNN state analysis for edge locations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedNodeId} onValueChange={setSelectedNodeId}>
              <SelectTrigger className="w-[280px] bg-secondary/50 border-input h-12 text-base">
                <SelectValue placeholder="Select PoP" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map(n => (
                  <SelectItem key={n.id} value={n.id}>{n.name} ({n.id})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>
        {selectedNode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <Card className="bg-card border-border shadow-soft">
                <CardHeader className="border-b">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    Latency Propagation History
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] pt-6">
                  {selectedNode.history.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedNode.history}>
                        <defs>
                          <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#88888811" vertical={false} />
                        <XAxis hide dataKey="time" />
                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#888' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                          labelStyle={{ display: 'none' }}
                          itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="latency" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorLat)" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full center flex-col text-muted-foreground gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                      <p className="font-mono text-sm tracking-widest">SYNCHRONIZING TELEMETRY...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border shadow-soft">
                  <CardHeader className="border-b">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <Network className="w-4 h-4 text-blue-500" />
                      Spatial Neighbor Influence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-mono font-bold">12.4%</span>
                        <span className="text-[10px] text-muted-foreground uppercase">Coupling Factor</span>
                      </div>
                      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[12.4%]" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The current influence weight this node receives from its geographical neighbors in the ST-GNN layer.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-soft">
                  <CardHeader className="border-b">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-500" />
                      Temporal Decay Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-mono font-bold">0.96</span>
                        <span className="text-[10px] text-muted-foreground uppercase">Persistence</span>
                      </div>
                      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full w-[96%]" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The rate at which latency shocks dissipate over time through the GRU temporal recurrent unit.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
              <Card className="bg-card border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4 text-zinc-500" />
                    PoP Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Region', value: 'Global Edge', mono: true },
                    { label: 'Coordinates', value: `${selectedNode.lat.toFixed(4)}, ${selectedNode.lng.toFixed(4)}`, mono: true },
                    { label: 'Baseline', value: `${selectedNode.baseline}ms`, mono: true },
                    { label: 'Hardware', value: 'Gen 10 Edge', mono: false },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-secondary/30 rounded-xl flex items-center justify-between border border-border/50">
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">{item.label}</span>
                      <span className={`text-sm ${item.mono ? 'font-mono' : 'font-medium'}`}>{item.value}</span>
                    </div>
                  ))}
                  <div className={`p-4 rounded-xl flex items-center justify-between border ${selectedNode.status === 'critical' ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Status</span>
                    <span className={`text-sm font-bold uppercase tracking-widest ${selectedNode.status === 'critical' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {selectedNode.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-500 shadow-glow-lg text-white border-none">
                <CardContent className="p-8">
                  <div className="flex flex-col gap-6">
                    <MapPin className="w-12 h-12 opacity-50" />
                    <div>
                      <h3 className="font-display font-bold text-3xl">{selectedNode.name}</h3>
                      <p className="text-sm text-white/80 leading-relaxed mt-3 font-mono">
                        Deployment ID: CF-${selectedNode.id}-01<br/>
                        Backbone Status: CONNECTED<br/>
                        GNN Stability: NOMINAL
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="h-96 center flex-col border-2 border-dashed rounded-3xl space-y-4 bg-muted/20">
            <Activity className="w-16 h-16 text-muted-foreground/20" />
            <p className="text-muted-foreground font-mono tracking-widest uppercase">SELECT A NODE TO INITIALIZE ANALYTICS</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}