#!/bin/bash

# Exit if any command has a non-zero exit status (Exists if a command returns an exception, like it's a programming language)
# Prevents errors in a pipeline from being hidden. So if any command fails, that return code will be used as the return code of the whole pipeline
set -eo pipefail

check-environment.sh

# Check if the function exists
if declare -f "$1" >/dev/null; then
    # call the function
    "$@"
else
    # Show a helpful error
    echo "ERROR - '$1' is not a known function name" >&2
    exit 1
fi
