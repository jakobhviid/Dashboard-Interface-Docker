using System;
namespace SocketServer.Data.Models
{
    public class ContainerRessourceUsage
    {
        public int Id { get; set; }
        public string ContainerId { get; set; }
        public Server Server { get; set; }
        public DateTime TimeOfRecord { get; set; }
        public int CPUPercentageUse { get; set; }
        public int MemoryPercentageUse { get; set; }
        public ulong DiskInputBytes { get; set; }
        public ulong DiskOutputBytes { get; set; }
        public ulong NetInputBytes { get; set; }
        public ulong NetOutputBytes { get; set; }

    }
}