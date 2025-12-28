import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ST_GNN_PYTORCH_CODE, MATH_EQUATIONS } from '@/lib/gnn-model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Code2, FunctionSquare, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export function ArchitecturePage() {
  const [copied, setCopied] = React.useState(false);
  useEffect(() => {
    // Manually trigger KaTeX rendering for dynamic content
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true },
        ],
        throwOnError: false,
      });
    }
  }, []);
  const handleCopy = () => {
    navigator.clipboard.writeText(ST_GNN_PYTORCH_CODE.trim());
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <AppLayout container>
      <div className="space-y-12">
        <header className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-display font-bold text-foreground">Model Architecture</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mt-2 leading-relaxed">
              NeuroPulse employs a Spatio-Temporal Graph Neural Network (ST-GNN) designed to handle the non-Euclidean nature of Cloudflare's global topology.
            </p>
          </motion.div>
        </header>
        <section className="grid gap-8 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-card border-border shadow-soft h-full">
              <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <FunctionSquare className="w-5 h-5 text-orange-500" />
                </div>
                <CardTitle>Spatial Update Rule</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-8 bg-zinc-950 rounded-xl flex flex-col items-center justify-center min-h-[160px] border border-zinc-800">
                  <div className="text-white text-lg font-serif">
                    <div className="math-display">
                      {`$$ ${MATH_EQUATIONS.spatial} $$`}
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                  Utilizes GCN layers to aggregate neighboring node features. The normalized Laplacian adjacency matrix ensures stability during high-volume propagation events.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-card border-border shadow-soft h-full">
              <CardHeader className="flex flex-row items-center gap-3 border-b pb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-500" />
                </div>
                <CardTitle>Temporal Evolution</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-8 bg-zinc-950 rounded-xl flex flex-col items-center justify-center min-h-[160px] border border-zinc-800">
                  <div className="text-white text-lg font-serif">
                    <div className="math-display">
                      {`$$ ${MATH_EQUATIONS.temporal} $$`}
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                  Recursive temporal units (GRU) capture the "stickiness" of latency shocks, modeling how congestion persists and decays over discrete time steps.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </section>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <Code2 className="w-6 h-6 text-zinc-100" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">PyTorch Geometric Implementation</h2>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy Code"}
            </Button>
          </div>
          <Card className="bg-zinc-950 border-zinc-800 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">st_gnn_model.py</span>
              </div>
              <pre className="p-6 text-sm font-mono text-zinc-300 overflow-x-auto leading-6 scrollbar-thin scrollbar-thumb-zinc-800">
                <code className="block">{ST_GNN_PYTORCH_CODE.trim()}</code>
              </pre>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </AppLayout>
  );
}
// Global declaration for window object
declare global {
  interface Window {
    renderMathInElement?: (element: HTMLElement, options?: any) => void;
  }
}