using System;
using System.Collections.Generic;

namespace SocketServer.Data.Models
{
    public class Server
    {
        public Guid Id { get; set; }
        public string Servername { get; set; }
        public ICollection<Container> Container { get; set; }
        // TODO: Set CreationTime and UpdatedTime
    }
}