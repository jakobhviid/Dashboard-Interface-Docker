#!/bin/bash

UI_PORT=${DASHBOARDI_UI_PORT:-3000}

serve -s "$INTERFACE_HOME" --listen "$UI_PORT"