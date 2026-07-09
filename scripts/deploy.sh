#!/usr/bin/env sh

# Mac/Linux: 필요하면 한 번만 `chmod +x scripts/deploy.sh` 실행 후 사용하세요.
docker compose exec web npm run deploy
