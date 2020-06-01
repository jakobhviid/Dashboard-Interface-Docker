using Microsoft.EntityFrameworkCore;
using SocketServer.Data.Models;

namespace SocketServer.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Server> Servers { get; set; }
        public DbSet<DatabaseContainer> Containers { get; set; }
        public DbSet<StatusRecord> ContainerUptimes { get; set; }
        public DbSet<RessourceUsageRecord> ContainerRessourceUsages { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Required relationship between server and containerUpTimes
            modelBuilder.Entity<DatabaseContainer>()
                .HasMany(c => c.StatusRecords)
                .WithOne()
                .IsRequired();
            modelBuilder.Entity<DatabaseContainer>()
                .HasMany(c => c.RessourceUsageRecords)
                .WithOne()
                .IsRequired();

            // Every servername must be unique
            modelBuilder.Entity<Server>()
                .HasIndex(s => s.Servername)
                .IsUnique();

            modelBuilder.Entity<Server>()
                .HasMany(s => s.Containers)
                .WithOne()
                .HasForeignKey(c => c.ServerId);

            modelBuilder.Entity<Server>()
                .HasOne(s => s.UpdaterContainer)
                .WithOne();
                
        }
    }
}
