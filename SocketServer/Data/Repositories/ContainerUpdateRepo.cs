using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SocketServer.ContainerModels.ContainerUpdates;
using SocketServer.Data.Models;

namespace SocketServer.Data.Repositories
{
    public class ContainerUpdateRepo : IContainerUpdateRepo
    {
        private readonly DataContext _context;
        public ContainerUpdateRepo(DataContext context)
        {
            _context = context;
        }

        public async Task AddRessourceUsageRecord(string servername, StatsContainerData containerData)
        {
            var server = await _context.Servers.Where(s => s.Servername.Equals(servername))
                .Include(s => s.UpdaterContainer)
                .ThenInclude(c => c.RessourceUsageRecords)
                .Include(s => s.Containers)
                .ThenInclude(c => c.RessourceUsageRecords)
                .SingleOrDefaultAsync();
            var ressourceUsageRecord = new RessourceUsageRecord
            {
                TimeOfRecordInsertion = DateTime.Now,
                CPUPercentageUse = containerData.CpuPercentage,

            };

            if (containerData.Id.Equals(server.UpdaterContainer.ContainerId))
            {
                ressourceUsageRecord.DatabaseContainer = server.UpdaterContainer;
                ressourceUsageRecord.DatabaseContainerId = server.UpdaterContainer.DatabaseContainerId;
                server.UpdaterContainer.RessourceUsageRecords.Add(ressourceUsageRecord);
            }
            else
            {
                var container = server.Containers.FirstOrDefault(c => c.ContainerId.Equals(containerData.Id));
                ressourceUsageRecord.DatabaseContainer = container;
                ressourceUsageRecord.DatabaseContainerId = container.DatabaseContainerId;
            }

            await _context.SaveChangesAsync();
        }

        public async Task AddStatusRecord(string servername, OverviewContainerData containerData)
        {
            var server = await _context.Servers.Where(s => s.Servername.Equals(servername))
                .Include(s => s.UpdaterContainer)
                .ThenInclude(c => c.StatusRecords)
                .Include(s => s.Containers)
                .ThenInclude(c => c.StatusRecords)
                .SingleOrDefaultAsync();

            var statusRecord = new StatusRecord
            {
                TimeOfRecordInsertion = DateTime.Now,
            };

            if (containerData.Health != null)
                if (containerData.Health.ToLower().Contains("unhealthy"))
                    statusRecord.Health = ContainerHealth.UnHealthy;
                else
                    statusRecord.Health = ContainerHealth.Healthy;

            if (containerData.Status.ToLower().Contains("up"))
                statusRecord.Status = ContainerStatus.Up;
            else
                statusRecord.Status = ContainerStatus.Down;

            if (containerData.Id.Equals(server.UpdaterContainer.ContainerId))
            {
                statusRecord.DatabaseContainer = server.UpdaterContainer;
                statusRecord.DatabaseContainerId = server.UpdaterContainer.DatabaseContainerId;
                server.UpdaterContainer.StatusRecords.Add(statusRecord);
            }
            else
            {
                var container = server.Containers.FirstOrDefault(c => c.ContainerId.Equals(containerData.Id));
                statusRecord.DatabaseContainer = container;
                statusRecord.DatabaseContainerId = container.DatabaseContainerId;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<DatabaseContainer> AddStatusRecordToUpdaterContainer(string servername, StatusRecord record)
        {
            var server = await _context.Servers.Where(s => s.Servername.Equals(servername))
                .Include(s => s.UpdaterContainer).ThenInclude(c => c.StatusRecords).SingleOrDefaultAsync();

            if (server == null)throw new ArgumentException("Server doesn't exist");

            if (server.UpdaterContainer == null)throw new NullReferenceException("Server does not have an updater container");

            record.DatabaseContainer = server.UpdaterContainer;
            server.UpdaterContainer.StatusRecords.Add(record);
            await _context.SaveChangesAsync();
            return server.UpdaterContainer;
        }
    }
}
