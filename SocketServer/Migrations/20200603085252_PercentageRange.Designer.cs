﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SocketServer.Data;

namespace SocketServer.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20200603085252_PercentageRange")]
    partial class PercentageRange
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("SocketServer.Data.Models.DatabaseContainer", b =>
                {
                    b.Property<Guid>("DatabaseContainerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ContainerId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("ServerId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("DatabaseContainerId");

                    b.HasIndex("ServerId");

                    b.ToTable("DatabaseContainers");

                    b.HasDiscriminator<string>("Discriminator").HasValue("DatabaseContainer");
                });

            modelBuilder.Entity("SocketServer.Data.Models.RessourceUsageRecord", b =>
                {
                    b.Property<int>("RessourceUsageRecordId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("CPUPercentageUse")
                        .HasColumnType("float");

                    b.Property<Guid?>("DatabaseContainerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<decimal>("DiskInputBytes")
                        .HasColumnType("decimal(20,0)");

                    b.Property<decimal>("DiskOutputBytes")
                        .HasColumnType("decimal(20,0)");

                    b.Property<double>("MemoryPercentageUse")
                        .HasColumnType("float");

                    b.Property<decimal>("NetInputBytes")
                        .HasColumnType("decimal(20,0)");

                    b.Property<decimal>("NetOutputBytes")
                        .HasColumnType("decimal(20,0)");

                    b.Property<DateTime>("TimeOfRecordInsertion")
                        .HasColumnType("datetime2");

                    b.HasKey("RessourceUsageRecordId");

                    b.HasIndex("DatabaseContainerId");

                    b.ToTable("ContainerRessourceUsageRecords");
                });

            modelBuilder.Entity("SocketServer.Data.Models.Server", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Servername")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<Guid?>("UpdaterContainerDatabaseContainerId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("Servername")
                        .IsUnique();

                    b.HasIndex("UpdaterContainerDatabaseContainerId");

                    b.ToTable("Servers");
                });

            modelBuilder.Entity("SocketServer.Data.Models.StatusRecord", b =>
                {
                    b.Property<int>("StatusRecordId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<Guid?>("DatabaseContainerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Health")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("TimeOfRecordInsertion")
                        .HasColumnType("datetime2");

                    b.HasKey("StatusRecordId");

                    b.HasIndex("DatabaseContainerId");

                    b.ToTable("ContainerStatusRecords");
                });

            modelBuilder.Entity("SocketServer.Data.Models.UpdaterContainer", b =>
                {
                    b.HasBaseType("SocketServer.Data.Models.DatabaseContainer");

                    b.HasDiscriminator().HasValue("UpdaterContainer");
                });

            modelBuilder.Entity("SocketServer.Data.Models.DatabaseContainer", b =>
                {
                    b.HasOne("SocketServer.Data.Models.Server", "Server")
                        .WithMany("Containers")
                        .HasForeignKey("ServerId");
                });

            modelBuilder.Entity("SocketServer.Data.Models.RessourceUsageRecord", b =>
                {
                    b.HasOne("SocketServer.Data.Models.DatabaseContainer", "DatabaseContainer")
                        .WithMany("RessourceUsageRecords")
                        .HasForeignKey("DatabaseContainerId");
                });

            modelBuilder.Entity("SocketServer.Data.Models.Server", b =>
                {
                    b.HasOne("SocketServer.Data.Models.UpdaterContainer", "UpdaterContainer")
                        .WithMany()
                        .HasForeignKey("UpdaterContainerDatabaseContainerId");
                });

            modelBuilder.Entity("SocketServer.Data.Models.StatusRecord", b =>
                {
                    b.HasOne("SocketServer.Data.Models.DatabaseContainer", "DatabaseContainer")
                        .WithMany("StatusRecords")
                        .HasForeignKey("DatabaseContainerId");
                });
#pragma warning restore 612, 618
        }
    }
}
