using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SocketServer.Data.Models
{
    public class DatabaseContainer
    {
        [Key]
        public Guid DatabaseContainerId { get; set; }
        [Required]
        public string ContainerId { get; set; }
        public ICollection<StatusRecord> StatusRecords { get; set; }
        public ICollection<RessourceUsageRecord> RessourceUsageRecords { get; set; }

        // Navigation properties
        public Guid ServerId { get; set; }
        [ForeignKey("ServerId")]
        public Server Server { get; set; }
    }
}