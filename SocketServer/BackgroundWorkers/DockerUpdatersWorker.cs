using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SocketServer.ContainerModels.ContainerUpdates;
using SocketServer.Data;
using SocketServer.Data.Models;
using SocketServer.Data.Repositories;
using SocketServer.Helpers;
using SocketServer.Hubs.DockerUpdatersHub;

namespace SocketServer.BackgroundWorkers
{
    public class DockerUpdatersWorker : BackgroundService
    {
        private readonly ILogger<DockerUpdatersWorker> _logger;
        private readonly IHubContext<DockerUpdatersHub, IDockerUpdaters> _updatersHub;
        // A dictionary of timers for every server who has sent information to the interface
        // NOTE: I'm not sure if this can cause problems as it is not stateless. If this server goes down, the timers will be wiped
        private Dictionary<string, System.Timers.Timer> overviewUpdateTimers = new Dictionary<string, System.Timers.Timer>();
        private IServiceProvider _services;

        public DockerUpdatersWorker(IServiceProvider services, ILogger<DockerUpdatersWorker> logger, IHubContext<DockerUpdatersHub, IDockerUpdaters> updatersHub)
        {
            _logger = logger;
            _updatersHub = updatersHub;
            _services = services;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumerConfig = new ConsumerConfig
            {
                GroupId = "socket-server-consumer" + Guid.NewGuid(), // NOTE: If the socket server restarts it will never join the same group. This is to ensure it always reads the latest data
                BootstrapServers = KafkaHelpers.BootstrapServers,
                AutoOffsetReset = AutoOffsetReset.Latest,
            };

            using(var c = new ConsumerBuilder<Ignore, string>(consumerConfig).Build())
            {

                c.Subscribe(new List<string> { KafkaHelpers.OverviewTopic, KafkaHelpers.StatsTopic });

                _logger.LogInformation("Listening for updates");
                while (!stoppingToken.IsCancellationRequested)
                {
                    // consumer does not have an async method. So it is wrapped in a task, so that the rest of the application doesn't hang here
                    var consumeResult = await Task.Factory.StartNew(() => c.Consume(stoppingToken));
                    switch (consumeResult.Topic)
                    {
                        case KafkaHelpers.OverviewTopic:
                            await _updatersHub.Clients.All.SendOverviewData(consumeResult.Message.Value);
                            // NOTE: The method checks on LatestOverviewInfo, so it's important this is called before LatestOverviewInfo is set after the record has been saved
                            await SaveStatusRecordInDb(consumeResult.Message.Value);
                            KafkaHelpers.LatestOverviewInfo = consumeResult.Message.Value;
                            break;
                        case KafkaHelpers.StatsTopic:
                            await _updatersHub.Clients.All.SendStatsData(consumeResult.Message.Value);
                            // NOTE: The method checks on LatestOverviewInfo, so it's important this is called before LatestOverviewInfo is set after the record has been saved
                            await SaveRessourceUsageRecordInDb(consumeResult.Message.Value);
                            KafkaHelpers.LatestStatsInfo = consumeResult.Message.Value;
                            break;
                    }
                }
                c.Close();
            }
        }
        /*
        Starts a timer for a server which will save a record to the database if 15 minutes is exceeded.
        */
        private void SetOverviewTimer(string servername)
        {
            // The updater container will at minimum send new data every 15 minutes
            var timer = new System.Timers.Timer(TimeSpan.FromMinutes(15).TotalMilliseconds);
            timer.AutoReset = true;
            timer.Enabled = true;
            timer.Elapsed += async(Object source, ElapsedEventArgs e) =>
            {
                try
                {
                    _logger.LogError("Overview has not sent data in 15 minutes. Notifying interface");
                    // TODO: notify relevant clients about this
                    using(var scope = _services.CreateScope())
                    {
                        var repo = scope.ServiceProvider.GetRequiredService<IContainerUpdateRepo>();
                        await repo.AddStatusRecordToUpdaterContainer(servername, new StatusRecord
                        {
                            TimeOfRecordInsertion = DateTime.Now,
                                Status = ContainerStatus.Down,
                                Health = ContainerHealth.UnHealthy
                        });
                    }
                }
                catch (ArgumentException)
                {
                    // TODO: Server doesn't exist handling
                }
            };
            overviewUpdateTimers.Add(servername, timer);
        }

        private async Task SaveStatusRecordInDb(string message)
        {
            try
            {
                var newOverviewData = JsonConvert.DeserializeObject<OverViewData>(message);

                var lastOverviewData = JsonConvert.DeserializeObject<OverViewData>(KafkaHelpers.LatestOverviewInfo);

                var containerIndex = 0;
                foreach (var newContainerState in newOverviewData.Containers)
                {
                    var lastContainerState = lastOverviewData.Containers[containerIndex];
                    if (!newContainerState.Equals(lastContainerState))
                    { // If the container is different
                        using(var scope = _services.CreateScope())
                        {
                            var repo = scope.ServiceProvider.GetRequiredService<IContainerUpdateRepo>();
                            await repo.AddStatusRecord(newOverviewData.Servername, newContainerState);
                        }
                    }
                    // TODO: If the change is worrisome (unhealthy, or down) send a notice to the dashboard interface
                    containerIndex++;
                }

                SetOverviewTimer(newOverviewData.Servername);
            }
            catch (Newtonsoft.Json.JsonException)
            {
                _logger.LogError("Invalid data");
            }

        }

        // TODO: An endpoint for the dashboard to get historical data for a graph overview
        // TODO: Maybe make a procedure which automatically calculates uptime for each container whenever a new insertion is made?

        private async Task SaveRessourceUsageRecordInDb(string message)
        {
            try
            {
                var newStatsData = JsonConvert.DeserializeObject<StatsData>(message);

                var lastStatsData = JsonConvert.DeserializeObject<StatsData>(KafkaHelpers.LatestStatsInfo);

                var containerIndex = 0;
                foreach (var newContainerState in newStatsData.Containers)
                {
                    using(var scope = _services.CreateScope())
                    {
                        var repo = scope.ServiceProvider.GetRequiredService<IContainerUpdateRepo>();
                        await repo.AddRessourceUsageRecord(newStatsData.Servername, newContainerState);
                    }
                    // TODO: If the ressource usage is worrisome send a notice to the dashboard interface for the relevant users
                    containerIndex++;
                }
            }
            catch (Newtonsoft.Json.JsonException)
            {
                _logger.LogError("Invalid data");
            }
        }
    }
}
