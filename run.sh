#!/usr/bin/env bash
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'
log() { echo -e "${GREEN}==> $1${NC}"; }
warn() { echo -e "${YELLOW}==> $1${NC}"; }
err() { echo -e "${RED}==> $1${NC}"; }

PORT=3000

check_port() {
  if ! command -v lsof >/dev/null 2>&1; then
    warn "lsof not installed, skipping port check."
    return
  fi

  local pid
  pid=$(lsof -ti:"$PORT" -sTCP:LISTEN || true)
  if [ -z "$pid" ]; then
    log "Port $PORT is available."
    return
  fi

  local name
  name=$(ps -p "$pid" -o comm= 2>/dev/null || echo "unknown")

  warn "Port $PORT in use by PID $pid ($name)."
  read -r -p "Kill it? [y/N] " ans
  case "$ans" in
    y|Y|yes|YES)
      kill "$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null || true
      sleep 1
      log "Killed PID $pid."
      ;;
    *)
      err "Aborting. Free port $PORT and retry."
      exit 1
      ;;
  esac
}

cd "$(dirname "$0")/Frontend"

if [ ! -d node_modules ]; then
  log "Installing dependencies..."
  npm install
else
  log "Dependencies already installed, skipping."
fi

log "Building production bundle..."
npm run build

check_port

log "Serving dist/ on PORT $PORT"
npx --yes serve -s dist -l "$PORT"
