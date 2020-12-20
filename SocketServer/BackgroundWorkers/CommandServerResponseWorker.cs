using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Confluent.Kafka;
using System.Threading;
using System.Threading.Tasks;
using SocketServer.Hubs.DockerUpdatersHub;
using SocketServer.Helpers;
using System;
using System.Collections.Generic;

namespace SocketServer.BackgroundWorkers
{
    public class CommandServerResponseWorker : BackgroundService
    {
        private readonly ILogger<CommandServerResponseWorker> _logger;
        private readonly IHubContext<DockerUpdatersHub, IDockerUpdaters> _updatersHub;
        private CancellationToken _originalToken;
        private CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private List<TopicPartition> _currentAssignment = new List<TopicPartition>();
        private List<string> _desiredAssignment = new List<string>();

        public static CommandServerResponseWorker _instance { get; private set; }

        public CommandServerResponseWorker(ILogger<CommandServerResponseWorker> logger, IHubContext<DockerUpdatersHub, IDockerUpdaters> updatersHub)
        {
            _logger = logger;
            _updatersHub = updatersHub;
            _instance = this;
        }

        public void checkAssignment(String topic)
        {
            foreach (var topicPartition in _currentAssignment)
            {
                if (topic == topicPartition.Topic)
                {
                    return;
                }
            }
            Console.WriteLine("Adding topic: " + topic);
            _desiredAssignment.Add(topic);
            _cancellationTokenSource.Cancel();
            _cancellationTokenSource = new CancellationTokenSource();
            ExecuteAsync(_originalToken);
        }
        

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _originalToken = stoppingToken;
            
            
            if (_desiredAssignment.Count == 0)
            {
                await InitDesiredAssignment();
            }

            // If the desiredAssignment count is still 0,
            // then there is no topics to subscribe on, and therefore no need to create a consumer.
            if (_desiredAssignment.Count == 0) { return; }
            
            var consumerConfig = CreateConsumerConfig();

            using(var c = new ConsumerBuilder<Ignore, string>(consumerConfig).Build())
            {
                c.Subscribe(_desiredAssignment);

                _logger.LogInformation("Listening for responses from all command servers");
                while (!stoppingToken.IsCancellationRequested && !_cancellationTokenSource.IsCancellationRequested)
                {
                    // consumer does not have an async method. So it is wrapped in a task, so that the rest of the application doesn't hang here
                    var consumeTask = Task.Factory.StartNew(() => c.Consume(_cancellationTokenSource.Token));
                    while(c.Assignment.Count != _desiredAssignment.Count) {}

                    Console.WriteLine("Current assignment count: " + c.Assignment.Count);
                    _currentAssignment = c.Assignment;
                    
                    var consumeResult = await consumeTask;
                    if (consumeResult != null)
                    {
                        Console.WriteLine("Found a result! " + consumeResult.Message.Value);
                        await _updatersHub.Clients.All.SendCommandResponses(consumeResult.Message.Value);
                    }
                }
                Console.WriteLine("Closing consumer");
                c.Close();
            }
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _cancellationTokenSource.Cancel();
            return base.StopAsync(cancellationToken);
        }

        private async Task InitDesiredAssignment()
        {
            if (_desiredAssignment.Count != 0)
            {
                return;
            }
            
            var newCancellationTokenSource = new CancellationTokenSource();
            var consumerConfig = CreateConsumerConfig();
            
            using (var c = new ConsumerBuilder<Ignore, string>(consumerConfig).Build())
            {
                c.Subscribe($"^{KafkaHelpers.CommandResponseTopicPrefix}-1231");
                var consumerTask = Task.Factory.StartNew(() => c.Consume(newCancellationTokenSource.Token));
                
                // Gives the consumer 30*50 milliseconds to start up
                var retryCounter = 50;
                while (c.Assignment.Count == 0 && retryCounter > 0)
                {
                    Thread.Sleep(50);
                    retryCounter--;
                }
                
                foreach (var partition in c.Assignment)
                {
                    _desiredAssignment.Add(partition.Topic);
                }
                
                Console.WriteLine("Desired assignment count: " + _desiredAssignment.Count);
                newCancellationTokenSource.Cancel();
                await consumerTask;
                c.Close();
            }
        }

        private static ConsumerConfig CreateConsumerConfig()
        {
            var consumerConfig = new ConsumerConfig
            {
                GroupId = "socket-server-consumer-command-response" + Guid.NewGuid(), // NOTE: If the socket server restarts it will never join the same group. This is to ensure it always reads the latest data
                BootstrapServers = KafkaHelpers.BootstrapServers,
                AutoOffsetReset = AutoOffsetReset.Latest,
            };

            KafkaHelpers.SetKafkaConfigKerberos(consumerConfig);

            return consumerConfig;
        }
    }
}
