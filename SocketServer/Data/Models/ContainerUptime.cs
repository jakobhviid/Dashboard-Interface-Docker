using System;

namespace SocketServer.Data.Models
{
    public enum ContainerStatus {
        Up,
        Down
    }
    public class ContainerUptime
    {
        public int Id { get; set; }
        public string ContainerId { get; set; }
        public Server Server { get; set; }
        public DateTime TimeOfRecord { get; set; }
        public ContainerStatus Status { get; set; }
    }
}