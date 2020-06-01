using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocketServer.Data.Models
{
    public enum ContainerStatus
    {
        Up,
        Down
    }

    public enum ContainerHealth
    {
        Healthy,
        UnHealthy
    }
    public class StatusRecord
    {
        [Key]
        public int StatusRecordId { get; set; }

        [Required]
        public DateTime TimeOfRecordInsertion { get; set; }

        [Required]
        public ContainerStatus Status { get; set; }
        public ContainerHealth? Health { get; set; } // not all containers will have health information

        // Navigation properties
        public Guid DatabaseContainerId { get; set; }
        [ForeignKey("DatabaseContainerId")]
        public DatabaseContainer DatabaseContainer { get; set; }
    }
}
