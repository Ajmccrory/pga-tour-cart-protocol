#!/bin/bash
# Cart Management System - Database Connection Check Script
# Author: AJ McCrory
# Created: 2024
# Description: Ensures MySQL database is available before starting the backend service
#              Prevents application crashes due to missing database connection

set -e

host="$1"
shift
cmd="$@"

until mysql -h"$host" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e 'SELECT 1;'; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd