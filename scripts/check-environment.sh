#!/bin/bash

if [ -z "$DASHBOARDI_UI_PORT" ]; then
    echo -e "\e[1;32mERROR - 'DASHBOARDI_UI_PORT' has not been provided. \e[0m"
    exit 1
fi

if [ -z "$DASHBOARDI_SOCKET_SERVER_PORT" ]; then
    echo -e "\e[1;32mERROR - 'DASHBOARDI_SOCKET_SERVER_PORT' has not been provided. \e[0m"
    exit 1
fi

if [[ -z "$DASHBOARDI_API_KEY" ]]; then
    echo -e "\e[1;32mERROR - 'DASHBOARDI_API_KEY' must be set \e[0m"
    exit 1
fi

if [[ -z "$DASHBOARDI_JWT_KEY" ]]; then
    echo -e "\e[1;32mERROR - 'DASHBOARDI_JWT_KEY' must be set \e[0m"
    exit 1
fi

if [[ -z "$DASHBOARDI_API_DNS" ]]; then
    echo -e "\e[1;32mERROR - 'DASHBOARDI_API_DNS' must be set \e[0m"
    exit 1
fi

if [[ -z "$DASHBOARDI_POSTGRES_CONNECTION_STRING" ]]; then
    echo -e "\e[1;32mERROR - 'DASHBOARDI_POSTGRES_CONNECTION_STRING' has not been provided \e[0m"
    exit 1
fi
