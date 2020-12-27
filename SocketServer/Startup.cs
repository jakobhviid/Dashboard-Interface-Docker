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
using Microsoft.Extensions.Logging;
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
        public static readonly SymmetricSecurityKey SecurityKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("DASHBOARDI_JWT_KEY")));
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

            Console.ForegroundColor = ConsoleColor.Red;
            // environment variables check
            var connectionString = Environment.GetEnvironmentVariable("DASHBOARDI_POSTGRES_CONNECTION_STRING");
            if (connectionString == null)
            {
                Console.WriteLine("'DASHBOARDI_POSTGRES_CONNECTION_STRING' Database Connection string not found");
                System.Environment.Exit(1);
            }

            var jwtIssuerAuthorithy = Environment.GetEnvironmentVariable("DASHBOARDI_JWT_ISSUER");
            if (jwtIssuerAuthorithy == null)
            {
                Console.WriteLine("'DASHBOARDI_JWT_ISSUER' not found");
                System.Environment.Exit(1);
            }

            var jwtKey = Environment.GetEnvironmentVariable("DASHBOARDI_JWT_KEY");
            if (jwtKey == null)
            {
                Console.WriteLine("'DASHBOARDI_JWT_KEY' not found");
                System.Environment.Exit(1);
            }
            else
            {
                if (jwtKey.Length < 16)
                {

                    Console.WriteLine("'DASHBOARDI_JWT_KEY' must be atleast 16 characters long");
                    System.Environment.Exit(1);
                }
            }
            Console.ResetColor();
            services.AddDbContext<DataContext>(options =>
            {
                options.UseNpgsql(connectionString, options => options.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorCodesToAdd: null
                ));

            });

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication(options =>
                {
                    // Use Jwt by default (makes authorization work)
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = SecurityKey,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = jwtIssuerAuthorithy,
                    ValidAudience = jwtIssuerAuthorithy
                    };
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

            // database repos injection
            services.AddScoped<IContainerUpdateRepo, ContainerUpdateRepo>();

            services.AddSignalR();

            // constant working threads
            services.AddHostedService<DockerUpdatersWorker>();
            services.AddHostedService<CommandServerResponseWorker>();

            // users are identified by their email
            services.AddSingleton<IUserIdProvider, EmailBasedUserIdProvider>();
        }

        public async void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            await UpdateDatabase(app, logger);
            app.UseCors();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<DockerUpdatersHub>("/updates");
                endpoints.MapControllers();
            });
        }

        // Ensures an updated database to the latest migration
        private async Task UpdateDatabase(IApplicationBuilder app, ILogger<Startup> logger)
        {
            using(var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                using(var context = serviceScope.ServiceProvider.GetService<DataContext>())
                {
                    // Npgsql resiliency strategy does not work with Database.EnsureCreated() and Database.Migrate().
                    // Therefore a retry pattern is implemented for this purpose 
                    // if database connection is not ready it will retry 3 times before finally quiting
                    var retryCount = 3;
                    var currentRetry = 0;
                    while (true)
                    {
                        try
                        {
                            logger.LogInformation("Attempting database migration");

                            context.Database.Migrate();
                            
                            logger.LogInformation("Database migration & connection successful");

                            break; // just break if migration is successful
                        }
                        catch (Npgsql.NpgsqlException)
                        {
                            logger.LogError("Database migration failed. Retrying in 5 seconds ...");

                            currentRetry++;

                            if (currentRetry == retryCount) // Here it is possible to check the type of exception if needed with an OR. And exit if it's a specific exception.
                            {
                                // We have tried as many times as retryCount specifies. Now we throw it and exit the application
                                logger.LogCritical($"Database migration failed after {retryCount} retries");
                                throw;
                            }

                        }
                        // Waiting 5 seconds before trying again
                        await Task.Delay(TimeSpan.FromSeconds(5));
                    }

                }
            }
        }
    }
}
