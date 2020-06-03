using System.Collections.Generic;
using Newtonsoft.Json;

namespace SocketServer.ContainerModels.ContainerUpdates
{
    public struct OverViewData
    {
        [JsonProperty(Required = Required.Always)]
        public string Servername { get; set; }

        [JsonProperty(Required = Required.Always)]
        public IList<OverviewContainerData> Containers { get; set; }
        [JsonProperty(Required = Required.AllowNull)]
        public string CommandRequestTopic { get; set; }
        [JsonProperty(Required = Required.AllowNull)]
        public string CommandResponseTopic { get; set; }
    }
}
