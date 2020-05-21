using System;
using System.Threading.Tasks;

namespace SocketServer.Hubs.DockerUpdatersHub
{
    public interface IDockerUpdaters
    {
        Task SendOverviewData(string update);
        Task SendStatsData(string update);
    }
}