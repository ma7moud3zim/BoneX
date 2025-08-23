using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoneX.Api.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class addActiveForUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "active",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "active",
                table: "AspNetUsers");
        }
    }
}
