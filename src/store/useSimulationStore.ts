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
  resetSimulation: () => void;
  tick: () => void;
  setPropagationSpeed: (speed: number) => void;
  setShockMagnitude: (magnitude: number) => void;
}
const INITIAL_NODES: PoPNode[] = JSON.parse(JSON.stringify(MOCK_NODES)).map((n: any) => ({
  ...n,
  status: 'stable',
  baseline: n.latency,
  history: []
}));
export const useSimulationStore = create<SimulationState>((set) => ({
  nodes: INITIAL_NODES,
  edges: MOCK_EDGES,
  propagationSpeed: 0.5,
  shockMagnitude: 80,
  lastEvent: null,
  setPropagationSpeed: (speed) => set({ propagationSpeed: speed }),
  setShockMagnitude: (magnitude) => set({ shockMagnitude: magnitude }),
  injectShock: (nodeId) => set((state) => {
    const node = state.nodes.find(n => n.id === nodeId);
    if (!node) return state;
    const newNodes = state.nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          latency: n.latency + state.shockMagnitude,
          status: 'critical' as NodeStatus,
        };
      }
      return n;
    });
    return {
      nodes: newNodes,
      lastEvent: `Shock injected at ${node.name} (${nodeId})`
    };
  }),
  resetSimulation: () => set({
    nodes: INITIAL_NODES.map(n => ({ ...n, history: [] })),
    lastEvent: "Simulation state reset to baseline"
  }),
  tick: () => set((state) => {
    const time = Date.now();
    const decayFactor = 0.96; // Slightly slower decay for better visual tracking
    const coupling = 0.12 * state.propagationSpeed; // Dynamic GNN coupling weight
    const nextNodes = state.nodes.map(node => {
      // 1. Spatial Aggregation (GNN Message Passing Implementation)
      let neighborhoodImpact = 0;
      const connectedEdges = state.edges.filter(e => e.source === node.id || e.target === node.id);
      connectedEdges.forEach(edge => {
        const neighborId = edge.source === node.id ? edge.target : edge.source;
        const neighbor = state.nodes.find(n => n.id === neighborId);
        if (neighbor) {
          const stress = Math.max(0, neighbor.latency - neighbor.baseline);
          neighborhoodImpact += stress * edge.weight * coupling;
        }
      });
      // 2. Temporal Update (Decay + Propagation)
      const currentStress = node.latency - node.baseline;
      const nextLatency = node.baseline + (currentStress * decayFactor) + neighborhoodImpact;
      // 3. Status State Machine
      let nextStatus: NodeStatus = 'stable';
      if (nextLatency > node.baseline * 2.5) nextStatus = 'critical';
      else if (nextLatency > node.baseline * 1.5) nextStatus = 'warning';
      // 4. Update Time-Series History
      const newHistoryEntry = {
        time,
        latency: parseFloat(nextLatency.toFixed(2)),
        risk: Math.min(100, Math.max(0, ((nextLatency - node.baseline) / node.baseline) * 50))
      };
      const newHistory = [...node.history, newHistoryEntry].slice(-60);
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