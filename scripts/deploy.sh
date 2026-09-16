#!/usr/bin/env bash
set -euo pipefail

# Deploy do Priceasy na VPS via SSH.
#
#   ./scripts/deploy.sh
#
# Configure uma vez em scripts/deploy.env (copie de scripts/deploy.env.example)
# ou exporte as variáveis no ambiente.

cd "$(dirname "$0")/.."

if [[ -f scripts/deploy.env ]]; then
  # shellcheck disable=SC1091
  source scripts/deploy.env
fi

: "${VPS_HOST:?defina VPS_HOST (ex: 52.67.41.3)}"
: "${VPS_USER:=root}"
: "${VPS_PATH:=/root/priceasy-prod}"
: "${BRANCH:=main}"
SSH_PORT="${SSH_PORT:-22}"

SSH_OPTS=(-p "$SSH_PORT" -o ConnectTimeout=15)
SSH_CMD=(ssh)

if [[ -n "${SSH_KEY:-}" ]]; then
  SSH_OPTS+=(-i "$SSH_KEY")
elif [[ -n "${SSH_PASSWORD:-}" ]]; then
  if ! command -v sshpass >/dev/null 2>&1; then
    echo "ERRO: SSH_PASSWORD definido mas sshpass não está instalado (brew install sshpass)" >&2
    exit 1
  fi
  SSH_CMD=(sshpass -p "$SSH_PASSWORD" ssh)
  SSH_OPTS+=(-o PreferredAuthentications=password -o PubkeyAuthentication=no)
fi

echo "==> Deploy em ${VPS_USER}@${VPS_HOST}:${VPS_PATH} (branch ${BRANCH})"

remote_script=$(cat <<REMOTE
set -euo pipefail

BRANCH=$(printf '%q' "$BRANCH")
VPS_PATH=$(printf '%q' "$VPS_PATH")

$(cat scripts/remote-deploy.sh)
REMOTE
)

"${SSH_CMD[@]}" "${SSH_OPTS[@]}" "${VPS_USER}@${VPS_HOST}" bash -s <<< "$remote_script"

echo "==> Deploy concluído: http://${VPS_HOST}"
