using AddressBook.Application.Interfaces;
using AddressBook.Application.Mapping;
using AddressBook.Application.Services;
using AddressBook.Domain.Entities;
using AddressBook.Domain.Interfaces;
using AddressBook.Infrastructure.Data;
using AddressBook.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace AddressBook.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            #region Database
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly("AddressBook.API")
                )
            );
            #endregion

            #region AutoMapper
            builder.Services.AddAutoMapper(typeof(AppMappingProfile));
            #endregion

            #region Repositories & UnitOfWork
            builder.Services.AddScoped<IRepository<Contact>, Repository<Contact>>();
            builder.Services.AddScoped<IRepository<JobTitle>, Repository<JobTitle>>();
            builder.Services.AddScoped<IRepository<Department>, Repository<Department>>();
            builder.Services.AddScoped<IRepository<User>, Repository<User>>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            #endregion

            #region IWebHostEnvironment
            builder.Services.AddSingleton<IWebHostEnvironment>(builder.Environment);
            builder.Services.AddSingleton(provider =>
            {
                var env = provider.GetRequiredService<IWebHostEnvironment>();
                return env.WebRootPath;
            });
            #endregion

            #region Application Services
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IContactService, ContactService>();
            builder.Services.AddScoped<IDepartmentService, DepartmentService>();
            builder.Services.AddScoped<IJobTitleService, JobTitleService>();
            #endregion

            #region JWT Authentication
            var key = builder.Configuration["Jwt:Key"];

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                };
            });
            #endregion

            #region CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngular", policy =>
                {
                    policy
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
            #endregion

            #region Controllers + Swagger
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler =
                        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Enter token like: Bearer {your token}",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Id = "Bearer",
                                Type = ReferenceType.SecurityScheme
                            }
                        },
                        new string[]{}
                    }
                });
            });
            #endregion

            #region Build App
            var app = builder.Build();
            #endregion

            #region Logging
            app.Use(async (context, next) =>
            {
                try
                {
                    await next();
                }
                catch (Exception ex)
                {
                    var logFolder = Path.Combine(app.Environment.WebRootPath, "logs");
                    Directory.CreateDirectory(logFolder);

                    var logPath = Path.Combine(logFolder, "error-log.txt");
                    await File.AppendAllTextAsync(logPath, $"{DateTime.Now}\n{ex}\n\n");

                    throw;
                }
            });
            #endregion

            #region Swagger
            app.UseSwagger();
            app.UseSwaggerUI();
            #endregion

            #region Angular Static Files
            app.UseDefaultFiles();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            #endregion

            #region Uploads Static Folder

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                Path.Combine(builder.Environment.WebRootPath, "uploads")
                ),
                RequestPath = "/uploads"
            });
            #endregion

            #region Middlewares
            app.UseCors("AllowAngular");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            #endregion

            #region Angular Fallback Route (SPA)
            app.MapFallbackToFile("index.html");
            #endregion

            #region Run App
            app.Run();
            #endregion
        }
    }
}
