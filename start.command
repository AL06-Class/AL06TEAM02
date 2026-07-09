#!/bin/bash
# Shootmon dev server - one click (Mac). Double-click to run.
# First time: right-click -> Open.
cd "$(dirname "$0")"

if ! docker info >/dev/null 2>&1; then
  echo "[!] Please start Docker Desktop first, then run this again."
  read -p "Press Enter to close..."
  exit 1
fi

echo "Starting Shootmon dev server..."
docker compose up -d

echo "Waiting for server... first run takes a few minutes."
until curl -s -o /dev/null http://localhost:5173; do sleep 3; done

echo "Ready - opening http://localhost:5173"
open http://localhost:5173
