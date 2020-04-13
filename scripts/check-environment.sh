#!/bin/bash

if [ -z "$UI_PORT" ]; then
    echo -e "\e[1;32mERROR - 'UI PORT' has not been provided! \e[0m"
    exit 1
fi