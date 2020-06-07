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
        [Range(0.0001, 100)]
        public double CPUPercentageUse { get; set; }
        [Required]
        [Range(0.0001, 100)]
        public double MemoryPercentageUse { get; set; }
        [Required]
        public ulong DiskInputBytes { get; set; }
        [Required]
        public ulong DiskOutputBytes { get; set; }
        [Required]
        public ulong NetInputBytes { get; set; }
        [Required]
        public ulong NetOutputBytes { get; set; }
        
        // Navigation properties
        public DatabaseContainer DatabaseContainer { get; set; }
    }
}