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
      DASHBOARDI_API_KEY: cfeisecurekey
      DASHBOARDI_JWT_KEY: cfeisecureJWTkey
      DASHBOARDI_API_DNS: https://<<HOST_DNS>>:5000
      DASHBOARDI_POSTGRES_CONNECTION_STRING: "Host=<<postgres_ip>>;Port=5432;Database=<<database_name>;Username=<<database_user>>;Password=<<database_password>>;"

```

# Configuration
The image consists of two parts. A graphical interface and a socket server. The socket server is also a standard http server with a single controller. This controller is for user management (JSON Web Tokens).

#### Required environment variables
  
- `DASHBOARDI_API_KEY`: The API key to use. This API Key provides access to the http server inside the image for user management. With this it's possible to create new users with access to the interface. Store it safely!
  
- `DASHBOARDI_POSTGRES_CONNECTION_STRING`: The connection string for a postgres database. The database is crucial in order to collect data for container statistics and alerts.
  
- `DASHBOARDI_JWT_KEY`: The JSON Web Token key to use. Everyone with access to this key has access to the whole application. Store it safely!

- `DASHBOARDI_API_DNS`: When writing JSON Web Tokens, this value is used as the issuing Authority. This must be a secure connection (https).

#### Optional environment variables

- `DASHBOARDI_UI_PORT`: The port on which the graphical interface will run. Default is 3000.

- `DASHBOARDI_SOCKET_SERVER_PORT`: The port on which the socket server will run. Default is 5000.

- `DASHBOARDI_KAFKA_URL`: Comma seperated list of one or more kafka urls. It will default to cfei's own kafka cluster 'kafka1.cfei.dk:9092,kafka2.cfei.dk:9092,kafka3.cfei.dk:9092'.

- `DASHBOARDI_INIT_USER_EMAIL`: Used if you want to create a user during container startup which can be used in the interface

- `DASHBAORDI_INIT_PASSWORD`: Used if you want to create a user during container startup which can be used in the interface

- `DASHBOARDI_KERBEROS_PUBLIC_URL`: Public DNS of the kerberos server to use. Required if the Kafka URL has SASL authentication.

- `DASHBOARDI_KERBEROS_REALM`: The realm to use on the kerberos server. Required if the Kafka URL has SASL authentication.

- `DASHBOARDI_KERBEROS_API_URL`: The URL to use when dashboard interface fetches its keytab from the kerberos server. The URL has to point to an HTTP POST Endpoint. The image will then supply the values of 'DASHBOARDI_KERBEROS_API_SERVICE_USERNAME' and 'DASHBOARDI_KERBEROS_API_SERVICE_PASSWORD' to the request.

- `DASHBOARDI_KERBEROS_API_SERVICE_USERNAME`: The username to use when fetching keytab on 'DASHBOARDI_KERBEROS_API_URL'.

- `DASHBOARDI_KERBEROS_API_SERVICE_PASSWORD`: The password to use when fetching keytab on 'DASHBOARDI_KERBEROS_API_URL'.

- `DASHBOARDI_BROKER_KERBEROS_SERVICE_NAME`: This should be the principal name of the service keytab the kafka broker(s) uses. So if kafka uses a keytab with a principal name of 'kafka'. This environment variable should be 'kafka'. It will default to 'kafka' if nothing is provided and kerberos is activated otherwise.

- `DASHBOARDI_KERBEROS_PRINCIPAL`: The principal that dashboard server should use from the kerberos server. Required if you want to supply your own keytab through volumes.

### Kerberos Example

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
      DASHBOARDI_API_KEY: cfeisecurekey
      DASHBOARDI_JWT_KEY: cfeisecureJWTkey
      DASHBOARDI_API_DNS: https://<<HOST_DNS>>:5000
      DASHBOARDI_POSTGRES_CONNECTION_STRING: "Host=<<postgres_ip>>;Port=5432;Database=<<database_name>;Username=<<database_user>>;Password=<<database_password>>;"
      DASHBOARDI_KERBEROS_PUBLIC_URL: <<kerberos_ip>>
      DASHBOARDI_KERBEROS_REALM: KAFKA.SECURE
      DASHBOARDI_KERBEROS_API_URL: http://<<kerberos_ip>>:6000/get-keytab
      DASHBOARDI_KERBEROS_API_SERVICE_USERNAME: dashboardinterface
      DASHBOARDI_KERBEROS_API_SERVICE_PASSWORD: dashboardInterfacePassword
```

