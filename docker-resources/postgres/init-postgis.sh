#!/bin/bash
set -e

POSTGRES_DB=${POSTGRES_DB:-base_adresse_nationale}
POSTGRES_BAN_USER=${POSTGRES_BAN_USER:-ban_plateforme}
POSTGRES_BAN_PASSWORD=${POSTGRES_BAN_PASSWORD:-ban_plateforme}

echo "Activating PostGIS extension and creating schema 'ban'..."
psql -U $POSTGRES_USER -d $POSTGRES_DB <<-EOSQL
    CREATE EXTENSION postgis;
    CREATE SCHEMA ban;
    CREATE USER $POSTGRES_BAN_USER WITH PASSWORD '$POSTGRES_BAN_PASSWORD';
    GRANT CONNECT ON DATABASE $POSTGRES_DB TO $POSTGRES_BAN_USER;
    GRANT USAGE ON SCHEMA ban TO $POSTGRES_BAN_USER;
    GRANT CREATE ON SCHEMA ban TO $POSTGRES_BAN_USER;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ban TO $POSTGRES_BAN_USER;
EOSQL