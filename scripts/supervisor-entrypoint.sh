#!/bin/bash

check-environment.sh

supervisorctl start consumer
supervisorctl start ui
