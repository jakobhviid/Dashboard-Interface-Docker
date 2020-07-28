#!/bin/bash

if [[ -z "$DASHBOARDI_INIT_USER_EMAIL" ]]; then
    echo "INFO - 'DASHBOARDI_INIT_USER_EMAIL' has not been provided."
else
    if [[ -z "$DASHBAORDI_INIT_PASSWORD" ]]; then
        echo -e "\e[1;31mERROR - 'DASHBAORDI_INIT_PASSWORD' has not been provided \e[0m"
        exit 1
    fi

    echo "INFO - 'DASHBOARDI_INIT_USER_EMAIL' and 'DASHBAORDI_INIT_PASSWORD' provided. Creating initial user ..."

    PORT=${DASHBOARDI_SOCKET_SERVER_PORT:-5000}
    
    counter=0
    while [ -z "$(netstat -tln | grep "$PORT")" ]; do # Listen on localhost open ports and greps PORT
        if [ "$counter" -eq 15 ]; then                # 15 seconds have passed
            echo -e "\e[1;32mERROR - Creating initial user did not succeed. API did not start \e[0m"
            exit 1
        else
            echo "Waiting for API to start ..."
            sleep 1
            ((counter++))
        fi
    done
    echo "API has started"

    response=$(curl --fail --max-time 5 -X POST -H "Content-Type: application/json" -d "{\"apiKey\":\""$DASHBOARDI_API_KEY"\", \"newUserEmail\":\""$DASHBOARDI_INIT_USER_EMAIL"\", \"newUserPassword\":\""$DASHBAORDI_INIT_PASSWORD"\"}" "http://127.0.0.1:"$PORT"/account/register")
    if [ "$response" == "FAIL" ]; then
        echo -e "\e[1;31mERROR - Creating initial user did not succeed. See curl error above for further details \e[0m"
        exit 1
    fi
fi
