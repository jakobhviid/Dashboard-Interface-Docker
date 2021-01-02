using Newtonsoft.Json;

namespace SocketServer.ContainerModels.ContainerRequests
{
    public class LogContainerParameters
    {
        [JsonProperty(Required = Required.Always)]
        public const ContainerActionType Action = ContainerActionType.LOG;
        [JsonProperty(Required = Required.Always)]
        public string ContainerId { get; set; }
    }
}