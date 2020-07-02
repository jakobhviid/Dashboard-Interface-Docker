#!/bin/bash

# Exit if any command has a non-zero exit status (Exists if a command returns an exception, like it's a programming language)
# Prevents errors in a pipeline from being hidden. So if any command fails, that return code will be used as the return code of the whole pipeline
set -eo pipefail

supervisorctl start socketserver
supervisorctl start ui

if [[ -z "$DASHBOARDI_INIT_USER_EMAIL" ]]; then
    echo "INFO - 'DASHBOARDI_INIT_USER_EMAIL' has not been provided."
else
    if [[ -z "$DASHBAORDI_INIT_PASSWORD" ]]; then
        echo -e "\e[1;32mERROR - 'DASHBAORDI_INIT_PASSWORD' has not been provided \e[0m"
        exit 1
    fi
    echo "INFO - 'DASHBOARDI_INIT_USER_EMAIL' and 'DASHBAORDI_INIT_PASSWORD' provided. Creating initial user ..."

    sleep 5 # give the socketserver a chance to start up

    response=$(curl --fail --max-time 5 -X POST -H "Content-Type: application/json" -d "{\"apiKey\":\""$DASHBOARDI_API_KEY"\", \"newUserEmail\":\""$DASHBOARDI_INIT_USER_EMAIL"\", \"newUserPassword\":\""$DASHBAORDI_INIT_PASSWORD"\"}" "http://127.0.0.1:"$DASHBOARDI_SOCKET_SERVER_PORT"/account/register")
    if [ "$response" == "FAIL" ]; then
        echo -e "\e[1;32mERROR - Creating initial user did not succeed. See curl error above for further details \e[0m"
        exit 1
    fi
fi
