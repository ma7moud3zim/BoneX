using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoneX.Api.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAppointmentsSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentFeedbacks");

            migrationBuilder.DropTable(
                name: "AppointmentFollowUp");

            migrationBuilder.DropColumn(
                name: "CompletedAt",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "DiagnosisNotes",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "HasFollowUp",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "IsFeedbackRequested",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "IsPatientReminded",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "LastUpdatedAt",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "RescheduledTime",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "TreatmentPlan",
                table: "Appointments",
                newName: "MeetingLink");

            migrationBuilder.RenameColumn(
                name: "Prescription",
                table: "Appointments",
                newName: "Feedback");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Appointments",
                newName: "EndTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MeetingLink",
                table: "Appointments",
                newName: "TreatmentPlan");

            migrationBuilder.RenameColumn(
                name: "Feedback",
                table: "Appointments",
                newName: "Prescription");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "Appointments",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedAt",
                table: "Appointments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DiagnosisNotes",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasFollowUp",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeedbackRequested",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPatientReminded",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdatedAt",
                table: "Appointments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RescheduledTime",
                table: "Appointments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppointmentFeedbacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
                    Comments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentFeedbacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentFeedbacks_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppointmentFollowUp",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
                    FollowUpDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentFollowUp", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentFollowUp_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentFeedbacks_AppointmentId",
                table: "AppointmentFeedbacks",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentFollowUp_AppointmentId",
                table: "AppointmentFollowUp",
                column: "AppointmentId");
        }
    }
}
