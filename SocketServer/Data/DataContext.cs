using Microsoft.EntityFrameworkCore;
using SocketServer.Data.Models;

namespace SocketServer.Data
{
    public class DataContext : DbContext
    {
        public DbSet<Server> Servers { get; set; }
        public DbSet<ContainerUptime> ContainerUptimes { get; set; }
        public DbSet<ContainerRessourceUsage> ContainerRessourceUsages { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Required relationship between server and containerUpTimes
            modelBuilder.Entity<Server>()
                .HasMany(s => s.ContainerUpTimes)
                .WithOne(c => c.Server)
                .IsRequired();
            modelBuilder.Entity<Server>()
                .HasMany(s => s.ContainerRessourceUsages)
                .WithOne(c => c.Server)
                .IsRequired();
        }
    }
}
