
using Backend.Data;
using Backend.Interfaces;
using Backend.Models;
using Backend.Repository;
using Backend.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            builder.Services.AddDbContext<BonexDBContext>(option =>
            {
                option
                .UseSqlServer(builder.Configuration.GetConnectionString("main"));
            });

            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                // Enforce unique emails
                options.User.RequireUniqueEmail = true;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10); // Lockout period after max failed attempts
                options.Lockout.MaxFailedAccessAttempts = 5; // Max failed attempts before lockout
                options.Lockout.AllowedForNewUsers = true; // Apply lockout for new users as well
            }).AddEntityFrameworkStores<BonexDBContext>()
               .AddDefaultTokenProviders();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })  .AddJwtBearer(options =>
            {
                ///////////////////////
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        // Get token from cookies instead of Authorization header
                        var token = context.Request.Cookies["AuthToken"];

                        if (!string.IsNullOrEmpty(token))
                        {
                            context.Token = token;
                        }

                        return Task.CompletedTask;
                    }
                };
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero, // Optional: Remove delay of expiration check
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            //  ----------------------------

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("MyPolicy", policy =>
                {
                    // allow any domain , allow using any method , allow using any thing in heasder , allow sending cookies
                    //AllowAnyOrigin()
                    //
                    policy.WithOrigins("http://localhost:3000", "https://localhost:7294/swagger").AllowAnyMethod().AllowAnyHeader().AllowCredentials();   
                });
            });

            builder.Services.AddScoped<ITokenService, TokenService>();
            builder.Services.AddScoped<IPatientRepository, BonexPatientRepository>();
            builder.Services.AddScoped<IDoctorRepository, BonexDoctorRepository>();
            builder.Services.AddScoped<IAdminRepository, BonexAdminRepository>();


            /*-----------------------------Swagger PArt-----------------------------*/
            #region Swagger REgion
            //builder.Services.AddSwaggerGen();

            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

                // Add a security definition for cookies
                options.AddSecurityDefinition("AuthToken", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.ApiKey,
                    Name = "Cookie",
                    In = ParameterLocation.Cookie,
                    Description = "Cookie used for authentication"
                });

                // Ensure to apply security to all endpoints
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "AuthToken" // Must match the name in AddSecurityDefinition
                            }
                        },
                        new string[] {}}
                });
            });

            #endregion
            //----------------------------------------------------------
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();
  
            app.UseCors("MyPolicy");
          
            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
