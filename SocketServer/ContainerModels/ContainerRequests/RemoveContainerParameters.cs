using Newtonsoft.Json;

namespace SocketServer.ContainerModels.ContainerRequest
{
    public class RemoveContainerParameters
    {
        [JsonProperty(Required = Required.Always)]
        public const ContainerActionType Action = ContainerActionType.REMOVE;

        [JsonProperty(Required = Required.Always)]
        public string ContainerId { get; set; }

        [JsonProperty(Required = Required.Default)]
        public bool RemoveVolumes { get; set; }
    }
}
