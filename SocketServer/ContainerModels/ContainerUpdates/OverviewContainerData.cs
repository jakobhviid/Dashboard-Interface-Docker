using System;
using System.Diagnostics.CodeAnalysis;
using Newtonsoft.Json;

namespace SocketServer.ContainerModels.ContainerUpdates
{
    public class OverviewContainerData : IEquatable<OverviewContainerData>
    {
        [JsonProperty(Required = Required.Always)]
        public string Id { get; set; }

        [JsonProperty(Required = Required.Always)]
        public string Name { get; set; }

        [JsonProperty(Required = Required.Always)]
        public string Image { get; set; }

        [JsonProperty(Required = Required.Always)]
        public string State { get; set; }

        [JsonProperty(Required = Required.Always)]
        public string Status { get; set; }

        [JsonProperty(Required = Required.AllowNull)]
        public string Health { get; set; }

        [JsonProperty(Required = Required.Always)]
        public DateTime CreationTime { get; set; }

        [JsonProperty(Required = Required.Always)]
        public DateTime UpdateTime { get; set; }

        public bool Equals([AllowNull] OverviewContainerData other)
        {
            Console.WriteLine("WHAT");
            return (
                this.Image.Equals(other.Image) &&
                this.State.Equals(other.State) &&
                this.Status.Equals(other.Status) &&
                this.Health.Equals(other.Health)
            );
        }
    }
}
