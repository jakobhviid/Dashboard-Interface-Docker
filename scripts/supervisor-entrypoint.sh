#!/bin/bash

supervisorctl start socketserver

supervisorctl start ui

create-initial-user.sh