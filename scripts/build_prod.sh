#!/bin/bash

cd "$(dirname "$0")" && \
cd .. && \
./scripts/asset_prod.sh && \
docker build -t finaltwsapi-app:latest -f deploy/Dockerfiles/AppDockerfile . && \
docker save finaltwsapi-app:latest -o deploy/dist/app-image.tar && \
docker build -t finaltwsapi-nginx:latest -f deploy/Dockerfiles/NginxDockerfile . && \
docker save finaltwsapi-nginx:latest -o deploy/dist/nginx-image.tar