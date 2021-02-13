#!/bin/bash

# Check to see if dotnet and nginx processes is running inside container
dotnetProcess=`ps -x | grep dotnet | grep SocketServer.dll`
nginxProcess=`ps -x | grep nginx: | grep "nginx -g daemon off"`

if ! [[ -z "$dotnetProcess" ]] && ! [[ -z "$nginxProcess" ]] # If processes are not empty
then
    # Check healtchecks by both nginx and dotnet
    dotnetCurl=`curl -I localhost:5000/diagnostics/healthcheck | grep "200 OK"`
    nginxCurl=`curl -I localhost/diagnostics/healthcheck | grep "200 OK"`
	
	# If the 
    if ! [[ -z "$dotnetCurl" ]] && ! [[ -z "$nginxCurl" ]]
    then
        echo " OK "
        exit 0
    fi
fi
# TODO - Potentially create more checks with latency and node count etc.

echo " BAD "
exit 1
