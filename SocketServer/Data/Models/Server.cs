using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SocketServer.Data.Models
{
    public class Server
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Servername { get; set; }
        public ICollection<DatabaseContainer> Containers { get; set; }
        
        public Guid UpdaterContainerId { get; set; }
        [ForeignKey("UpdaterContainerId")]
        public DatabaseContainer UpdaterContainer { get; set; }
    }
}