using System;
using System.Threading.Tasks;
using Confluent.Kafka;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace SocketServer.Helpers
{
    public static class KafkaHelpers
    {
        public static readonly string BootstrapServers = Environment.GetEnvironmentVariable("DASHBOARDI_KAFKA_URL") ?? "kafka1.cfei.dk:9092,kafka2.cfei.dk:9092,kafka3.cfei.dk:9092";
        public const string OverviewTopic = "f0e1e946-50d0-4a2b-b1a5-f21b92e09ac1-general_info";
        public const string StatsTopic = "33a325ce-b0c0-43a7-a846-4f46acdb367e-stats_info";
        public const string CommandResponseTopicPrefix = "command-responses-"; // TODO: Place all these shared variables such as overviewtopic, statstopic etc. plus containerRequests inside a shared nuget folder between the container server and the container interface
        public static string LatestOverviewInfo { get; set; } //TODO: Replace this with a database
        public static string LatestStatsInfo { get; set; } //TODO: Replace this with a database
        private static JsonSerializerSettings _jsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        public static async Task SendMessageAsync(string topic, object messageToSerialize, IProducer<Null, string> p)
        {
            try
            {
                var deliveryReport = await p.ProduceAsync(
                    topic, new Message<Null, string> { Value = JsonConvert.SerializeObject(messageToSerialize, _jsonSettings) });

                Console.WriteLine($"delivered to: {deliveryReport.TopicPartitionOffset}");
            }
            catch (ProduceException<string, string> e)
            {
                Console.WriteLine($"Failed to deliver message: {e.Message} [{e.Error.Code}]");
            }
        }
        // This method creates it own kafka producer and disposes it after it has been used
        public static async Task SendMessageAsync(string topic, object messageToSerialize)
        {
            ProducerConfig producerConfig = new ProducerConfig { BootstrapServers = BootstrapServers, Acks = Acks.Leader };

            KafkaHelpers.SetKafkaConfigKerberos(producerConfig);

            using (var p = new ProducerBuilder<Null, string>(producerConfig).Build())
            {
                try
                {
                    var deliveryReport = await p.ProduceAsync(
                        topic, new Message<Null, string> { Value = JsonConvert.SerializeObject(messageToSerialize, _jsonSettings) });

                    Console.WriteLine($"delivered to: {deliveryReport.TopicPartitionOffset}");
                }
                catch (ProduceException<string, string> e)
                {
                    Console.WriteLine($"Failed to deliver message: {e.Message} [{e.Error.Code}]");
                }
            }
        }

        public static ClientConfig SetKafkaConfigKerberos(ClientConfig config)
        {
            var saslEnabled = Environment.GetEnvironmentVariable("DASHBOARDI_KERBEROS_PUBLIC_URL");

            if (saslEnabled != null)
            {
                config.SecurityProtocol = SecurityProtocol.SaslPlaintext;
                config.SaslKerberosServiceName = Environment.GetEnvironmentVariable("DASHBOARDI_BROKER_KERBEROS_SERVICE_NAME") ?? "kafka";
                config.SaslKerberosKeytab = Environment.GetEnvironmentVariable("KEYTAB_LOCATION");

                // If the principal has been provided through volumes. The environment variable 'DASHBOARDS_KERBEROS_PRINCIPAL' will be set. If not 'DASHBOARDS_KERBEROS_API_SERVICE_USERNAME' will be set.
                var principalName = Environment.GetEnvironmentVariable("DASHBOARDI_KERBEROS_PRINCIPAL") ?? Environment.GetEnvironmentVariable("DASHBOARDI_KERBEROS_API_SERVICE_USERNAME");
                config.SaslKerberosPrincipal = principalName;
            }

            return config;
        }
    }
}
