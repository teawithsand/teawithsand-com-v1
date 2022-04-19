#!/bin/bash

# php -S 0.0.0.0:8000 -t /workspace/public
cd "$(dirname "$0")" && \
cd .. && \
symfony server:start