import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { MapPin, Activity, History, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export function AnalyticsPage() {
  const nodes = useSimulationStore(s => s.nodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');
  const selectedNode = useMemo(() => 
    nodes.find(n => n.id === selectedNodeId), 
  [nodes, selectedNodeId]);
  return (
    <AppLayout container>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold">Node Analytics</h1>
            <p className="text-muted-foreground">Detailed telemetry and GNN state analysis for edge locations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedNodeId} onValueChange={setSelectedNodeId}>
              <SelectTrigger className="w-[200px] bg-secondary/50 border-input">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    Latency Propagation History
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedNode.history}>
                      <defs>
                        <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#88888822" vertical={false} />
                      <XAxis hide dataKey="time" />
                      <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
                        labelStyle={{ display: 'none' }}
                      />
                      <Area type="monotone" dataKey="latency" stroke="#f97316" fillOpacity={1} fill="url(#colorLat)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="bg-card border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-500" />
                    Estimated Stress Probability (GNN)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedNode.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#88888822" vertical={false} />
                      <XAxis hide dataKey="time" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
                        labelStyle={{ display: 'none' }}
                      />
                      <Line type="stepAfter" dataKey="risk" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-purple-500" />
                    PoP Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-secondary/30 rounded-lg flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Region</span>
                    <span className="text-sm font-mono font-bold">Global Edge</span>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Coordinates</span>
                    <span className="text-sm font-mono">{selectedNode.lat.toFixed(2)}, {selectedNode.lng.toFixed(2)}</span>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Baseline</span>
                    <span className="text-sm font-mono">{selectedNode.baseline}ms</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-500/5 border-orange-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-8 h-8 text-orange-500" />
                    <div>
                      <h3 className="font-bold text-lg">{selectedNode.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This node acts as a gateway for local traffic. Latency increases here typically propagate to nearest regional neighbors within 2-4 simulation ticks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">Select a node to view analytics</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}