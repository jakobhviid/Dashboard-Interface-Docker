using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using SocketServer.ContainerModels.ContainerUpdates;
using SocketServer.Helpers;
using SocketServer.Hubs.DockerUpdatersHub;

namespace SocketServer.Services
{
    public class MonitorOverviewService : IMonitorOverviewService
    {
        private readonly IHubContext<DockerUpdatersHub, IDockerUpdaters> _updatersHub;

        public MonitorOverviewService(IHubContext<DockerUpdatersHub, IDockerUpdaters> updatersHub)
        {
            _updatersHub = updatersHub;
        }

        public void CheckOverviewData(OverViewData overviewData)
        {
            foreach (OverviewContainerData overviewDataContainer in overviewData.Containers)
            {
                // Fire and forget! We don't need to know the result
                TaskHelper.RunBg(async () =>
                {
                    await CheckHealthStatus(overviewDataContainer, overviewData.Servername);
                });
            }
        }

        private async Task CheckHealthStatus(OverviewContainerData containerData, string serverName)
        {
            if (containerData.Status.Contains("unhealthy"))
            {
                var notification = new MonitorNotification
                {
                    ServerName = serverName,
                    ContainerId = containerData.Id,
                    ContainerName = containerData.Name,
                    Reason = MonitorNotification.NotificationReason.UNHEALTHY,
                    Type = MonitorNotification.NotificationType.ERROR,
                    Timestamp = DateTime.Now.ToString("HH:mm:ss dd/MM/yy")
                };
                await _updatersHub.Clients.All.SendNotification(JsonConvert.SerializeObject(notification));
            }
        }
    }
}