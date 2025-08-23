using BoneX.Api.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace BoneX.Api.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<Doctor> Doctors { get; set; } = null!;
    public DbSet<Patient> Patients { get; set; } = null!;
    public DbSet<Appointment> Appointments { get; set; } = null!;
    public DbSet<XrayImage> XrayImages { get; set; } = null!;
    public DbSet<DoctorReview> DoctorReviews { get; set; } = null!;
    public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; } = null!;

    public DbSet<Feedback> Feedbacks { get; set; } = null!;
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        modelBuilder.Entity<Appointment>()
            .HasIndex(a => new { a.DoctorId, a.ScheduledTime });

        modelBuilder.Entity<Appointment>()
            .HasIndex(a => new { a.PatientId, a.ScheduledTime });



        base.OnModelCreating(modelBuilder);
    }
}
