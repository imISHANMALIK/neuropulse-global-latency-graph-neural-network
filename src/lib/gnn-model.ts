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
        # Spatial Aggregation
        x_s = self.conv(x, edge_index)
        x_s = self.activation(x_s)
        # Temporal Update
        # x_s shape: (nodes, features)
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
  { id: 'SFO', name: 'San Francisco', lat: 37.7749, lng: -122.4194, status: 'stable', latency: 12 },
  { id: 'LHR', name: 'London', lat: 51.5074, lng: -0.1278, status: 'stable', latency: 15 },
  { id: 'SIN', name: 'Singapore', lat: 1.3521, lng: 103.8198, status: 'stable', latency: 18 },
  { id: 'FRA', name: 'Frankfurt', lat: 50.1109, lng: 8.6821, status: 'stable', latency: 14 },
  { id: 'NRT', name: 'Tokyo', lat: 35.6762, lng: 139.6503, status: 'stable', latency: 20 },
  { id: 'SYD', name: 'Sydney', lat: -33.8688, lng: 151.2093, status: 'stable', latency: 25 },
];
export const MOCK_EDGES = [
  { source: 'SFO', target: 'LHR', weight: 0.8 },
  { source: 'LHR', target: 'FRA', weight: 0.95 },
  { source: 'FRA', target: 'SIN', weight: 0.7 },
  { source: 'SIN', target: 'NRT', weight: 0.85 },
  { source: 'NRT', target: 'SFO', weight: 0.75 },
  { source: 'SYD', target: 'SIN', weight: 0.65 },
];