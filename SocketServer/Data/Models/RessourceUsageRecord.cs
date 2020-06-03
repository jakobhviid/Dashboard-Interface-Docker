using System;
using System.ComponentModel.DataAnnotations;

namespace SocketServer.Data.Models
{
    public class RessourceUsageRecord
    {
        public int RessourceUsageRecordId { get; set; }
        [Required]
        public DateTime TimeOfRecordInsertion { get; set; }
        [Required]
        public double CPUPercentageUse { get; set; }
        [Required]
        public int MemoryPercentageUse { get; set; }
        public ulong DiskInputBytes { get; set; }
        public ulong DiskOutputBytes { get; set; }
        public ulong NetInputBytes { get; set; }
        public ulong NetOutputBytes { get; set; }
        
        // Navigation properties
        public DatabaseContainer DatabaseContainer { get; set; }
    }
}