export const ST_GNN_PYTORCH_CODE = `
import torch
import torch.nn as nn
import torch_geometric.nn as gnn
class STGNNLayer(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.conv = gnn.GCNConv(in_channels, out_channels)
        self.temporal_gru = nn.GRU(out_channels, out_channels, batch_first=True)
        self.activation = nn.ReLU()
    def forward(self, x, edge_index, h_prev):
        # Spatial Aggregation (GCN)
        x_s = self.conv(x, edge_index)
        x_s = self.activation(x_s)
        # Temporal Update (GRU)
        out, h_next = self.temporal_gru(x_s.unsqueeze(0), h_prev)
        return out.squeeze(0), h_next
class NeuroPulseModel(nn.Module):
    def __init__(self, num_nodes, in_feat, hidden_feat):
        super().__init__()
        self.layer1 = STGNNLayer(in_feat, hidden_feat)
        self.layer2 = STGNNLayer(hidden_feat, hidden_feat)
        self.regressor = nn.Linear(hidden_feat, 1)
    def forward(self, x, edge_index, h_state):
        x, h1 = self.layer1(x, edge_index, h_state[0])
        x, h2 = self.layer2(x, edge_index, h_state[1])
        return self.regressor(x), [h1, h2]
`;
export const MATH_EQUATIONS = {
  spatial: `H^{(l+1)}_s = \\sigma \\left( \\tilde{D}^{-\\frac{1}{2}} \\tilde{A} \\tilde{D}^{-\\frac{1}{2}} H^{(l)} W^{(l)} \\right)`,
  temporal: `H_t = \\text{GRU}(H_s, H_{t-1})`,
  propagation: `L_{i, t+1} = \\text{MLP}(H_{i, t}) + \\sum_{j \\in \\mathcal{N}(i)} w_{ij} L_{j, t}`,
};
export const MOCK_NODES = [
  // North America
  { id: 'SFO', name: 'San Francisco', lat: 37.7749, lng: -122.4194, latency: 12 },
  { id: 'SEA', name: 'Seattle', lat: 47.6062, lng: -122.3321, latency: 15 },
  { id: 'IAD', name: 'Ashburn', lat: 39.0438, lng: -77.4874, latency: 10 },
  { id: 'ORD', name: 'Chicago', lat: 41.8781, lng: -87.6298, latency: 14 },
  { id: 'DFW', name: 'Dallas', lat: 32.7767, lng: -96.7970, latency: 13 },
  { id: 'YYZ', name: 'Toronto', lat: 43.6532, lng: -79.3832, latency: 16 },
  { id: 'MEX', name: 'Mexico City', lat: 19.4326, lng: -99.1332, latency: 25 },
  // Europe
  { id: 'LHR', name: 'London', lat: 51.5074, lng: -0.1278, latency: 15 },
  { id: 'FRA', name: 'Frankfurt', lat: 50.1109, lng: 8.6821, latency: 14 },
  { id: 'CDG', name: 'Paris', lat: 48.8566, lng: 2.3522, latency: 16 },
  { id: 'AMS', name: 'Amsterdam', lat: 52.3676, lng: 4.9041, latency: 13 },
  { id: 'MAD', name: 'Madrid', lat: 40.4168, lng: -3.7038, latency: 22 },
  { id: 'MXP', name: 'Milan', lat: 45.4642, lng: 9.1900, latency: 18 },
  { id: 'ARN', name: 'Stockholm', lat: 59.3293, lng: 18.0686, latency: 24 },
  // Asia
  { id: 'SIN', name: 'Singapore', lat: 1.3521, lng: 103.8198, latency: 18 },
  { id: 'NRT', name: 'Tokyo', lat: 35.6762, lng: 139.6503, latency: 20 },
  { id: 'HKG', name: 'Hong Kong', lat: 22.3193, lng: 114.1694, latency: 22 },
  { id: 'ICN', name: 'Seoul', lat: 37.5665, lng: 126.9780, latency: 21 },
  { id: 'BOM', name: 'Mumbai', lat: 19.0760, lng: 72.8777, latency: 35 },
  { id: 'DXB', name: 'Dubai', lat: 25.2048, lng: 55.2708, latency: 30 },
  // Oceania
  { id: 'SYD', name: 'Sydney', lat: -33.8688, lng: 151.2093, latency: 25 },
  { id: 'AKL', name: 'Auckland', lat: -36.8485, lng: 174.7633, latency: 32 },
  // South America
  { id: 'GRU', name: 'Sao Paulo', lat: -23.5505, lng: -46.6333, latency: 28 },
  { id: 'EZE', name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, latency: 35 },
  // Africa
  { id: 'CPT', name: 'Cape Town', lat: -33.9249, lng: 18.4241, latency: 45 },
  { id: 'JNB', name: 'Johannesburg', lat: -26.2041, lng: 28.0473, latency: 42 },
];
export const MOCK_EDGES = [
  // Major Backbone Links
  { source: 'SFO', target: 'LHR', weight: 0.6 },
  { source: 'SFO', target: 'NRT', weight: 0.7 },
  { source: 'LHR', target: 'SIN', weight: 0.5 },
  { source: 'SIN', target: 'SYD', weight: 0.8 },
  { source: 'FRA', target: 'DXB', weight: 0.75 },
  { source: 'IAD', target: 'LHR', weight: 0.85 },
  { source: 'IAD', target: 'GRU', weight: 0.55 },
  { source: 'GRU', target: 'CPT', weight: 0.4 },
  // Regional Mesh North America
  { source: 'SFO', target: 'SEA', weight: 0.95 },
  { source: 'SFO', target: 'DFW', weight: 0.9 },
  { source: 'IAD', target: 'YYZ', weight: 0.92 },
  { source: 'IAD', target: 'ORD', weight: 0.94 },
  { source: 'DFW', target: 'MEX', weight: 0.8 },
  // Regional Mesh Europe
  { source: 'LHR', target: 'AMS', weight: 0.98 },
  { source: 'AMS', target: 'FRA', weight: 0.97 },
  { source: 'FRA', target: 'CDG', weight: 0.96 },
  { source: 'CDG', target: 'MAD', weight: 0.9 },
  { source: 'MAD', target: 'MXP', weight: 0.88 },
  { source: 'FRA', target: 'ARN', weight: 0.85 },
  // Regional Mesh Asia
  { source: 'SIN', target: 'HKG', weight: 0.92 },
  { source: 'HKG', target: 'ICN', weight: 0.9 },
  { source: 'ICN', target: 'NRT', weight: 0.95 },
  { source: 'SIN', target: 'BOM', weight: 0.85 },
  { source: 'BOM', target: 'DXB', weight: 0.82 },
];