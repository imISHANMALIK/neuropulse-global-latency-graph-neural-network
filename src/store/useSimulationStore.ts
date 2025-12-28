import { create } from 'zustand';
import { MOCK_NODES, MOCK_EDGES } from '@/lib/gnn-model';
export type NodeStatus = 'stable' | 'warning' | 'critical';
export interface PoPNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: NodeStatus;
  latency: number;
  baseline: number;
  history: { time: number; latency: number; risk: number }[];
}
export interface Edge {
  source: string;
  target: string;
  weight: number;
}
interface SimulationState {
  nodes: PoPNode[];
  edges: Edge[];
  propagationSpeed: number;
  shockMagnitude: number;
  lastEvent: string | null;
  // Actions
  injectShock: (nodeId: string) => void;
  tick: () => void;
  setPropagationSpeed: (speed: number) => void;
  setShockMagnitude: (magnitude: number) => void;
}
export const useSimulationStore = create<SimulationState>((set) => ({
  nodes: MOCK_NODES.map(n => ({
    ...n,
    status: 'stable' as NodeStatus,
    baseline: n.latency,
    history: []
  })),
  edges: MOCK_EDGES,
  propagationSpeed: 0.5,
  shockMagnitude: 50,
  lastEvent: null,
  setPropagationSpeed: (speed) => set({ propagationSpeed: speed }),
  setShockMagnitude: (magnitude) => set({ shockMagnitude: magnitude }),
  injectShock: (nodeId) => set((state) => {
    const newNodes = state.nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          latency: node.latency + state.shockMagnitude,
          status: 'critical' as NodeStatus,
        };
      }
      return node;
    });
    return { 
      nodes: newNodes, 
      lastEvent: `Shock injected at ${nodeId}` 
    };
  }),
  tick: () => set((state) => {
    const time = Date.now();
    const decayFactor = 0.95; // Nodes slowly return to baseline
    const coupling = 0.1 * state.propagationSpeed; // How much neighbors influence each other
    const nextNodes = state.nodes.map(node => {
      // 1. Spatial Aggregation (Simplified GNN message passing)
      let neighborhoodImpact = 0;
      const connectedEdges = state.edges.filter(e => e.source === node.id || e.target === node.id);
      connectedEdges.forEach(edge => {
        const neighborId = edge.source === node.id ? edge.target : edge.source;
        const neighbor = state.nodes.find(n => n.id === neighborId);
        if (neighbor) {
          // If neighbor is stressed, it pushes latency to this node
          const stress = Math.max(0, neighbor.latency - neighbor.baseline);
          neighborhoodImpact += stress * edge.weight * coupling;
        }
      });
      // 2. Temporal Update (Decay + Propagation)
      const currentStress = node.latency - node.baseline;
      const nextLatency = node.baseline + (currentStress * decayFactor) + neighborhoodImpact;
      // Determine status
      let nextStatus: NodeStatus = 'stable';
      if (nextLatency > node.baseline * 2.5) nextStatus = 'critical';
      else if (nextLatency > node.baseline * 1.5) nextStatus = 'warning';
      // History tracking (keep last 50 points)
      const newHistory = [...node.history, { 
        time, 
        latency: parseFloat(nextLatency.toFixed(2)),
        risk: Math.min(100, (nextLatency / node.baseline) * 10)
      }].slice(-50);
      return {
        ...node,
        latency: nextLatency,
        status: nextStatus,
        history: newHistory
      };
    });
    return { nodes: nextNodes };
  })
}));