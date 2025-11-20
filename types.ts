export interface Convoy {
  id: string;
  name: string;
  status: 'Moving' | 'Delayed' | 'Completed' | 'Scheduled';
  eta: string;
  route: string;
  loadType: string;
}

export interface Alert {
  id: string;
  type: 'Traffic' | 'Weather' | 'Security' | 'Logistics';
  title: string;
  description: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface RoutePlan {
  startLocation: string;
  destination: string;
  priority: 'Low' | 'Medium' | 'High';
  distance?: string;
  estimatedTime?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  description?: string;
  waypoints?: string[];
}

export interface DashboardStats {
  convoyCount: number;
  activeMovements: number;
  delaysDetected: number;
}