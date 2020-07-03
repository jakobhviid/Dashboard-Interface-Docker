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
      DASHBOARDI_API_DNS: https://<<HOST_DNS>>:5000
      DASHBOARDI_POSTGRES_CONNECTION_STRING: "Host=<<postgres_ip>>;Port=5432;Database=<<database_name>;Username=<<database_user>>;Password=<<database_password>>;"

```

# Configuration
The image consists of two parts. A graphical interface and a socket server. The socket server is also a standard http server with a single controller. This controller is for user management (JSON Web Tokens).

#### Required environment variables
- `DASHBOARDI_UI_PORT`: The port on which the graphical interface will run.
- `DASHBOARDI_SOCKET_SERVER_PORT`: The port on which the socket server will run.
- `DASHBOARDI_API_KEY`: The API key to use. This API Key provides access to the http server inside the image for user management. With this it's possible to create new users with access to the interface. Store it safely!
- `DASHBOARDI_POSTGRES_CONNECTION_STRING`: The connection string for a postgres database. The database is crucial in order to collect data for container statistics and alerts.
- `DASHBOARDI_API_DNS`: When writing JSON Web Tokens, this value is used as the issuing Authority. This must be a secure connection (https).
#### Optional environment variables
- `DASHBOARDI_KAFKA_URL`: Comma seperated list of one or more kafka urls. It will default to cfei's own kafka cluster 'kafka1.cfei.dk:9092,kafka2.cfei.dk:9092,kafka3.cfei.dk:9092'.
- `DASHBOARDI_INIT_USER_EMAIL`: Used if you want to create a user during container startup which can be used in the interface
- `DASHBAORDI_INIT_PASSWORD`: Used if you want to create a user during container startup which can be used in the interface


# CFEI Kafka / Zookeper stack guide
The stack consists of multiple elements, which combined creates a robust kafka & zookeeper cluster alongside a user friendly admin tool to manage the clusters. This includes both cluster health & notifications but most importantly it has the ability to grant/limit access to the cluster.

In this guide two different approaches are described. The first is the recommended approach where you at minimum have 4 servers. Where you afterwards are able to extend the zookeeper & kafka cluster by adding more servers.

The other approach is if you only have a single server. It is not recommended, but can be great in development situations.

## Step by step multiple servers (recommended)
For the following steps you need to have access to minimum 4 servers ('server1', 'server2', 'server3', 'server4') which all pass requirements described in [server setup](#server-setup).

#### Step 1:
On **server1** we install Dashboard-Interface alongside a postgres database
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
      - 3001:3001
      - 5000:5000
    environment:
      DASHBOARDI_UI_PORT: 3001
      DASHBOARDI_SOCKET_SERVER_PORT: 5000
      DASHBOARDI_POSTGRES_CONNECTION_STRING: "Host=interface-database;Port=5432;Database=interface_db;Username=interface;Password=Interface_database_password1"
      DASHBOARDI_API_KEY: secureapiKey
      DASHBOARDI_API_DNS: https://<<SERVER1_DNS>>:5000
      DASHBOARDI_INIT_USER_EMAIL: testUser@email.com
      DASHBAORDI_INIT_PASSWORD: testUserPassword%1.
    depends_on: 
      - interface-database

```

Now change 'POSTGRES_USER' and 'POSTGRES_PASSWORD' alongside 'DASHBOARDI_POSTGRES_CONNECTION_STRING' to fit accordingly.

Now run the following command in the same directory you created the docker-compose file: `docker-compose up`. Check that the output doesn't contain errors.

Try to visit the DNS-resolvable ip of Server1 on port 3001 from a webbrowser.

In the upper right corner, login with testUser@email.com and password: testUserPassword%1.

TODO: Create images of the relevant pictures of the Dashboard-Interface and put them inside a folder in github repo. in the bottom of this file you should then put references to the pictures

After login, you should see this:

![interface homepage][interface-homepage]



#### Step 2
On server2, server3 and server4 we install the Dashboard-Server in order to remotely install services.

Create a docker-compose file on all three servers with the following contents:
```
version: "3"

services:
  server:
    image: cfei/docker-dashboard-server
    container_name: dashboard-server
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      SERVER_NAME: <<SERVERNAME>>
```
Change 'SERVER_NAME' accordingly (server2, server3, server4)

Now run the following command in the same directory you created the docker-compose file: `docker-compose up`. Check that the output doesn't contain errors.

#### Step 3

TODO:
Now go to the dashboard interface
PICTURE - CREATE NEW CONTAINER
SELECT Server2
USE database template
CHANGE ENVIRONMENT VARIABLES ACCORDINGLY
RUN CONTAINER, WAIT FOR SUCCESS MESSAGES
CHECK OVERVIEW TO ENSURE IT WORKS

CREATE NEW CONTAINER
SELECT SERVER2
USE kerberos template
CHANGE ENVIRONMENT VARIABLES ACCORDINGLY
RUN CONTAINER, WAIT FOR SUCCESS MESSAGES
CHECK OVERVIEW TO ENSURE IT WORKS

CREATE NEW CONTAINER
SELECT Server3
USE ZOOKEEPER template
CHANGE ENVIRONMENT VARIABLES ACCORDINGLY
RUN CONTAINER, WAIT FOR SUCCESS MESSAGES
CHECK OVERVIEW TO ENSURE IT WORKS

CREATE NEW CONTAINER
SELECT Server3
USE kafka template
CHANGE ENVIRONMENT VARIABLES ACCORDINGLY
RUN CONTAINER, WAIT FOR SUCCESS MESSAGES
CHECK OVERVIEW TO ENSURE IT WORKS

CREATE NEW CONTAINER
SELECT server4
USE ACL-Security-Manager template
CHANGE ENVIRONMENT VARIABLES ACCORDINGLY
RUN CONTAINER, WAIT FOR SUCCESS MESSAGES
CHECK OVERVIEW TO ENSURE IT WORKS

## Step by step one server
For this setup you run the whole stack on a single server. It is not recommended for obvious reasons, but can be good for development setups.
This server is refered to as 'SingleServer'. Make sure this server passes the requirements described in [server setup](#server-setup).
In order to make this viable in a production setup you need to seperate services onto other hosts. Each host should then have Dashboard-Server installed alongside the service.
E.g. Create a Kerberos server which installs Dashboard-Server, Kerberos, then onto another host install a Postgres Database for Kerberos.

#### Step 1:
Create a docker-compose file with the following contents:
```
version: "3"

services:    
  kerberos-db:
    image: postgres
    environment:
      POSTGRES_USER: kerberos
      POSTGRES_PASSWORD: Kerberos_Password1
      POSTGRES_DB: kerberos_db
    networks:
      - back

  kerberos:
    image: cfei/docker-kerberos
    ports:
      - 6000:6000
    environment:
      KERBEROS_ADMIN_PW: password
      KERBEROS_HOST_DNS: kerberos
      KERBEROS_REALM: CFEI.SECURE
      KERBEROS_API_PORT: 6000
      KERBEROS_POSTGRES_CONNECTION_STRING: "Host=kerberos-db;Port=5432;Database=kerberos_db;Username=kerberos;Password=Kerberos_Password1;"
    depends_on:
      - kerberos-db
    networks:
      - front
      - back
  
  zookeeper: # INFO - Zookeeper is dependant upon kerberos making a keytab for it first. Should kerberos support this or should it all just happen via the dashboard interface?
    image: cfei/zookeeper:2.0.0-beta
    environment:
      ZOO_ID: 1
      ZOO_PORT: 2181
      ZOO_AUTHENTICATION: KERBEROS
      ZOO_KERBEROS_PUBLIC_URL: kerberos
      ZOO_KERBEROS_API_URL: "http://kerberos:3000/get-keytab"
      ZOO_KERBEROS_API_USERNAME: zookeeper/161.35.145.163
      ZOO_KERBEROS_API_PASSWORD: zookeeperPassword
      ZOO_KERBEROS_REALM: CFEI.SECURE
      ZOO_REMOVE_HOST_AND_REALM: "true"
    networks: 
      - back

  dashboard-server:
    image: omvk97/docker-dashboard-server
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      SERVER_NAME: SingleServer
    networks:
      - back

  interface-db:
    image: postgres
    environment:
      POSTGRES_USER: interface
      POSTGRES_PASSWORD: Interface_database_password1
      POSTGRES_DB: interface_db
    networks:
      - front
      - back

  interface:
    image: omvk97/docker-dashboard-interface
    ports:
      - 3001:3001
      - 5000:5000
    environment:
      DASHBOARDI_UI_PORT: 3001
      DASHBOARDI_SOCKET_SERVER_PORT: 5000
      DASHBOARDI_POSTGRES_CONNECTION_STRING: "Host=interface-database;Port=5432;Database=interface_db;Username=interface;Password=Interface_database_password1"
      DASHBOARDI_API_KEY: secureapiKey
      DASHBOARDI_INIT_USER_EMAIL: testUser@email.com
      DASHBAORDI_INIT_PASSWORD: testUserPassword%1.
    depends_on:
      - interface-db
      - dashboard-server
    networks:
      - back

networks:
  front:
    driver: bridge
  back:
    driver: bridge


```


## <a name="server-setup"/></a> Server Setup
- All servers needs to run a linux OS.
- All servers should have docker and docker-compose installed. (**ubuntu**: `sudo apt update && sudo apt install -y docker.io docker-compose`)

#### Server Requirements

**Definitions**
- Network ports refers to necessary open ports which is used for internal communication between all the servers. 
- Public ports refers to DNS-resolvable ports which are used for user connections. Many of the public ports can be changed depending on your docker container setup. For example Dashboard-Interface 3000 & 5000 is an example.
- In addition, all servers should preferably be on a closed network with minimal open ports to the outside.

| Name         |  CPU  |  RAM  | Storage | Network Ports |      Public Ports      |
| ------------ | :---: | :---: | :-----: | :-----------: | :--------------------: |
| Server1      |   4   |  6GB  |  100GB  |       -       |       3000, 5000       |
| Server2      |   2   |  4GB  |  45GB   |       -       |       3000, 5000       |
| Server3      |   4   |  6GB  |  100GB  |       -       |       3000, 5000       |
| Server4      |   4   |  8GB  |  100GB  |       -       |       3000, 5000       |
| SingleServer |   6   | 12GB  |  250GB  |       -       | 2181, 9092, 3000, 5000 |

#### Individual Service Requirements
| Name                         |  CPU  |  RAM  | Storage |  Network Ports   | Public Ports |
| ---------------------------- | :---: | :---: | :-----: | :--------------: | :----------: |
| Dashboard-Interface          |   2   |  2GB  |   5GB   |        -         |  3000, 5000  |
| Dashboard-Interface Database |   4   |  4GB  |  100GB  |        -         |      -       |
| Dashboard-Server             |   1   |  1GB  |   5GB   |        -         |      -       |
| Kerberos                     |   1   |  1GB  |   5GB   | 88 TCP/UDP, 6000 |      -       |
| Kerberos Database            |   2   |  2GB  |  40GB   |        -         |      -       |
| Zookeeper                    |   1   |  2GB  |  80GB   |    2888, 3888    |     2181     |
| ACL-Security-Manager         |   2   |  2GB  |  20GB   |       9000       |      -       |
| Kafka                        |   4   |  8GB  |  100GB  |       9093       |     9092     |

[interface-homepage]: https://unsplash.com/photos/5Oe8KFH5998/download "Interface Homepage"
