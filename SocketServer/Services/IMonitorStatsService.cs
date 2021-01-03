using SocketServer.ContainerModels.ContainerUpdates;

namespace SocketServer.Services
{
    public interface IMonitorStatsService
    {
        void CheckStatsData(StatsData statsData);
    }
}