using System;
using System.Threading.Tasks;
using SocketServer.Data.Models;
using SocketServer.ContainerModels.ContainerUpdates;
using System.Collections.Generic;

namespace SocketServer.Data.Repositories
{
    public interface IContainerUpdateRepo
    {
        Task CreateServer(string servername, List<OverviewContainerData> containers);
        Task<bool> ServerExists(string servername);
        Task<DatabaseContainer> AddStatusRecordToUpdaterContainer(string servername, StatusRecord record);
        Task AddStatusRecord(string servername, OverviewContainerData containerData);
        Task AddRessourceUsageRecord(string servername, StatsContainerData containerData);
    }
}