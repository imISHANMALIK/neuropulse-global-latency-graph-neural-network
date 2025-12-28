import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ST_GNN_PYTORCH_CODE, MATH_EQUATIONS } from '@/lib/gnn-model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Code2, FunctionSquare } from 'lucide-react';
export function ArchitecturePage() {
  return (
    <AppLayout container>
      <div className="space-y-10">
        <header className="space-y-2">
          <h1 className="text-4xl font-display font-bold text-foreground">Model Architecture</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Spatio-Temporal Graph Neural Networks (ST-GNNs) capture complex dependencies across the global edge network to predict latency anomalies.
          </p>
        </header>
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card border-border shadow-soft">
            <CardHeader className="flex flex-row items-center gap-2">
              <FunctionSquare className="w-5 h-5 text-orange-500" />
              <CardTitle>Spatial Update Rule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-secondary/30 rounded-lg flex items-center justify-center min-h-[120px]">
                <div dangerouslySetInnerHTML={{ __html: `$$${MATH_EQUATIONS.spatial}$$` }} />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Aggregates signals from neighboring PoPs using a normalized adjacency matrix $\tilde{A}$, capturing geographical propagation.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-soft">
            <CardHeader className="flex flex-row items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <CardTitle>Temporal Evolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-secondary/30 rounded-lg flex items-center justify-center min-h-[120px]">
                <div dangerouslySetInnerHTML={{ __html: `$$${MATH_EQUATIONS.temporal}$$` }} />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Maintains a recursive state through time using Gated Recurrent Units, modeling the persistence and decay of latency shocks.
              </p>
            </CardContent>
          </Card>
        </section>
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-6 h-6 text-foreground" />
            <h2 className="text-2xl font-bold">PyTorch Geometric Implementation</h2>
          </div>
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="p-0 overflow-hidden">
              <pre className="p-6 text-sm font-mono text-zinc-300 overflow-x-auto">
                <code>{ST_GNN_PYTORCH_CODE.trim()}</code>
              </pre>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}