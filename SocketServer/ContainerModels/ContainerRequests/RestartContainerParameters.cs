using Newtonsoft.Json;

namespace SocketServer.ContainerModels.ContainerRequest
{
    public class RestartContainerParameters
    {
        [JsonProperty(Required = Required.Always)]
        public const ContainerActionType Action = ContainerActionType.RESTART;
        [JsonProperty(Required = Required.Always)]
        public string ContainerId { get; set; }
    }
}
