#!/bin/bash

if [ -z "$UI_PORT" ]; then
    echo -e "\e[1;32mERROR - 'UI PORT' has not been provided. \e[0m"
    exit 1
fi

if [[ -z "$KAFKA_URL" ]]; then
    echo -e "\e[1;32mERROR - 'KAFKA_URL' must be set to a comma seperated string of urls. \e[0m"
    exit 1
fi

# if [[ -z "$DASHBOARD_MSSQL_CONNECTION_STRING" ]]; then
#     echo -e "\e[1;32mERROR - 'DASHBOARD_MSSQL_CONNECTION_STRING' has not been provided \e[0m"
#     exit 1
# fi
