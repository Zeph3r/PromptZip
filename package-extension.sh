#!/usr/bin/env bash
# Build a ZIP for Chrome Web Store upload. Run from repo root.
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-promptzip-store.zip}"
cd "$ROOT"
zip -r "$OUT" . \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*.DS_Store" \
  -x "*.zip" \
  -x "./package-extension.sh"
echo "Created $OUT — upload this in Chrome Web Store Developer Dashboard."
