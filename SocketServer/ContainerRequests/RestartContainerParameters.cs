using Newtonsoft.Json;

namespace SocketServer.ContainerRequests
{
    public class RestartContainerParameters
    {
        [JsonProperty(Required = Required.Always)]
        public const ContainerActionType Action = ContainerActionType.RESTART;
        [JsonProperty(Required = Required.Always)]
        public string ContainerId { get; set; }
    }
}
