using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SocketServer.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContainerRessourceUsageRecords",
                columns: table => new
                {
                    RessourceUsageRecordId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TimeOfRecordInsertion = table.Column<DateTime>(nullable: false),
                    CPUPercentageUse = table.Column<double>(nullable: false),
                    MemoryPercentageUse = table.Column<int>(nullable: false),
                    DiskInputBytes = table.Column<decimal>(nullable: false),
                    DiskOutputBytes = table.Column<decimal>(nullable: false),
                    NetInputBytes = table.Column<decimal>(nullable: false),
                    NetOutputBytes = table.Column<decimal>(nullable: false),
                    DatabaseContainerId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContainerRessourceUsageRecords", x => x.RessourceUsageRecordId);
                });

            migrationBuilder.CreateTable(
                name: "ContainerStatusRecords",
                columns: table => new
                {
                    StatusRecordId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TimeOfRecordInsertion = table.Column<DateTime>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    Health = table.Column<int>(nullable: true),
                    DatabaseContainerId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContainerStatusRecords", x => x.StatusRecordId);
                });

            migrationBuilder.CreateTable(
                name: "Servers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Servername = table.Column<string>(nullable: false),
                    UpdaterContainerId = table.Column<Guid>(nullable: false),
                    UpdaterContainerDatabaseContainerId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Servers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DatabaseContainers",
                columns: table => new
                {
                    DatabaseContainerId = table.Column<Guid>(nullable: false),
                    ContainerId = table.Column<string>(nullable: false),
                    ServerId = table.Column<Guid>(nullable: false),
                    Discriminator = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseContainers", x => x.DatabaseContainerId);
                    table.ForeignKey(
                        name: "FK_DatabaseContainers_Servers_ServerId",
                        column: x => x.ServerId,
                        principalTable: "Servers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContainerRessourceUsageRecords_DatabaseContainerId",
                table: "ContainerRessourceUsageRecords",
                column: "DatabaseContainerId");

            migrationBuilder.CreateIndex(
                name: "IX_ContainerStatusRecords_DatabaseContainerId",
                table: "ContainerStatusRecords",
                column: "DatabaseContainerId");

            migrationBuilder.CreateIndex(
                name: "IX_DatabaseContainers_ServerId",
                table: "DatabaseContainers",
                column: "ServerId");

            migrationBuilder.CreateIndex(
                name: "IX_Servers_Servername",
                table: "Servers",
                column: "Servername",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Servers_UpdaterContainerDatabaseContainerId",
                table: "Servers",
                column: "UpdaterContainerDatabaseContainerId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContainerRessourceUsageRecords_DatabaseContainers_DatabaseContainerId",
                table: "ContainerRessourceUsageRecords",
                column: "DatabaseContainerId",
                principalTable: "DatabaseContainers",
                principalColumn: "DatabaseContainerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContainerStatusRecords_DatabaseContainers_DatabaseContainerId",
                table: "ContainerStatusRecords",
                column: "DatabaseContainerId",
                principalTable: "DatabaseContainers",
                principalColumn: "DatabaseContainerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Servers_DatabaseContainers_UpdaterContainerDatabaseContainerId",
                table: "Servers",
                column: "UpdaterContainerDatabaseContainerId",
                principalTable: "DatabaseContainers",
                principalColumn: "DatabaseContainerId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Servers_DatabaseContainers_UpdaterContainerDatabaseContainerId",
                table: "Servers");

            migrationBuilder.DropTable(
                name: "ContainerRessourceUsageRecords");

            migrationBuilder.DropTable(
                name: "ContainerStatusRecords");

            migrationBuilder.DropTable(
                name: "DatabaseContainers");

            migrationBuilder.DropTable(
                name: "Servers");
        }
    }
}
