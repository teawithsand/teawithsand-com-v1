#!/bin/bash
# Redirects port 80 on remote host to port 8880 on localhost
# This allows for testing of prod version without exposing it to the world
ssh -L 8880:localhost:80 debian@146.59.83.123