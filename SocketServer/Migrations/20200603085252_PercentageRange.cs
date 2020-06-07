using Microsoft.EntityFrameworkCore.Migrations;

namespace SocketServer.Migrations
{
    public partial class PercentageRange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "MemoryPercentageUse",
                table: "ContainerRessourceUsageRecords",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "MemoryPercentageUse",
                table: "ContainerRessourceUsageRecords",
                type: "int",
                nullable: false,
                oldClrType: typeof(double));
        }
    }
}
