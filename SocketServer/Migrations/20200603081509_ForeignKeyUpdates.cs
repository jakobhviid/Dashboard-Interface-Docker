using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SocketServer.Migrations
{
    public partial class ForeignKeyUpdates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DatabaseContainers_Servers_ServerId",
                table: "DatabaseContainers");

            migrationBuilder.DropColumn(
                name: "UpdaterContainerId",
                table: "Servers");

            migrationBuilder.AlterColumn<Guid>(
                name: "ServerId",
                table: "DatabaseContainers",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_DatabaseContainers_Servers_ServerId",
                table: "DatabaseContainers",
                column: "ServerId",
                principalTable: "Servers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DatabaseContainers_Servers_ServerId",
                table: "DatabaseContainers");

            migrationBuilder.AddColumn<Guid>(
                name: "UpdaterContainerId",
                table: "Servers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<Guid>(
                name: "ServerId",
                table: "DatabaseContainers",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DatabaseContainers_Servers_ServerId",
                table: "DatabaseContainers",
                column: "ServerId",
                principalTable: "Servers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
