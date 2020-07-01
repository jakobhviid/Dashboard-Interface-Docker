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