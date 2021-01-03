using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using SocketServer.ContainerModels.ContainerUpdates;
using SocketServer.Helpers;
using SocketServer.Hubs.DockerUpdatersHub;

namespace SocketServer.Services
{
    public class MonitorStatsService : IMonitorStatsService
    {
        private const int CpuPercentageThreshold = 75;
        private const int MemoryPercentageThreshold = 50;
        
        private readonly IHubContext<DockerUpdatersHub, IDockerUpdaters> _updatersHub;

        public MonitorStatsService(IHubContext<DockerUpdatersHub, IDockerUpdaters> updatersHub)
        {
            _updatersHub = updatersHub;
        }
        
        public void CheckStatsData(StatsData statsData)
        {
            foreach (StatsContainerData statsDataContainer in statsData.Containers)
            {
                // Fire and forget! We don't need to know the result
                TaskHelper.RunBg(async () =>
                {
                    var cpuTask = CheckCpu(statsDataContainer, statsData.Servername);
                    var memoryTask = CheckMemory(statsDataContainer, statsData.Servername);
                    await Task.WhenAll(cpuTask, memoryTask);
                });
            }
        }

        private async Task CheckCpu(StatsContainerData statsData, string serverName)
        {
            if (statsData.CpuPercentage > CpuPercentageThreshold)
            {
                var notification = new MonitorNotification
                {
                    ServerName = serverName,
                    ContainerId = statsData.Id,
                    ContainerName = statsData.Name,
                    Reason = MonitorNotification.NotificationReason.HIGH_CPU_USAGE,
                    Type = MonitorNotification.NotificationType.WARNING,
                    Timestamp = DateTime.Now.ToString("HH:mm:ss dd/MM/yy"),
                    ExtraInfo = "Container Used " + statsData.CpuPercentage + "% CPU"
                };
                await _updatersHub.Clients.All.SendNotification(JsonConvert.SerializeObject(notification));
            }
        }

        private async Task CheckMemory(StatsContainerData statsData, string serverName)
        {
            if (statsData.MemoryPercentage > MemoryPercentageThreshold)
            {
                var notification = new MonitorNotification
                {
                    ServerName = serverName,
                    ContainerId = statsData.Id,
                    ContainerName = statsData.Name,
                    Reason = MonitorNotification.NotificationReason.HIGH_MEMORY_USAGE,
                    Type = MonitorNotification.NotificationType.WARNING,
                    Timestamp = DateTime.Now.ToString("HH:mm:ss dd/MM/yy"),
                    ExtraInfo = "Container Used " + statsData.MemoryPercentage + "% Memory"
                };
                await _updatersHub.Clients.All.SendNotification(JsonConvert.SerializeObject(notification));
            }
        }
    }
}