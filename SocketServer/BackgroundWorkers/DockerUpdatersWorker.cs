using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
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
        // NOTE: I'm not sure if this can cause problems as it is not stateless. If the container goes down, the timers will be wiped
        private Dictionary<string, System.Timers.Timer> overviewUpdateTimers = new Dictionary<string, System.Timers.Timer>();
        private readonly IContainerUpdateRepo _repo;

        public DockerUpdatersWorker(ILogger<DockerUpdatersWorker> logger, IHubContext<DockerUpdatersHub, IDockerUpdaters> updatersHub, IContainerUpdateRepo repo)
        {
            _logger = logger;
            _updatersHub = updatersHub;
            _repo = repo;
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
                            KafkaHelpers.LatestOverviewInfo = consumeResult.Message.Value;
                            await SaveStatusRecordInDb(consumeResult.Message.Value);
                            break;
                        case KafkaHelpers.StatsTopic:
                            await _updatersHub.Clients.All.SendStatsData(consumeResult.Message.Value);
                            KafkaHelpers.LatestStatsInfo = consumeResult.Message.Value;
                            await SaveRessourceUsageRecordInDb(consumeResult.Message.Value);
                            break;
                    }
                }
                c.Close();
            }
        }

        private void SetOverviewTimer(string servername)
        {
            // The updater will at minimum send new data every 15 minutes
            var timer = new System.Timers.Timer(TimeSpan.FromMinutes(15).TotalMilliseconds);
            timer.AutoReset = true;
            timer.Enabled = true;
            timer.Elapsed += async(Object source, ElapsedEventArgs e) =>
            {
                _logger.LogError("Overview has not sent data in 15 minutes. Notifying interface");
                var updaterContainer = await _repo.GetUpdaterContainerForServer(servername);
                await _repo.AddStatusRecord(updaterContainer, new StatusRecord
                {
                    TimeOfRecordInsertion = DateTime.Now,
                        Status = ContainerStatus.Down,
                        Health = ContainerHealth.UnHealthy
                });
                // TODO: notify clients about this
            };
            overviewUpdateTimers.Add(servername, timer);
        }

        private async Task SaveStatusRecordInDb(string message)
        {
            try
            {
                var overviewData = JsonConvert.DeserializeObject<OverViewData>(message);

                SetOverviewTimer(overviewData.Servername); // Sets a timer which will trigger if the updater does not send data in 15 min

                // If it has exceeded. Then set the updater to be unhealthy and down and don't record anything else return from the function

                // For every container information which have been sent

                // Check if the container information has changed since last insertion in the DB

                // If it has changed, then insert a new record into the DB

                // If the change is worrisome (unhealthy, or down) send a notice to the dashboard interface

            }
            catch (Newtonsoft.Json.JsonException ex)
            {
                _logger.LogError("Invalid data");
            }

        }

        // TODO: An endpoint for the dashboard to get historical data for a graph overview
        // TODO: Maybe make a procedure which automatically calculates uptime for each container whenever a new insertion is made?

        private async Task SaveRessourceUsageRecordInDb(string message)
        {

        }
    }
}
