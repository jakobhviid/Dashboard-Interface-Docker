using System;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SocketServer.ContainerModels.ContainerUpdates;
using SocketServer.Helpers;

namespace SocketServer.BackgroundWorkers
{
    public class InspectCommandResponseWorker : IInspectCommandResponseWorker
    {
        private readonly ILogger<CommandServerResponseWorker> _logger;

        public InspectCommandResponseWorker(ILogger<CommandServerResponseWorker> logger)
        {
            _logger = logger;
        }

        public async Task<InspectData> ExecuteAsync(string containerIdToListenFor, CancellationToken stoppingToken)
        {
            var consumerConfig = new ConsumerConfig
            {
                GroupId = "socket-server-consumer-inspect-response" +
                          Guid.NewGuid(), // NOTE: If the socket server restarts it will never join the same group. This is to ensure it always reads the latest data
                BootstrapServers = KafkaHelpers.BootstrapServers,
                AutoOffsetReset = AutoOffsetReset.Latest,
            };

            KafkaHelpers.SetKafkaConfigKerberos(consumerConfig);

            using (var c = new ConsumerBuilder<Ignore, string>(consumerConfig).Build())
            {

                c.Subscribe(KafkaHelpers.InspectTopic);

                InspectData lastInspectData = null;
                
                _logger.LogInformation("Listening for responses from all inspect servers");
                while (!stoppingToken.IsCancellationRequested && (lastInspectData == null || lastInspectData.ContainerId != containerIdToListenFor))
                {
                    // consumer does not have an async method. So it is wrapped in a task, so that the rest of the application doesn't hang here
                    var consumeResult = await Task.Factory.StartNew(() => c.Consume(stoppingToken));
                    lastInspectData = JsonConvert.DeserializeObject<InspectData>(consumeResult.Message.Value);
                }

                return lastInspectData;
            }
        }
    }
}