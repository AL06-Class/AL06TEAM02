#!/bin/bash
# Shootmon dev server - stop (Mac). Double-click to run.
cd "$(dirname "$0")"
docker compose down
echo "Server stopped."
sleep 1
