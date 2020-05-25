using System;
using System.Collections.Generic;

namespace SocketServer.Data.Models
{
    public class Container
    {
        public Guid Id { get; set; }
        public string ContainerId { get; set; }
        public ICollection<StatusRecord> StatusRecords { get; set; }
        public ICollection<RessourceUsageRecord> RessourceUsageRecords { get; set; }

        // Navigation properties
        public Guid ServerId { get; set; }
        public Server Server { get; set; }
    }
}