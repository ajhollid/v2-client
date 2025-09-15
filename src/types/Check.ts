export interface Check {
  _id: string;
  status: string;
  responseTime: number;
  createdAt: string;
}

export interface GroupedCheck {
  _id: string; // This will be the time bucket (e.g., minute, hour)
  avgResponseTime: number;
  count: number;
}
