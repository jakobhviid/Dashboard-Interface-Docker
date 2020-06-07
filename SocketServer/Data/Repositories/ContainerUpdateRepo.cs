using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SocketServer.ContainerModels.ContainerUpdates;
using SocketServer.Data.Models;
using SocketServer.Helpers;
using static SocketServer.Helpers.ContainerHelpers;

namespace SocketServer.Data.Repositories
{
    public class ContainerUpdateRepo : IContainerUpdateRepo
    {
        private readonly DataContext _context;
        private readonly ILogger<ContainerUpdateRepo> _logger;
        public ContainerUpdateRepo(DataContext context, ILogger<ContainerUpdateRepo> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Server> CreateServer(string servername, IList<OverviewContainerData> containers)
        {
            _logger.LogInformation("Server does not exist: " + servername);
            bool serverExists = await ServerExists(servername);
            if (serverExists)throw new ArgumentException("Server already exists");
            try
            {
                var updaterContainer = FindUpdaterContainer(containers.ToList());
                if (updaterContainer == null)throw new ArgumentException("Server does not contain information on updater container");
                var server = new Server
                {
                    Servername = servername,
                    UpdaterContainer = new UpdaterContainer { ContainerId = updaterContainer.Id },
                };

                server.UpdaterContainer.Server = server; // Foreign key navigation property

                _context.Servers.Add(server);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Created a new server: " + servername);
                return server;
            }
            catch (ArgumentNullException)
            {
                throw new ArgumentException("Server does not contain an updater container");
            }
        }

        public async Task<Server> CreateServer(string servername, IList<StatsContainerData> containers)
        {
            _logger.LogInformation("Server does not exist: " + servername);
            bool serverExists = await ServerExists(servername);
            if (serverExists)throw new ArgumentException("Server already exists");
            try
            {
                var updaterContainer = FindUpdaterContainer(containers.ToList());
                if (updaterContainer == null)throw new ArgumentException("Server does not contain information on updater container");
                var server = new Server
                {
                    Servername = servername,
                    UpdaterContainer = new UpdaterContainer { ContainerId = updaterContainer.Id }
                };

                server.UpdaterContainer.Server = server; // Foreign key navigation property

                _context.Servers.Add(server);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Created a new server: " + servername);
                return server;
            }
            catch (ArgumentNullException)
            {
                throw new ArgumentException("Server does not contain an updater container");
            }
        }

        public async Task<bool> ServerExists(string servername)
        {
            return await _context.Servers.AnyAsync(s => s.Servername.Equals(servername));
        }

        public async Task AddRessourceUsageRecord(string servername, StatsContainerData container)
        {
            var server = await _context.Servers.Where(s => s.Servername.Equals(servername))
                .Include(s => s.UpdaterContainer)
                .ThenInclude(c => c.RessourceUsageRecords)
                .Include(s => s.Containers)
                .ThenInclude(c => c.RessourceUsageRecords)
                .SingleOrDefaultAsync();

            if (server == null)throw new ArgumentException("Server does not exist");

            var ressourceUsageRecord = new RessourceUsageRecord
            {
                TimeOfRecordInsertion = DateTime.Now,
                CPUPercentageUse = container.CpuPercentage,
                MemoryPercentageUse = container.MemoryPercentage,
                DiskInputBytes = container.DiskInputBytes,
                DiskOutputBytes = container.DiskOutputBytes,
                NetInputBytes = container.NetInputBytes,
                NetOutputBytes = container.NetOutputBytes
            };
            if (ContainerIsUpdater(container.Image))
            {
                ressourceUsageRecord.DatabaseContainer = server.UpdaterContainer;
                server.UpdaterContainer.RessourceUsageRecords.Add(ressourceUsageRecord);
                server.UpdaterContainer.ContainerId = container.Id;
            }
            else // Add it to the appropriate container
            {
                var databaseContainer = server.Containers.FirstOrDefault(c => c.ContainerId.Equals(container.Id));
                if (databaseContainer == null) // the server does not hold any records for this container yet
                {
                    databaseContainer = new DatabaseContainer { ContainerId = container.Id };
                    server.Containers.Add(databaseContainer);
                }

                ressourceUsageRecord.DatabaseContainer = databaseContainer;
            }

            await _context.SaveChangesAsync();
        }

        public async Task AddStatusRecord(string servername, OverviewContainerData container)
        {
            var server = await _context.Servers.Where(s => s.Servername.Equals(servername))
                .Include(s => s.UpdaterContainer)
                .ThenInclude(c => c.StatusRecords)
                .Include(s => s.Containers)
                .ThenInclude(c => c.StatusRecords)
                .SingleOrDefaultAsync();

            if (server == null)throw new ArgumentException("Server does not exist");

            var statusRecord = new StatusRecord
            {
                TimeOfRecordInsertion = DateTime.Now,
            };

            if (container.Health != null)
                if (container.Health.ToLower().Contains("unhealthy"))
                    statusRecord.Health = ContainerHealth.UnHealthy;
                else
                    statusRecord.Health = ContainerHealth.Healthy;

            if (container.Status.ToLower().Contains("up"))
                statusRecord.Status = ContainerStatus.Up;
            else
                statusRecord.Status = ContainerStatus.Down;

            if (ContainerIsUpdater(container.Image)) // Add the record to the updater container
            {
                statusRecord.DatabaseContainer = server.UpdaterContainer;
                server.UpdaterContainer.StatusRecords.Add(statusRecord);
                server.UpdaterContainer.ContainerId = container.Id;
            }
            else // Add it to the appropriate container
            {
                var databaseContainer = server.Containers.FirstOrDefault(c => c.ContainerId.Equals(container.Id));
                if (databaseContainer == null) // the server does not hold any records for this container yet
                {
                    databaseContainer = new DatabaseContainer { ContainerId = container.Id };
                    server.Containers.Add(databaseContainer);
                }

                statusRecord.DatabaseContainer = databaseContainer;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<DatabaseContainer> AddStatusRecordToUpdaterContainer(string servername, StatusRecord record)
        {
            var server = await _context.Servers.Where(s => s.Servername.Equals(servername))
                .Include(s => s.UpdaterContainer).ThenInclude(c => c.StatusRecords).SingleOrDefaultAsync();

            if (server == null)throw new ArgumentException("Server does not exist");

            if (server.UpdaterContainer == null)throw new NullReferenceException("Server does not have an updater container");

            record.DatabaseContainer = server.UpdaterContainer;
            server.UpdaterContainer.StatusRecords.Add(record);
            await _context.SaveChangesAsync();
            return server.UpdaterContainer;
        }
    }
}
