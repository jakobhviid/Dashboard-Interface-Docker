#!/bin/bash

PORT=${DASHBOARDI_SOCKET_SERVER_PORT:-5000}

dotnet "$SOCKETSERVER_HOME"/SocketServer.dll --urls=http://0.0.0.0:"$PORT"