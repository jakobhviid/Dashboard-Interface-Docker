using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using SocketServer.BackgroundWorkers;
using SocketServer.Data;
using SocketServer.Data.Models;
using SocketServer.Data.Repositories;
using SocketServer.DTOs.OutputDTOs;
using SocketServer.Hubs.DockerUpdatersHub;

namespace SocketServer
{
    public class Startup
    {
        // We use a key generated on this server during startup to secure our JSON Web Tokens.
        // This means that if the app restarts, existing tokens become invalid.
        public static readonly SymmetricSecurityKey SecurityKey = new SymmetricSecurityKey(Guid.NewGuid().ToByteArray());
        private readonly IConfiguration _configuration;
        public Startup(IConfiguration configuration) => _configuration = configuration;

        public void ConfigureServices(IServiceCollection services)
        {
            // allow all cors
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    // Any origin is allowed
                    builder.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed((host) => true).AllowCredentials();
                });
            });

            services.AddControllers();

            // Custom Error return behavior
            services.Configure<ApiBehaviorOptions>(o =>
            {
                o.InvalidModelStateResponseFactory = actionContext =>
                {
                    List<string> errors = new List<string>();
                    foreach (var value in actionContext.ModelState.Values)
                    {
                        foreach (var error in value.Errors)
                        {
                            errors.Add(error.ErrorMessage);
                        }
                    }
                    if (errors.Count == 1)
                    {
                        return new BadRequestObjectResult(new GenericReturnMessageDTO
                        {
                            StatusCode = 400,
                                Message = errors[0]
                        });
                    }
                    return new BadRequestObjectResult(new GenericReturnMessageDTO
                    {
                        StatusCode = 400,
                            Message = errors
                    });
                };
            });

            // environment variables check
            var connectionString = Environment.GetEnvironmentVariable("DASHBOARDI_POSTGRES_CONNECTION_STRING");
            if (connectionString == null)
            {
                Console.WriteLine("'DASHBOARDI_POSTGRES_CONNECTION_STRING' Database Connection string not found");
                System.Environment.Exit(1);
            }
            var jwtIssuerAuthorithy = Environment.GetEnvironmentVariable("DASHBOARDI_API_DNS");
            if (jwtIssuerAuthorithy == null)
            {
                Console.WriteLine("'DASHBOARDI_API_DNS' not found");
                System.Environment.Exit(1);
            }

            services.AddDbContext<DataContext>(options => options.UseNpgsql(connectionString));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.Authority = jwtIssuerAuthorithy;
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/updates")))
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddScoped<IContainerUpdateRepo, ContainerUpdateRepo>();

            services.AddSignalR();
            services.AddHostedService<DockerUpdatersWorker>();
            services.AddHostedService<CommandServerResponseWorker>();
            services.AddSingleton<IUserIdProvider, EmailBasedUserIdProvider>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            UpdateDatabase(app);
            app.UseCors();
            app.UseRouting();

            app.UseAuthentication();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<DockerUpdatersHub>("/updates");
                endpoints.MapControllers();
            });
        }

        // Ensures an updated database to the latest migration
        private static void UpdateDatabase(IApplicationBuilder app)
        {
            using(var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                using(var context = serviceScope.ServiceProvider.GetService<DataContext>())
                {
                    context.Database.Migrate();
                }
            }
        }
    }
}
