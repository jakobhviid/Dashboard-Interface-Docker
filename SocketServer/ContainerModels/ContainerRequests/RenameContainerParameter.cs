using Newtonsoft.Json;

namespace SocketServer.ContainerModels.ContainerRequest
{
    public class RenameContainerParameter
    {
        [JsonProperty(Required = Required.Always)]
        public const ContainerActionType Action = ContainerActionType.RENAME;
        [JsonProperty(Required = Required.Always)]
        public string ContainerId { get; set; }

        [JsonProperty(Required = Required.Always)]
        public string NewName { get; set; }
    }
}
