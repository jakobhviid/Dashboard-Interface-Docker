using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SocketServer.ContainerModels.ContainerUpdates
{
    public class MonitorNotification
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public enum NotificationReason
        {
            UNHEALTHY,
            HEALTH_CHECK_FAIL,
            HIGH_CPU_USAGE,
            HIGH_MEMORY_USAGE
        }
        
        [JsonConverter(typeof(StringEnumConverter))]
        public enum NotificationType
        {
            WARNING,
            ERROR,
            INFO
        }
        
        [JsonProperty(Required = Required.Always)]
        public string ServerName { get; set; }

        [JsonProperty(Required = Required.Always)]
        public string ContainerId { get; set; }

        [JsonProperty(Required = Required.Always)]
        public string ContainerName { get; set; }
        
        [JsonProperty(Required = Required.Always)]
        public string Timestamp { get; set; }
        
        [JsonProperty(Required = Required.Always)]
        public NotificationReason Reason { get; set; }
        
        [JsonProperty(Required = Required.Always)]
        public NotificationType Type { get; set; }
        
        [JsonProperty]
        public string ExtraInfo { get; set; }
    }
}