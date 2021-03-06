using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SocketServer.ContainerModels.ContainerRequests;
using SocketServer.Helpers;

namespace SocketServer.Hubs.DockerUpdatersHub
{
    [Authorize]
    public class DockerUpdatersHub : Hub<IDockerUpdaters>
    {
        private readonly ILogger<DockerUpdatersHub> _logger;

        public DockerUpdatersHub(ILogger<DockerUpdatersHub> logger)
        {
            _logger = logger;
        }

        public async void ReceiveNewestOverviewData()
        {
            await Clients.All.SendOverviewData(KafkaHelpers.LatestOverviewInfo);
        }

        public async void ReceiveNewestStatsData()
        {
            await Clients.All.SendStatsData(KafkaHelpers.LatestStatsInfo);
        }

        public async void RenameContainer(string serverRequestTopic, string containerId, string newContainerName)
        {
            await KafkaHelpers.SendMessageAsync(serverRequestTopic,
                new RenameContainerParameter { ContainerId = containerId, NewName = newContainerName });
        }
        public async void StartContainer(string serverRequestTopic, string containerId)
        {
            await KafkaHelpers.SendMessageAsync(serverRequestTopic,
                new StartContainerParameters { ContainerId = containerId });
        }
        public async void StopContainer(string serverRequestTopic, string containerId)
        {
            await KafkaHelpers.SendMessageAsync(serverRequestTopic,
                new StopContainerParameters { ContainerId = containerId });
        }
        public async void RestartContainer(string serverRequestTopic, string containerId)
        {
            await KafkaHelpers.SendMessageAsync(serverRequestTopic,
                new RestartContainerParameters { ContainerId = containerId });
        }
        public async void RemoveContainer(string serverRequestTopic, string containerId, bool removeVolumes)
        {
            await KafkaHelpers.SendMessageAsync(serverRequestTopic,
                new RemoveContainerParameters { ContainerId = containerId, RemoveVolumes = removeVolumes });
        }
        public async void CreateNewContainer(string serverRequestTopic, string parametersSerialized)
        {
            try
            {
                // Check that all parameters is present and is correct by deserializing
                if (parametersSerialized == null)// TODO: client error
                    return;
                
                var parameters = JsonConvert.DeserializeObject<RunNewContainerParameters>(parametersSerialized);
                parameters.Action = ContainerActionType.RUN_NEW;
                await KafkaHelpers.SendMessageAsync(serverRequestTopic, parameters);
            }
            catch (Newtonsoft.Json.JsonException ex)
            {
                Console.WriteLine(parametersSerialized);
                Console.WriteLine("ERROR! : " + ex.Message);
                // TODO: client error
            }
        }
        public async void UpdateContainerConfiguration(string serverRequestTopic, string containerId)
        {
            await KafkaHelpers.SendMessageAsync(serverRequestTopic,
                new UpdateConfigContainerParameters { ContainerId = containerId, }); // TODO:
        }
        public async void RefetchOverviewData(string serverRequestTopic)
        {
            await KafkaHelpers.SendMessageAsync(serverRequestTopic, new ContainerRequest
            {
                Action = ContainerActionType.REFETCH_OVERVIEW
            });
        }
        public async void RefetchStatsData(string serverRequestTopic)
        {
            await KafkaHelpers.SendMessageAsync(serverRequestTopic, new ContainerRequest
            {
                Action = ContainerActionType.REFETCH_STATS
            });
        }

        public async void InspectContainerRequest(string serverRequestTopic, string containerId)
        {
            await KafkaHelpers.SendMessageAsync(serverRequestTopic,
                new InspectContainerParameters {ContainerId = containerId});
        }
    }
}
