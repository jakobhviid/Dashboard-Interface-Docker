using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SocketServer.Helpers;
using SocketServer.Hubs.DockerUpdatersHub;

namespace SocketServer.BackgroundWorkers
{
    public class DockerUpdatersWorker : BackgroundService
    {
        private readonly ILogger<DockerUpdatersWorker> _logger;
        private readonly IHubContext<DockerUpdatersHub, IDockerUpdaters> _updatersHub;

        public DockerUpdatersWorker(ILogger<DockerUpdatersWorker> logger, IHubContext<DockerUpdatersHub, IDockerUpdaters> updatersHub)
        {
            _logger = logger;
            _updatersHub = updatersHub;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumerConfig = new ConsumerConfig
            {
                GroupId = "socket-server-dashboard-interface",
                BootstrapServers = KafkaHelpers.BootstrapServers,
                AutoOffsetReset = AutoOffsetReset.Earliest,
            };

            using(var c = new ConsumerBuilder<Ignore, string>(consumerConfig).Build())
            {
                c.Subscribe(new List<string> { KafkaHelpers.OverviewTopic, KafkaHelpers.StatsTopic });
                Console.WriteLine($"Listening for updates");

                while (!stoppingToken.IsCancellationRequested)
                {
                    // consumer does not have an async method. So it is wrapped in a task, so that the rest of the application doesn't hang here
                    var consumeResult = await Task.Factory.StartNew(() => c.Consume(stoppingToken));
                    _logger.LogInformation("I found a message! " + consumeResult.Message.Value);
                    switch (consumeResult.Topic)
                    {
                        case KafkaHelpers.OverviewTopic:
                            await _updatersHub.Clients.All.SendOverviewData(consumeResult.Message.Value);
                            break;
                        case KafkaHelpers.StatsTopic:
                            await _updatersHub.Clients.All.SendStatsData(consumeResult.Message.Value);
                            break;
                    }
                    await Task.Delay(1999, stoppingToken);
                    // TODO: Save the data in a database
                }
                c.Close();
            }
        }
    }
}
