using System.Threading;
using System.Threading.Tasks;
using SocketServer.ContainerModels.ContainerUpdates;

namespace SocketServer.BackgroundWorkers
{
    public interface IInspectCommandResponseWorker
    {
        public Task<InspectData> ExecuteAsync(string containerIdToListenFor, CancellationToken stoppingToken = default(CancellationToken));
    }
}