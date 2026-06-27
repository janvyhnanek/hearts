#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
exec python3 -m http.server "${PORT:-8099}" --bind "${HOST:-0.0.0.0}"
