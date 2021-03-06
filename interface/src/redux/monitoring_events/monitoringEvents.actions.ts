import types from "./monitoringEvents.types";
import { IOverviewContainer, IStatsContainer } from "../../types/api_response/container.types";

const monitorReason = {
  UNHEALTHY: "Unhealthy Container",
  HEALTHCHECK_FAIL: "Container Failed Healthcheck",
  HIGH_CPU_USAGE: "High CPU Usage",
  HIGH_MEMORY_USAGE: "High Memory Usage",
};

export const eventType = {
  ERROR: "ERROR",
  WARNING: "WARNING",
  INFO: "INFORMATION",
};

function healthMonitor(containers: IOverviewContainer[], server: string) {
  const containersWithWarnings = [];

  for (const container of containers) {
    // If container has health, and then if it's unhealthy
    if (container.status.includes("unhealthy")) {
      containersWithWarnings.push({
        id: container.id,
        name: container.name,
        warningTime: new Date(),
        reason: monitorReason.UNHEALTHY,
        type: eventType.ERROR,
        server,
      });
    }
  }
  
  return containersWithWarnings;
}

export const checkContainerOverviewData = (containers: IOverviewContainer[], server:string) => {
  const containersWithWarnings = healthMonitor(containers, server);

  if (containersWithWarnings.length > 0) {
    return {
      type: types.CONTAINER_WARNING_FOUND,
      payload: containersWithWarnings,
    };
  } else {
    return {
      type: types.NO_NOTIFICATION_NEEDED,
    };
  }
};

export const checkContainerStats = (containers: IStatsContainer[], server:string) => {
  const containersWithHighUsage = [];
  for (const container of containers) {
    if (container.cpuPercentage > 75) {
      containersWithHighUsage.push({
        id: container.id,
        name: container.name,
        warningTime: new Date(),
        reason: monitorReason.HIGH_CPU_USAGE,
        type: eventType.WARNING,
        server,
        extraInfo: "Container Used " + container.cpuPercentage + "% CPU",
      });
    }
    if (container.memoryPercentage > 50) {
      containersWithHighUsage.push({
        id: container.id,
        name: container.name,
        warningTime: new Date(),
        reason: monitorReason.HIGH_MEMORY_USAGE,
        type: eventType.WARNING,
        server,
        extraInfo: "Container Used " + container.memoryPercentage + "% Memory",
      });
    }
  }

  if (containersWithHighUsage.length > 0) {
    return {
      type: types.CONTAINER_WARNING_FOUND,
      payload: containersWithHighUsage,
    };
  } else {
    return {
      type: types.NO_NOTIFICATION_NEEDED,
    };
  }
};

export const clearAllWarnings = () => ({
  type: types.CLEAR_ALL_WARNINGS,
});
