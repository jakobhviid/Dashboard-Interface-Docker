using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SocketServer.Data.Models
{
    public class Server
    {
        public Guid Id { get; set; }
        [Required]
        public string Servername { get; set; }
        public ICollection<DatabaseContainer> Containers { get; set; }
        
        public Guid UpdaterContainerId { get; set; }
        public UpdaterContainer UpdaterContainer { get; set; }
    }
}