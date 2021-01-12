using System;
using System.Collections.Generic;
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
    /// <summary>
    ///     This worker behaves like a background service and it is initialized as one. However, it is necessary to be able to
    ///     update the Kafka consumer running in this service, therefore the instance of this background server is made
    ///     available through a static property. To update the currently consumed Kafka topics, the method
    ///     "CheckAssignment" can be used, this will check whether the requested topic is part of the current subscription.
    ///     If it is not, then the method will update the desired assignments, use a cancellation token to stop the current
    ///     consumer task, and then restart the consumer with the updated subscription information. This service also
    ///     delays the launch of the program, as it has to fetch the current Kafka topics with a specific prefix. If there
    ///     is no current topics to subscribe on during the startup, then the consumer will not be created at all. The
    ///     consumer will then be created when the "CheckAssignment" method is called.
    ///     There is currently no way to remove a topic again, which is intended for now.
    /// </summary>
    public class CommandServerResponseWorker : BackgroundService
    {
        private readonly List<string> _desiredAssignment = new List<string>();
        private readonly ILogger<CommandServerResponseWorker> _logger;
        private readonly IHubContext<DockerUpdatersHub, IDockerUpdaters> _updatersHub;
        private CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private List<TopicPartition> _currentAssignment = new List<TopicPartition>();
        private CancellationToken _originalToken;

        public CommandServerResponseWorker(ILogger<CommandServerResponseWorker> logger,
            IHubContext<DockerUpdatersHub, IDockerUpdaters> updatersHub)
        {
            _logger = logger;
            _updatersHub = updatersHub;
            _instance = this;
        }

        public static CommandServerResponseWorker _instance { get; private set; }

        public void CheckAssignment(string topic)
        {
            foreach (var topicPartition in _currentAssignment)
                if (topic == topicPartition.Topic)
                    return;
            _logger.LogInformation("Adding topic to command response listener: " + topic);
            _desiredAssignment.Add(topic);
            _cancellationTokenSource.Cancel();
            _cancellationTokenSource = new CancellationTokenSource();

            // Fire and forget!
            ExecuteAsync(_originalToken);
        }


        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _originalToken = stoppingToken;

            if (_desiredAssignment.Count == 0) await InitDesiredAssignment();
            // If desiredAssignment is still 0, then we don't need to start the Kafka consumer now, because there is no
            // relevant topics to subscribe on right now.
            if (_desiredAssignment.Count == 0) return;

            var consumerConfig = CreateConsumerConfig();

            using (var c = new ConsumerBuilder<Ignore, string>(consumerConfig).Build())
            {
                // Update the subscription of the current consumer.
                c.Subscribe(_desiredAssignment);

                _logger.LogInformation("Listening for responses from all command servers");
                while (!stoppingToken.IsCancellationRequested && !_cancellationTokenSource.IsCancellationRequested)
                {
                    // consumer does not have an async method. So it is wrapped in a task, so that the rest of the application doesn't hang here
                    var consumeTask = Task.Factory.StartNew(() => c.Consume(_cancellationTokenSource.Token));
                    while (c.Assignment.Count != _desiredAssignment.Count)
                    {
                    }

                    _currentAssignment = c.Assignment;

                    var consumeResult = await consumeTask;
                    if (consumeResult != null)
                        await _updatersHub.Clients.All.SendCommandResponses(consumeResult.Message.Value);
                }

                c.Close();
            }
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            // We have to cancel the "non-original" cancellation token.
            _cancellationTokenSource.Cancel();

            return base.StopAsync(cancellationToken);
        }

        private async Task InitDesiredAssignment()
        {
            if (_desiredAssignment.Count != 0) return;

            var newCancellationTokenSource = new CancellationTokenSource();
            var consumerConfig = CreateConsumerConfig();

            using (var c = new ConsumerBuilder<Ignore, string>(consumerConfig).Build())
            {
                c.Subscribe($"^{KafkaHelpers.CommandResponseTopicPrefix}-123");
                var consumerTask = Task.Factory.StartNew(() => c.Consume(newCancellationTokenSource.Token));

                // Gives the consumer 30*50 milliseconds to start up
                // This is given because, there is a scenario, where there is no topics to subscribe on.
                // Without this counter, the program would get stuck on the next while loop.
                var retryCounter = 50;
                while (c.Assignment.Count == 0 && retryCounter > 0)
                {
                    Thread.Sleep(50);
                    retryCounter--;
                }

                foreach (var partition in c.Assignment) _desiredAssignment.Add(partition.Topic);

                try
                {
                    newCancellationTokenSource.Cancel();
                    await consumerTask;
                }
                catch (OperationCanceledException e)
                {
                    // The consumer task may throw this exception, however, we simply want the system to continue, as
                    // with or without the exception, the current task will have stopped by now.
                }

                c.Close();
            }
        }

        private static ConsumerConfig CreateConsumerConfig()
        {
            var consumerConfig = new ConsumerConfig
            {
                GroupId = "socket-server-consumer-command-response" +
                          Guid.NewGuid(), // NOTE: If the socket server restarts it will never join the same group. This is to ensure it always reads the latest data
                BootstrapServers = KafkaHelpers.BootstrapServers,
                AutoOffsetReset = AutoOffsetReset.Latest
            };

            KafkaHelpers.SetKafkaConfigKerberos(consumerConfig);

            return consumerConfig;
        }
    }
}