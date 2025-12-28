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
const INITIAL_NODES: PoPNode[] = MOCK_NODES.map((n) => ({
  ...n,
  status: 'stable',
  baseline: n.latency,
  history: []
}));
// Helper for geographical distance factor in GNN coupling
function getGeoDistance(n1: PoPNode, n2: PoPNode) {
  const R = 6371; // Earth radius in km
  const dLat = (n2.lat - n1.lat) * Math.PI / 180;
  const dLon = (n2.lng - n1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(n1.lat * Math.PI / 180) * Math.cos(n2.lat * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
export const useSimulationStore = create<SimulationState>((set) => ({
  nodes: INITIAL_NODES,
  edges: MOCK_EDGES,
  propagationSpeed: 0.8,
  shockMagnitude: 120,
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
      lastEvent: `ALERT: Shock detected at ${node.name} (${nodeId})`
    };
  }),
  resetSimulation: () => set({
    nodes: INITIAL_NODES.map(n => ({ ...n, history: [] })),
    lastEvent: "SYSTEM: All simulation vectors reset to baseline"
  }),
  tick: () => set((state) => {
    const time = Date.now();
    const decayFactor = 0.94; // Optimized decay
    const coupling = 0.15 * state.propagationSpeed;
    const nextNodes = state.nodes.map(node => {
      // 1. Spatial Aggregation with Geo-Distance Falloff
      let neighborhoodImpact = 0;
      const connectedEdges = state.edges.filter(e => e.source === node.id || e.target === node.id);
      connectedEdges.forEach(edge => {
        const neighborId = edge.source === node.id ? edge.target : edge.source;
        const neighbor = state.nodes.find(n => n.id === neighborId);
        if (neighbor) {
          const distance = getGeoDistance(node, neighbor);
          const distanceDecay = Math.max(0.1, 1 - (distance / 20000)); // Normalized distance factor
          const stress = Math.max(0, neighbor.latency - neighbor.baseline);
          neighborhoodImpact += stress * edge.weight * coupling * distanceDecay;
        }
      });
      // 2. Temporal GRU Update
      const currentStress = node.latency - node.baseline;
      const nextLatency = node.baseline + (currentStress * decayFactor) + neighborhoodImpact;
      // 3. Status Mapping
      let nextStatus: NodeStatus = 'stable';
      if (nextLatency > node.baseline * 3) nextStatus = 'critical';
      else if (nextLatency > node.baseline * 1.8) nextStatus = 'warning';
      // 4. History Snapshot
      const newHistoryEntry = {
        time,
        latency: parseFloat(nextLatency.toFixed(2)),
        risk: Math.min(100, Math.max(0, ((nextLatency - node.baseline) / node.baseline) * 40))
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