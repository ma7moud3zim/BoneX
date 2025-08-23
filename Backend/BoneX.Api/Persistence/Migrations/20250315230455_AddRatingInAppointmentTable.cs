using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoneX.Api.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddRatingInAppointmentTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Appointments",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Appointments");
        }
    }
}
