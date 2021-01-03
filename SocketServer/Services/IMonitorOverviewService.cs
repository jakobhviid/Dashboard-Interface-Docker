using SocketServer.ContainerModels.ContainerUpdates;

namespace SocketServer.Services
{
    public interface IMonitorOverviewService
    {
        void CheckOverviewData(OverViewData overviewData);
    }
}