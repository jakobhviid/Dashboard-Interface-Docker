using System.Collections.Generic;
using SocketServer.ContainerModels.ContainerUpdates;

namespace SocketServer.Helpers
{
    public static class ContainerHelpers
    {
        public static OverviewContainerData FindUpdaterContainer(List<OverviewContainerData> containers)
        {
            return containers.Find(c => c.Image.Contains("docker-dashboard-server"));
        }
        public static StatsContainerData FindUpdaterContainer(List<StatsContainerData> containers)
        {
            return containers.Find(c => c.Image.Contains("docker-dashboard-server"));
        }
    }
}
