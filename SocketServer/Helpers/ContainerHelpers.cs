using System.Collections.Generic;
using SocketServer.ContainerModels.ContainerUpdates;

namespace SocketServer.Helpers
{
    public static class ContainerHelpers
    {
        public static OverviewContainerData FindUpdaterContainer(List<OverviewContainerData> containers)
        {
            return containers.Find(c => ContainerIsUpdater(c.Image));
        }
        public static StatsContainerData FindUpdaterContainer(List<StatsContainerData> containers)
        {
            return containers.Find(c => ContainerIsUpdater(c.Image));
        }

        public static bool ContainerIsUpdater(string containerImage)
        {
            return containerImage.Contains("docker-dashboard-server");
        }
    }
}
