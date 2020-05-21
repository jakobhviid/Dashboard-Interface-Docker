using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace SocketServer.Hubs.DockerUpdatersHub
{
    public class DockerUpdatersHub : Hub<IDockerUpdaters>
    {
        private readonly ILogger<DockerUpdatersHub> _logger;
        public DockerUpdatersHub(ILogger<DockerUpdatersHub> logger)
        {
            _logger = logger;
        }

        public async void ReceiveNewestOverviewData() {
            await Clients.All.SendOverviewData("s");
        }

        public async void ReceiveNewestStatsData() {
            await Clients.All.SendStatsData("s");
        }
    }
}