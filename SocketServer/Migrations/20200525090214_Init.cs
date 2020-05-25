using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SocketServer.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Servers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Servername = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Servers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Containers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ContainerId = table.Column<string>(nullable: true),
                    ServerId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Containers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Containers_Servers_ServerId",
                        column: x => x.ServerId,
                        principalTable: "Servers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContainerRessourceUsages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TimeOfRecordInsertion = table.Column<DateTime>(nullable: false),
                    CPUPercentageUse = table.Column<int>(nullable: false),
                    MemoryPercentageUse = table.Column<int>(nullable: false),
                    DiskInputBytes = table.Column<decimal>(nullable: false),
                    DiskOutputBytes = table.Column<decimal>(nullable: false),
                    NetInputBytes = table.Column<decimal>(nullable: false),
                    NetOutputBytes = table.Column<decimal>(nullable: false),
                    ContainerId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContainerRessourceUsages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContainerRessourceUsages_Containers_ContainerId",
                        column: x => x.ContainerId,
                        principalTable: "Containers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContainerUptimes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TimeOfRecordInsertion = table.Column<DateTime>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    Health = table.Column<int>(nullable: true),
                    ContainerId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContainerUptimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContainerUptimes_Containers_ContainerId",
                        column: x => x.ContainerId,
                        principalTable: "Containers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContainerRessourceUsages_ContainerId",
                table: "ContainerRessourceUsages",
                column: "ContainerId");

            migrationBuilder.CreateIndex(
                name: "IX_Containers_ServerId",
                table: "Containers",
                column: "ServerId");

            migrationBuilder.CreateIndex(
                name: "IX_ContainerUptimes_ContainerId",
                table: "ContainerUptimes",
                column: "ContainerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContainerRessourceUsages");

            migrationBuilder.DropTable(
                name: "ContainerUptimes");

            migrationBuilder.DropTable(
                name: "Containers");

            migrationBuilder.DropTable(
                name: "Servers");
        }
    }
}
