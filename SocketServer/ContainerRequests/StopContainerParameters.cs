using Newtonsoft.Json;

namespace SocketServer.ContainerRequests
{
    public class StopContainerParameters
    {
        [JsonProperty(Required = Required.Always)]
        public const ContainerActionType Action = ContainerActionType.STOP;

        [JsonProperty(Required = Required.Always)]
        public string ContainerId { get; set; }
    }
}
