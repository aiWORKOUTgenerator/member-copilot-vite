export interface MeteredUsage {
  id: string;
  aggregated_value: number;
  end_time: number; // Unix timestamp
  meter: string;
  start_time: number; // Unix timestamp
}
