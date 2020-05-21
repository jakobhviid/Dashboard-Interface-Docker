using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SocketServer.BackgroundWorkers;
using SocketServer.Data;
using SocketServer.Data.Repositories;
using SocketServer.Hubs.DockerUpdatersHub;

namespace SocketServer
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            // adding Database
            var connectionString = Environment.GetEnvironmentVariable("DI_MSSQL_CONNECTION_STRING");
            services.AddDbContext<DataContext>(options => options.UseSqlServer(connectionString));
            services.AddScoped<IContainerUpdateRepo, ContainerUpdateRepo>();

            services.AddSignalR();
            services.AddHostedService<DockerUpdatersWorker>();
            services.AddCors();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            UpdateDatabase(app);
            app.UseRouting();

            app.UseCors(x => x.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowCredentials());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<DockerUpdatersHub>("/updates");
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
