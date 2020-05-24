using System;
using System.Threading.Tasks;

namespace SocketServer.Hubs.DockerUpdatersHub
{
    // This interface defines all the methods the server can call on the clients
    public interface IDockerUpdaters
    {
        Task SendOverviewData(string update);
        Task SendStatsData(string update);
        Task SendCommandResponses(string commandResponse);
    }
}