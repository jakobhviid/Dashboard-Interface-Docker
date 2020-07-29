#!/bin/bash

# Running env.sh script first to ensure that react has access to runtime environment variables
"$INTERFACE_HOME"/env.sh && nginx -g "daemon off;"