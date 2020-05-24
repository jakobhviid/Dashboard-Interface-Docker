using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Confluent.Kafka;
using System.Threading;
using System.Threading.Tasks;
using SocketServer.Hubs.DockerUpdatersHub;
using SocketServer.Helpers;
using System;

namespace SocketServer.BackgroundWorkers
{
    public class CommandServerResponseWorker : BackgroundService
    {
        private readonly ILogger<CommandServerResponseWorker> _logger;
        private readonly IHubContext<DockerUpdatersHub, IDockerUpdaters> _updatersHub;

        public CommandServerResponseWorker(ILogger<CommandServerResponseWorker> logger, IHubContext<DockerUpdatersHub, IDockerUpdaters> updatersHub)
        {
            _logger = logger;
            _updatersHub = updatersHub;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumerConfig = new ConsumerConfig
            {
                GroupId = "socket-server-consumer-command-response" + Guid.NewGuid(), // NOTE: If the socket server restarts it will never join the same group. This is to ensure it always reads the latest data
                BootstrapServers = KafkaHelpers.BootstrapServers,
                AutoOffsetReset = AutoOffsetReset.Latest,
            };

            using(var c = new ConsumerBuilder<Ignore, string>(consumerConfig).Build())
            {
                
                c.Subscribe($"^{KafkaHelpers.CommandResponseTopicPrefix}");

                _logger.LogInformation("Listening for responses from all command servers");
                while (!stoppingToken.IsCancellationRequested)
                {
                    // consumer does not have an async method. So it is wrapped in a task, so that the rest of the application doesn't hang here
                    var consumeResult = await Task.Factory.StartNew(() => c.Consume(stoppingToken));
                    await _updatersHub.Clients.All.SendCommandResponses(consumeResult.Message.Value);
                }
                c.Close();
            }
        }
    }
}
