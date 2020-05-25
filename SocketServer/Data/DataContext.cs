using Microsoft.EntityFrameworkCore;
using SocketServer.Data.Models;

namespace SocketServer.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Server> Servers { get; set; }
        public DbSet<Container> Containers { get; set; }
        public DbSet<StatusRecord> ContainerUptimes { get; set; }
        public DbSet<RessourceUsageRecord> ContainerRessourceUsages { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Required relationship between server and containerUpTimes
            modelBuilder.Entity<Container>()
                .HasMany(c => c.StatusRecords)
                .WithOne(sr => sr.Container)
                .IsRequired();
            modelBuilder.Entity<Container>()
                .HasMany(c => c.RessourceUsageRecords)
                .WithOne(rur => rur.Container)
                .IsRequired();
        }
    }
}
