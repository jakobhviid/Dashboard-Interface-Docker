export interface IOverviewContainer {
  id: string;
  name: string;
  image: string[];
  state: string;
  status: string;
  creationTime: Date;
}

export interface IAPIOverviewData {
  servername: string;
  containers: IOverviewContainer[];
  commandRequestTopic?: string;
  commandResponseTopic?: string;
}

export interface IStatsContainer {
  id: string;
  name: string;
  cpuUsage: number;
  numOfCpu: number;
  systemCpuUsage: number;
  cpuPercentage: number;
  memoryPercentage: number;
  netInputBytes: number;
  netOutputBytes: number;
  diskInputBytes: number;
  diskOutputBytes: number;
}

export interface IAPIStatsData {
  servername: string;
  containers: IStatsContainer[];
  commandRequestTopic?: string;
  commandResponseTopic?: string;
}
