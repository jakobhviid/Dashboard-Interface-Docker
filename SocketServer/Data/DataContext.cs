using Microsoft.EntityFrameworkCore;
using SocketServer.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace SocketServer.Data
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Server> Servers { get; set; }
        public DbSet<DatabaseContainer> DatabaseContainers { get; set; }
        public DbSet<UpdaterContainer> UpdaterContainers { get; set; }
        public DbSet<StatusRecord> ContainerStatusRecords { get; set; }
        public DbSet<RessourceUsageRecord> ContainerRessourceUsageRecords { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Every servername must be unique
            modelBuilder.Entity<Server>()
                .HasIndex(s => s.Servername)
                .IsUnique();

            // Enum string conversions
            modelBuilder.Entity<StatusRecord>()
                .Property(sr => sr.Health)
                .HasConversion<string>();

            modelBuilder.Entity<StatusRecord>()
                .Property(sr => sr.Status)
                .HasConversion<string>();
        }
    }
}
