using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAccountStatusFromPersonToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "81eb52f8-07fb-465f-9f42-994279727995");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d8e57346-bffe-4b83-bd52-c1c0b97ae920");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dc6814d9-4751-4674-8fdc-a0a7a1e9a378");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "df81c4bb-25ff-47af-9314-fcd201992565");

            migrationBuilder.DropColumn(
                name: "AccountStatus",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "AccountStatus",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "AccountStatus",
                table: "Admins");

            migrationBuilder.AddColumn<short>(
                name: "AccountStatus",
                table: "AspNetUsers",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6ab83b89-4db9-4ee1-9faf-ebe26c69fd15", null, "Admin", "ADMIN" },
                    { "6fabd1b4-5e8f-4b63-8005-a26d66eb7bb5", null, "Doctor", "DOCTOR" },
                    { "7005d4bd-e49b-4039-b5a6-4e11928281ec", null, "Patient", "PATIENT" },
                    { "cde603bb-8638-4a61-af14-05be59d95db7", null, "MainAdmin", "MainADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6ab83b89-4db9-4ee1-9faf-ebe26c69fd15");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6fabd1b4-5e8f-4b63-8005-a26d66eb7bb5");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7005d4bd-e49b-4039-b5a6-4e11928281ec");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cde603bb-8638-4a61-af14-05be59d95db7");

            migrationBuilder.DropColumn(
                name: "AccountStatus",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<short>(
                name: "AccountStatus",
                table: "Patients",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<short>(
                name: "AccountStatus",
                table: "Doctors",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<short>(
                name: "AccountStatus",
                table: "Admins",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "81eb52f8-07fb-465f-9f42-994279727995", null, "Patient", "PATIENT" },
                    { "d8e57346-bffe-4b83-bd52-c1c0b97ae920", null, "MainAdmin", "MainADMIN" },
                    { "dc6814d9-4751-4674-8fdc-a0a7a1e9a378", null, "Doctor", "DOCTOR" },
                    { "df81c4bb-25ff-47af-9314-fcd201992565", null, "Admin", "ADMIN" }
                });
        }
    }
}
