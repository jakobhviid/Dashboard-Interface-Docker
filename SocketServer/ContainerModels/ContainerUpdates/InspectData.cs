﻿using Newtonsoft.Json;

namespace SocketServer.ContainerModels.ContainerUpdates
{
    public class InspectData
    {
        [JsonProperty(Required = Required.Always)]
        public string ServerName { get; set; }

        [JsonProperty(Required = Required.Always)]
        public string ContainerId { get; set; }

        [JsonProperty(Required = Required.Always)]
        public string RawData { get; set; }
    }
}