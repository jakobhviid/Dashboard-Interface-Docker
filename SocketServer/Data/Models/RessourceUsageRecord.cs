using System;
namespace SocketServer.Data.Models
{
    public class RessourceUsageRecord
    {
        public int Id { get; set; }
        public DateTime TimeOfRecordInsertion { get; set; }
        public int CPUPercentageUse { get; set; }
        public int MemoryPercentageUse { get; set; }
        public ulong DiskInputBytes { get; set; }
        public ulong DiskOutputBytes { get; set; }
        public ulong NetInputBytes { get; set; }
        public ulong NetOutputBytes { get; set; }
        
        // Navigation properties
        public Guid ContainerId { get; set; }
        public Container Container { get; set; }
    }
}