using System;
using System.Threading.Tasks;
using SocketServer.Data.Models;

namespace SocketServer.Data.Repositories
{
    public interface IContainerUpdateRepo
    {
        // There exists only one updater container per server.
        Task<Container> GetUpdaterContainerForServer(string servername);
        Task AddStatusRecord(Container container, StatusRecord record);
        Task AddRessourceUsageRecord(Container container, RessourceUsageRecord record);
    }
}