using System;
using System.Threading.Tasks;
using SocketServer.Data.Models;
using SocketServer.ContainerModels.ContainerUpdates;

namespace SocketServer.Data.Repositories
{
    public interface IContainerUpdateRepo
    {
        Task<DatabaseContainer> AddStatusRecordToUpdaterContainer(string servername, StatusRecord record);
        Task AddStatusRecord(string servername, OverviewContainerData containerData);
        Task AddRessourceUsageRecord(string servername, StatsContainerData containerData);
    }
}