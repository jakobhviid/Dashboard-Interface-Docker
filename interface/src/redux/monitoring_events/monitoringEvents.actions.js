import types from "./monitoringEvents.types";

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

function healthMonitor(containers, server) {
  const containersWithWarnings = [];

  for (const container of containers) {
    // If container has health, and then if it's unhealthy (healthy for testing purposes)
    if (
      container.state.health &&
      container.state.health.status === "unhealthy"
    ) {
      containersWithWarnings.push({
        id: container.id,
        name: container.name,
        warningTime: new Date(),
        reason: monitorReason.UNHEALTHY,
        type: eventType.ERROR,
        server,
      });
    }

    if (container.state.health && container.state.health.failingStreak !== 0) {
      containersWithWarnings.push({
        id: container.id,
        name: container.name,
        warningTime: new Date(),
        reason: monitorReason.HEALTHCHECK_FAIL,
        type: eventType.ERROR,
        server,
        extraInfo:
          "Container has a fail streak of " +
          container.state.health.failingStreak,
      });
    }
  }
  return containersWithWarnings;
}

export const checkContainerOverviewData = (containers, server) => {
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

export const checkContainerStats = (containers, server) => {
  const containersWithHighUsage = [];
  for (const container of containers) {
    if (container.cpu_percentage > 50) {
      containersWithHighUsage.push({
        id: container.id,
        name: container.name,
        warningTime: new Date(),
        reason: monitorReason.HIGH_CPU_USAGE,
        type: eventType.WARNING,
        server,
        extraInfo: "Container Used " + container.cpu_percentage + "% CPU",
      });
    }
    if (container.memory_percentage > 50) {
      containersWithHighUsage.push({
        id: container.id,
        name: container.name,
        warningTime: new Date(),
        reason: monitorReason.HIGH_MEMORY_USAGE,
        type: eventType.WARNING,
        server,
        extraInfo: "Container Used " + container.memory_percentage + "% Memory",
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
