using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SocketServer.BackgroundWorkers;
using SocketServer.ContainerModels.ContainerRequests;
using SocketServer.ContainerModels.ContainerUpdates;
using SocketServer.Helpers;

namespace SocketServer.Hubs.DockerUpdatersHub
{
    [Authorize]
    public class DockerUpdatersHub : Hub<IDockerUpdaters>
    {
        private readonly ILogger<DockerUpdatersHub> _logger;
        private readonly IInspectCommandResponseWorker _inspectCommandResponseWorker;
        public DockerUpdatersHub(ILogger<DockerUpdatersHub> logger, IInspectCommandResponseWorker inspectCommandResponseWorker)
        {
            _logger = logger;
            _inspectCommandResponseWorker = inspectCommandResponseWorker;
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

        public async void InspectContainer(string serverRequestTopic, string containerId)
        {
            Console.WriteLine("Inspect invoked!!!");
            var inspectData = new InspectData
            {
                ContainerId = containerId,
                RawData = "[\n    {\n        \"Id\": \"81575e528209155f2b84d0078cd985072bdbf851236cb00bb8fcb35d6c36b1e9\",\n        \"Created\": \"2020-11-20T17:57:38.1680442Z\",\n        \"Path\": \"docker-entrypoint.sh\",\n        \"Args\": [],\n        \"State\": {\n            \"Status\": \"running\",\n            \"Running\": true,\n            \"Paused\": false,\n            \"Restarting\": false,\n            \"OOMKilled\": false,\n            \"Dead\": false,\n            \"Pid\": 5834,\n            \"ExitCode\": 0,\n            \"Error\": \"\",\n            \"StartedAt\": \"2020-11-20T18:04:25.6527997Z\",\n            \"FinishedAt\": \"2020-11-20T18:02:44.0335837Z\"\n        },\n        \"Image\": \"sha256:ec9a4ae87d0a1133fb22479581b63756946ed4ac2951a91fc6496c7122151eb4\",\n        \"ResolvConfPath\": \"/var/lib/docker/containers/81575e528209155f2b84d0078cd985072bdbf851236cb00bb8fcb35d6c36b1e9/resolv.conf\",\n        \"HostnamePath\": \"/var/lib/docker/containers/81575e528209155f2b84d0078cd985072bdbf851236cb00bb8fcb35d6c36b1e9/hostname\",\n        \"HostsPath\": \"/var/lib/docker/containers/81575e528209155f2b84d0078cd985072bdbf851236cb00bb8fcb35d6c36b1e9/hosts\",\n        \"LogPath\": \"/var/lib/docker/containers/81575e528209155f2b84d0078cd985072bdbf851236cb00bb8fcb35d6c36b1e9/81575e528209155f2b84d0078cd985072bdbf851236cb00bb8fcb35d6c36b1e9-json.log\",\n        \"Name\": \"/interface\",\n        \"RestartCount\": 0,\n        \"Driver\": \"overlay2\",\n        \"Platform\": \"linux\",\n        \"MountLabel\": \"\",\n        \"ProcessLabel\": \"\",\n        \"AppArmorProfile\": \"\",\n        \"ExecIDs\": null,\n        \"HostConfig\": {\n            \"Binds\": [],\n            \"ContainerIDFile\": \"\",\n            \"LogConfig\": {\n                \"Type\": \"json-file\",\n                \"Config\": {}\n            },\n            \"NetworkMode\": \"singleserverguide_default\",\n            \"PortBindings\": {\n                \"5000/tcp\": [\n                    {\n                        \"HostIp\": \"\",\n                        \"HostPort\": \"5000\"\n                    }\n                ],\n                \"80/tcp\": [\n                    {\n                        \"HostIp\": \"\",\n                        \"HostPort\": \"5080\"\n                    }\n                ]\n            },\n            \"RestartPolicy\": {\n                \"Name\": \"on-failure\",\n                \"MaximumRetryCount\": 0\n            },\n            \"AutoRemove\": false,\n            \"VolumeDriver\": \"\",\n            \"VolumesFrom\": [],\n            \"CapAdd\": null,\n            \"CapDrop\": null,\n            \"Capabilities\": null,\n            \"Dns\": null,\n            \"DnsOptions\": null,\n            \"DnsSearch\": null,\n            \"ExtraHosts\": null,\n            \"GroupAdd\": null,\n            \"IpcMode\": \"private\",\n            \"Cgroup\": \"\",\n            \"Links\": null,\n            \"OomScoreAdj\": 0,\n            \"PidMode\": \"\",\n            \"Privileged\": false,\n            \"PublishAllPorts\": false,\n            \"ReadonlyRootfs\": false,\n            \"SecurityOpt\": null,\n            \"UTSMode\": \"\",\n            \"UsernsMode\": \"\",\n            \"ShmSize\": 67108864,\n            \"Runtime\": \"runc\",\n            \"ConsoleSize\": [\n                0,\n                0\n            ],\n            \"Isolation\": \"\",\n            \"CpuShares\": 0,\n            \"Memory\": 0,\n            \"NanoCpus\": 0,\n            \"CgroupParent\": \"\",\n            \"BlkioWeight\": 0,\n            \"BlkioWeightDevice\": null,\n            \"BlkioDeviceReadBps\": null,\n            \"BlkioDeviceWriteBps\": null,\n            \"BlkioDeviceReadIOps\": null,\n            \"BlkioDeviceWriteIOps\": null,\n            \"CpuPeriod\": 0,\n            \"CpuQuota\": 0,\n            \"CpuRealtimePeriod\": 0,\n            \"CpuRealtimeRuntime\": 0,\n            \"CpusetCpus\": \"\",\n            \"CpusetMems\": \"\",\n            \"Devices\": null,\n            \"DeviceCgroupRules\": null,\n            \"DeviceRequests\": null,\n            \"KernelMemory\": 0,\n            \"KernelMemoryTCP\": 0,\n            \"MemoryReservation\": 0,\n            \"MemorySwap\": 0,\n            \"MemorySwappiness\": null,\n            \"OomKillDisable\": false,\n            \"PidsLimit\": null,\n            \"Ulimits\": null,\n            \"CpuCount\": 0,\n            \"CpuPercent\": 0,\n            \"IOMaximumIOps\": 0,\n            \"IOMaximumBandwidth\": 0,\n            \"MaskedPaths\": [\n                \"/proc/asound\",\n                \"/proc/acpi\",\n                \"/proc/kcore\",\n                \"/proc/keys\",\n                \"/proc/latency_stats\",\n                \"/proc/timer_list\",\n                \"/proc/timer_stats\",\n                \"/proc/sched_debug\",\n                \"/proc/scsi\",\n                \"/sys/firmware\"\n            ],\n            \"ReadonlyPaths\": [\n                \"/proc/bus\",\n                \"/proc/fs\",\n                \"/proc/irq\",\n                \"/proc/sys\",\n                \"/proc/sysrq-trigger\"\n            ]\n        },\n        \"GraphDriver\": {\n            \"Data\": {\n                \"LowerDir\": \"/var/lib/docker/overlay2/582f520cb1062f13d3e0711044f1b028afc6a744af44b0491b84914e6ef7930c-init/diff:/var/lib/docker/overlay2/segrs8qguz1kxyxsnvqpzxfys/diff:/var/lib/docker/overlay2/ypnhyyq6k7lh5mknpxbr16wjp/diff:/var/lib/docker/overlay2/iefdf7qx8ns5lvflsr1fklq7m/diff:/var/lib/docker/overlay2/ziyg83fsrzxyxzplbt68ku8ke/diff:/var/lib/docker/overlay2/gug1imd8w14okhzitubhjmqdw/diff:/var/lib/docker/overlay2/n1xk0l28muxpwqz6eng1jzqur/diff:/var/lib/docker/overlay2/dzjwmn6ig71m6hyittwgapzeo/diff:/var/lib/docker/overlay2/qzuwhy38zgiw3ivnxyxm5dfzu/diff:/var/lib/docker/overlay2/q7u2geekp4ptpryywjy9rso4t/diff:/var/lib/docker/overlay2/nt90rnx3phi18m2fusyc3x6as/diff:/var/lib/docker/overlay2/4xoxpu3jf3l3yq9wocm2q81ev/diff:/var/lib/docker/overlay2/tw6ix50n7zxfr9a305dcjd234/diff:/var/lib/docker/overlay2/5bhuti7gfkqmmhrv62wkzof8r/diff:/var/lib/docker/overlay2/u6gkv9qimxykp7cdmq3am1wqu/diff:/var/lib/docker/overlay2/xu9895q9e44y9rmo1owemzvka/diff:/var/lib/docker/overlay2/pi90ok0fxt3f6jr1enq744eoz/diff:/var/lib/docker/overlay2/zl3yapgy0u7r819s0zwye0qu7/diff:/var/lib/docker/overlay2/mlaadorvpansi508eiko5btju/diff:/var/lib/docker/overlay2/536b70b3bfff3970f4a1baeef38764a509e6042c9df847a92cdf71d839d98339/diff:/var/lib/docker/overlay2/61d79b4155e1de134d38fe92b5f3036150b5c52e6cdcdc2d026955900f319a4a/diff:/var/lib/docker/overlay2/c2d077a1734d910c225dde34ce3cab6b8e3f16830e1d9df847189d34f3299547/diff\",\n                \"MergedDir\": \"/var/lib/docker/overlay2/582f520cb1062f13d3e0711044f1b028afc6a744af44b0491b84914e6ef7930c/merged\",\n                \"UpperDir\": \"/var/lib/docker/overlay2/582f520cb1062f13d3e0711044f1b028afc6a744af44b0491b84914e6ef7930c/diff\",\n                \"WorkDir\": \"/var/lib/docker/overlay2/582f520cb1062f13d3e0711044f1b028afc6a744af44b0491b84914e6ef7930c/work\"\n            },\n            \"Name\": \"overlay2\"\n        },\n        \"Mounts\": [],\n        \"Config\": {\n            \"Hostname\": \"81575e528209\",\n            \"Domainname\": \"\",\n            \"User\": \"\",\n            \"AttachStdin\": false,\n            \"AttachStdout\": false,\n            \"AttachStderr\": false,\n            \"ExposedPorts\": {\n                \"5000/tcp\": {},\n                \"80/tcp\": {}\n            },\n            \"Tty\": false,\n            \"OpenStdin\": false,\n            \"StdinOnce\": false,\n            \"Env\": [\n                \"DASHBOARDI_POSTGRES_CONNECTION_STRING=Host=interface-db;Port=5432;Database=interface_db;Username=dashboard;Password=Dashboard_Password1\",\n                \"DASHBOARDI_HOST_DNS=http://localhost\",\n                \"DASHBOARDI_API_KEY=dashboardtesterapikey\",\n                \"DASHBOARDI_JWT_KEY=dashboardtesterJWT\",\n                \"DASHBOARDI_INIT_USER_EMAIL=testUser@email.com\",\n                \"DASHBAORDI_INIT_PASSWORD=testUserPassword1.\",\n                \"DASHBOARDI_JWT_ISSUER=https://localhost:5000\",\n                \"DASHBOARDI_KAFKA_URL=kafkaf1:19092,kafka2:19094,kafka3:19096\",\n                \"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\",\n                \"SOCKETSERVER_HOME=/opt/socketserver\",\n                \"INTERFACE_HOME=/usr/share/nginx/html/\",\n                \"ASPNETCORE_ENVIRONMENT=Production\",\n                \"CONF_FILES=/conf\",\n                \"KEYTAB_LOCATION=/sasl/dashboardi.service.keytab\"\n            ],\n            \"Cmd\": [\n                \"docker-entrypoint.sh\"\n            ],\n            \"Image\": \"dst/interface\",\n            \"Volumes\": null,\n            \"WorkingDir\": \"/usr/share/nginx/html\",\n            \"Entrypoint\": null,\n            \"OnBuild\": null,\n            \"Labels\": {\n                \"Maintainer\": \"Oliver Marco van Komen\",\n                \"com.docker.compose.config-hash\": \"00ced436f532b05fc4ae4b72a1f8d90b91b5c11facb458035f6e3179c2fc321b\",\n                \"com.docker.compose.container-number\": \"1\",\n                \"com.docker.compose.oneoff\": \"False\",\n                \"com.docker.compose.project\": \"singleserverguide\",\n                \"com.docker.compose.project.config_files\": \"docker-compose.yml\",\n                \"com.docker.compose.project.working_dir\": \"C:\\\\Udvikling\\\\ProjectLeapNode\\\\ProjectLeapNode\\\\SingleServerGuide\",\n                \"com.docker.compose.service\": \"interface\",\n                \"com.docker.compose.version\": \"1.27.4\"\n            }\n        },\n        \"NetworkSettings\": {\n            \"Bridge\": \"\",\n            \"SandboxID\": \"4103d82a375658afea576b1cb79df9eccc6e4a58c56d2e466355ff5d6760f452\",\n            \"HairpinMode\": false,\n            \"LinkLocalIPv6Address\": \"\",\n            \"LinkLocalIPv6PrefixLen\": 0,\n            \"Ports\": {\n                \"5000/tcp\": [\n                    {\n                        \"HostIp\": \"0.0.0.0\",\n                        \"HostPort\": \"5000\"\n                    }\n                ],\n                \"80/tcp\": [\n                    {\n                        \"HostIp\": \"0.0.0.0\",\n                        \"HostPort\": \"5080\"\n                    }\n                ]\n            },\n            \"SandboxKey\": \"/var/run/docker/netns/4103d82a3756\",\n            \"SecondaryIPAddresses\": null,\n            \"SecondaryIPv6Addresses\": null,\n            \"EndpointID\": \"\",\n            \"Gateway\": \"\",\n            \"GlobalIPv6Address\": \"\",\n            \"GlobalIPv6PrefixLen\": 0,\n            \"IPAddress\": \"\",\n            \"IPPrefixLen\": 0,\n            \"IPv6Gateway\": \"\",\n            \"MacAddress\": \"\",\n            \"Networks\": {\n                \"singleserverguide_default\": {\n                    \"IPAMConfig\": null,\n                    \"Links\": null,\n                    \"Aliases\": [\n                        \"interface\",\n                        \"81575e528209\"\n                    ],\n                    \"NetworkID\": \"e1dc73a4a89d91f5cd4ff4593c2fb6bc5ac63e7be28388d1e43659779630cdc4\",\n                    \"EndpointID\": \"4100cb7a18ccf308dc0b65fdeae37d5c236568b5724044932c2daeb3831bf637\",\n                    \"Gateway\": \"172.22.0.1\",\n                    \"IPAddress\": \"172.22.0.13\",\n                    \"IPPrefixLen\": 16,\n                    \"IPv6Gateway\": \"\",\n                    \"GlobalIPv6Address\": \"\",\n                    \"GlobalIPv6PrefixLen\": 0,\n                    \"MacAddress\": \"02:42:ac:16:00:0d\",\n                    \"DriverOpts\": null\n                }\n            }\n        }\n    }\n]\n",
                Servername = "meget_lang_servernavn"
            };
            await Clients.All.SendInspectResponse(JsonConvert.SerializeObject(inspectData));
            // var inspectResponseTask = _inspectCommandResponseWorker.ExecuteAsync(containerId);
            // await KafkaHelpers.SendMessageAsync(KafkaHelpers.InspectTopic,
            //     new InspectContainerParameters {ContainerId = containerId});
            // var inspectData = await inspectResponseTask;
            // await Clients.All.SendInspectResponse(JsonConvert.SerializeObject(inspectData));
        }
    }
}
