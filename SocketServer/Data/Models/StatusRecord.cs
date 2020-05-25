using System;

namespace SocketServer.Data.Models
{
    public enum ContainerStatus {
        Up,
        Down
    }

    public enum ContainerHealth {
        Healthy,
        UnHealthy
    }
    public class StatusRecord
    {
        public int Id { get; set; }
        public DateTime TimeOfRecordInsertion { get; set; }
        public ContainerStatus Status { get; set; }
        public ContainerHealth? Health { get; set; } // not all containers will have health information

        // Navigation properties
        public Guid ContainerId { get; set; }
        public Container Container { get; set; }
    }
}