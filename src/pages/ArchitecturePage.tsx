import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ST_GNN_PYTORCH_CODE, MATH_EQUATIONS } from '@/lib/gnn-model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Code2, FunctionSquare, Copy, Check, Zap, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export function ArchitecturePage() {
  const [copied, setCopied] = React.useState(false);
  useEffect(() => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$', right: '$', display: true },
          { left: '$$', right: '$$', display: true },
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
      <div className="space-y-16">
        <header className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Zap className="w-3 h-3" /> Technical Blueprint
            </div>
            <h1 className="text-5xl font-display font-bold text-foreground">Model Architecture</h1>
            <p className="text-muted-foreground text-xl max-w-3xl mt-4 leading-relaxed font-light">
              NeuroPulse utilizes a Spatio-Temporal Graph Neural Network (ST-GNN) architecture designed to process high-velocity telemetry across Cloudflare's non-Euclidean edge topology.
            </p>
          </motion.div>
        </header>
        {/* Neural Flow Visualization Mockup */}
        <section className="grid gap-8 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-zinc-950 border-zinc-800 shadow-glow h-full overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-3 border-b border-zinc-800 bg-zinc-900/50 pb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <FunctionSquare className="w-5 h-5 text-orange-500" />
                </div>
                <CardTitle className="text-white font-mono uppercase tracking-widest text-sm">Spatial Aggregate</CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="p-10 bg-black rounded-2xl border border-zinc-800 flex items-center justify-center min-h-[200px] shadow-inner">
                  <div className="text-white text-xl">
                    {`$ ${MATH_EQUATIONS.spatial} $`}
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <Layers className="w-5 h-5 text-zinc-500 shrink-0" />
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Message-passing layers aggregate latent features from k-hop neighbors using a localized first-order approximation of spectral graph convolutions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-zinc-950 border-zinc-800 shadow-glow h-full overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-3 border-b border-zinc-800 bg-zinc-900/50 pb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-500" />
                </div>
                <CardTitle className="text-white font-mono uppercase tracking-widest text-sm">Temporal Sequence</CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="p-10 bg-black rounded-2xl border border-zinc-800 flex items-center justify-center min-h-[200px] shadow-inner">
                  <div className="text-white text-xl">
                    {`$ ${MATH_EQUATIONS.temporal} $`}
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <Layers className="w-5 h-5 text-zinc-500 shrink-0" />
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Recursive Gated Recurrent Units (GRU) capture temporal dependencies and decay dynamics, modeling the persistence of network congestion.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">PyTorch Geometric Logic</h2>
                <p className="text-muted-foreground text-sm font-mono mt-1 uppercase">module/st_gnn_v1.py</p>
              </div>
            </div>
            <Button variant="outline" size="lg" onClick={handleCopy} className="gap-3 font-bold border-2 hover:bg-zinc-900">
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
              {copied ? "COPIED TO CLIPBOARD" : "COPY SOURCE CODE"}
            </Button>
          </div>
          <Card className="bg-zinc-950 border-zinc-800 shadow-2xl overflow-hidden group">
            <CardContent className="p-0">
              <div className="bg-zinc-900/80 px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40 group-hover:bg-red-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/40 group-hover:bg-amber-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/40 group-hover:bg-emerald-500 transition-colors" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">pytorch_geometric_implementation</span>
              </div>
              <pre className="p-10 text-base font-mono text-zinc-300 overflow-x-auto leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
                <code className="block">{ST_GNN_PYTORCH_CODE.trim()}</code>
              </pre>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </AppLayout>
  );
}
declare global {
  interface Window {
    renderMathInElement?: (element: HTMLElement, options?: any) => void;
  }
}