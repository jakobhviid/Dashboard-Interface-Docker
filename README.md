# About
This image acts as the control center of the CFEI kafka / zookeeper stack. It is a graphic interface providing multiple features.

These features are:
* Real time container updates from [Docker-Dashboard-Server](https://github.com/jakobhviid/Dashboard-Server-Docker)
* Docker management (docker actions on remote servers, E.g. start/stop container, list containers etc. ). These actions are sent to [Docker-Dashboard-Server](https://github.com/jakobhviid/Dashboard-Server-Docker) on each individual server.
* [CFEI Kerberos](https://github.com/jakobhviid/Kerberos-Server-Docker) integration.
* Kafka / Zookeeper ACL management.
* Server & Container health statistics (implementation underway)
* Server & container health alerts (not implemented yet).
* Server mangement (not implemented yet).

# How to use
This docker-compose file shows the deployment of the dashboard-interface container.

```
version: "3"

services:
  interface:
    image: cfei/dashboard-interface
    container_name: dashboard-interface
    ports:
      - 3000:3000
      - 5000:5000
    environment: 
      DASHBOARDI_UI_PORT: 3000
      DASHBOARDI_SOCKET_SERVER_PORT: 5000
      DASHBOARDI_API_KEY: cfeisecurekey
      DASHBOARDI_POSTGRES_CONNECTION_STRING: "Host=<<postgres_ip>>;Port=5432;Database=<<database_name>;Username=<<database_user>>;Password=<<database_password>>;"

```

# Configuration
The image consists of two parts. A graphical interface and a socket server. The socket server is also a standard http server with a single controller. This controller is for user management (JSON Web Tokens).

#### Required environment variables
- `DASHBOARDI_UI_PORT`: The port on which the graphical interface will run.
- `DASHBOARDI_SOCKET_SERVER_PORT`: The port on which the socket server will run.
- `DASHBOARDI_API_KEY`: The API key to use. This API Key provides access to the http server inside the image for user management. With this it's possible to create new users with access to the interface. Store it safely.
- `DASHBOARDI_POSTGRES_CONNECTION_STRING`: The connection string for a postgres database. The database is crucial in order to collect data for container statistics and alerts.
#### Optional environment variables
- `DASHBOARDI_KAFKA_URL`: Comma seperated list of one or more kafka urls. It will default to cfei's own kafka cluster 'kafka1.cfei.dk:9092,kafka2.cfei.dk:9092,kafka3.cfei.dk:9092'.

# CFEI Kafka / Zookeper stack guide
The stack consists of multiple elements, which combined creates a robust kafka & zookeeper cluster alongside a user friendly admin tool to manage the clusters. This includes both cluster health & notifications but most importantly it has the ability to grant/limit access to the cluster.

## Step by step multiple servers (recommended)
For the following steps you need to have access to minimum 4 servers ('server1', 'server2', 'server3', 'server4') which all pass requirements described in [server setup](#server-setup).

#### Server1:
On this server we will install Dashboard-Interface alongside a postgres database
Create a docker-compose file with the following contents:
```
version: "3"

services:
  interface-database:
    image: postgres
    container_name: interface-database
    restart: always
    environment:
      POSTGRES_USER: interface
      POSTGRES_PASSWORD: Interface_database_password1
      POSTGRES_DB: interface_db

  interface:
    image: omvk97/docker-dashboard-interface
    container_name: interface
    ports:
      - 3000:3000
      - 5000:5000
    environment: 
      DASHBOARDI_UI_PORT: 3000
      DASHBOARDI_SOCKET_SERVER_PORT: 5000
      DASHBOARDI_POSTGRES_CONNECTION_STRING: "Host=interface-database;Port=5432;Database=interface_db;Username=interface;Password=Interface_database_password1"
      DASHBOARDI_API_KEY: test
    depends_on: 
      - interface-database

```

Now change 'POSTGRES_USER' and 'POSTGRES_PASSWORD' alongside 'DASHBOARDI_POSTGRES_CONNECTION_STRING' to fit accordingly.

#### Server2 Dashboard-Server + Kerberos + Kerberos Database
On this server we will install the Dashboard-Server in order to remotely install Kerberos alongside a postgres database.

Visit the DNS-resolvable ip of Server1 on port 3000.

TODO: Create images of the relevant pictures of the Dashboard-Interface and put them inside a folder in github repo. in the bottom of this file you should then put references to the pictures
You should see this:

![interface homepage][interface-homepage]

**Server3**: Dashbaord-Server + Zookeeper + Kafka
**Server4**: Dashbaord-Server + ACL-Security-Manager

## Step by step one server
For this setup you run the whole stack on a single server. It is not recommended for obvious reasons, but can be good for development setups.
This server is refered to as 'SingleServer'. Make sure this server pass the requirements described in [server setup](#server-setup).


## <a name="server-setup"/></a> Server Setup
- All servers needs to run a linux OS.
- All servers should have docker and docker-compose installed. (**ubuntu**: `sudo apt update && sudo apt install -y docker.io docker-compose`)

### Server Requirements
| Name                              |CPU| RAM |Storage|Network Ports      |Public Ports |
| --------------------------------- |:-:| :-: | :---: | :---------------: | :---------: |
| Server1                           | 4 | 6GB | 100GB | -                 | 3000, 5000  |
| Server2                           | 2 | 4GB | 45GB  | -                 | 3000, 5000  |
| Server3                           | 4 | 6GB | 100GB | -                 | 3000, 5000  |
| Server4                           | 4 | 8GB | 100GB | -                 | 3000, 5000  |
| SingleServer                      | 6 | 12GB| 250GB | -                 | 2181, 9092, 3000, 5000 |

### Individual Requirements
| Name                              |CPU| RAM |Storage|Network Ports      |Public Ports |
| --------------------------------- |:-:| :-: | :---: | :---------------: | :---------: |
| Dashboard-Interface               | 2 | 2GB | 5GB   | -                 | 3000, 5000  |
| Dashboard-Interface Database      | 4 | 4GB | 100GB | -                 | -           |
| Dashboard-Server                  | 1 | 1GB | 5GB   | -                 | -           |
| Kerberos                          | 1 | 1GB | 5GB   | 88 TCP/UDP, 6000  | -           |
| Kerberos Database                 | 2 | 2GB | 40GB  | -                 | -           |
| Zookeeper                         | 1 | 2GB | 80GB  | 2888, 3888        | 2181        |
| ACL-Security-Manager              | 2 | 2GB | 20GB  | 9000              | -           |
| Kafka                             | 4 | 8GB | 100GB | 9093              | 9092        |

**NOTE**
Network ports refers to necessary open ports which is used for internal communication between all the servers. 
Public ports refers to DNS-resolvable ports which are used for user connections. Many of the public ports can be changed depending on your docker container setup. For example Dashboard-Interface 3000 & 5000 is an example.
In addition, all servers should preferably be on a closed network with minimal open ports to the outside.

TODO:

[interface-homepage]: https://unsplash.com/photos/5Oe8KFH5998/download "Interface Homepage"
