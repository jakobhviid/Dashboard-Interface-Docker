using System;
using System.Collections.Generic;

namespace SocketServer.Data.Models
{
    public class Server
    {
        public Guid Id { get; set; }
        public string Servername { get; set; }
        public ICollection<ContainerUptime> ContainerUpTimes { get; set; }
        public ICollection<ContainerRessourceUsage> ContainerRessourceUsages { get; set; }
        // TODO: Set CreationTime and UpdatedTime
    }
}