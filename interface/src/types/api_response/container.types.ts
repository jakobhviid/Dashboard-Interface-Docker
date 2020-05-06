export enum ContainerStatus {
  Running = "running",
  Exited = "exited",
}

export enum ContainerHealthStatus {
  Healthy = "healthy",
  Unhealthy = "unhealthy",
}

export interface IOverviewContainer {
  id: string;
  name: string;
  image: string[];
  state: {
    status: ContainerStatus;
    startTime: Date;
    finishTime: Date;
    health?: {
      status: ContainerHealthStatus;
      failingStreak: number;
    };
  };
}

export interface IAPIOverviewData {
  servername: string;
  actionURL: string;
  containers: IOverviewContainer[];
}

export interface IStatsContainer {
  id: string;
  name: string;
  cpu_usage: number;
  num_of_cpu: number;
  system_cpu_usage: number;
  cpu_percentage: number;
  memory_percentage: number;
  net_input_bytes: number;
  net_output_bytes: number;
  disk_input_bytes: number;
  disk_output_bytes: number;
}

export interface IAPIStatsData {
  servername: string;
  actionURL: string;
  containers: IStatsContainer[];
}
