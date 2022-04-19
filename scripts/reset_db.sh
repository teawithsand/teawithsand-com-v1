#!/bin/bash

# php -S 0.0.0.0:8000 -t /workspace/public
cd "$(dirname "$0")" && \
cd .. && \
bin/console doctrine:schema:drop --force && \
bin/console doctrine:schema:create  && \
bin/console doctrine:database:drop --force && \
bin/console doctrine:database:create && \
bin/console doctrine:migrations:migrate --quiet && \
bin/console doctrine:fixtures:load --quiet && \
echo "Dropped, recreated, migrated and loaded all fixtures"