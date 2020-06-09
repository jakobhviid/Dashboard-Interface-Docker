using Newtonsoft.Json;

namespace SocketServer.ContainerModels.ContainerRequests
{
    public class StartContainerParameters
    {
        [JsonProperty(Required = Required.Always)]
        public const ContainerActionType Action = ContainerActionType.START;
        [JsonProperty(Required = Required.Always)]
        public string ContainerId { get; set; }
    }
}
