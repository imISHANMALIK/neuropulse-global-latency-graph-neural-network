import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Database, Shield, Zap, Cpu, Server, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function SettingsPage() {
  return (
    <AppLayout container>
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-display font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure simulation parameters and visualization quality.</p>
        </header>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <CardTitle>Simulation Engine</CardTitle>
              </div>
              <CardDescription>Adjust the core ST-GNN model behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Deterministic Mode</Label>
                  <p className="text-xs text-muted-foreground">Remove random jitter from latency calculations.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Regional Coupling</Label>
                  <p className="text-xs text-muted-foreground">Increase weight of geographically closer neighbors.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-500" />
                <CardTitle>Visualization Performance</CardTitle>
              </div>
              <CardDescription>Optimize rendering for your hardware.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Detail Globe</Label>
                  <p className="text-xs text-muted-foreground">Use 4K textures and high-poly topology maps.</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Particle Effects</Label>
                  <p className="text-xs text-muted-foreground">Show animated data flows between edges.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-600" />
                <CardTitle>Model Metadata</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Architecture</p>
                  <p className="text-sm font-mono font-bold">ST-GNN v1.4.2</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Framework</p>
                  <p className="text-sm font-mono font-bold">PyG 2.4 / React</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Nodes Managed</p>
                  <p className="text-sm font-mono font-bold">Global PoPs (300+)</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">State Vector</p>
                  <p className="text-sm font-mono font-bold">64-Dimension</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 text-xs h-8">
                View Full Model Config
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}