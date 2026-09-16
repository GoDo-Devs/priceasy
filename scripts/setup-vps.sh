#!/usr/bin/env bash
set -euo pipefail

# Preparação inicial da VPS (rodar UMA vez, dentro da VPS, como usuário com sudo).
#
#   curl -fsSL https://raw.githubusercontent.com/GoDo-Devs/priceasy/main/scripts/setup-vps.sh | bash
#
# ou copie o arquivo e execute: bash setup-vps.sh

REPO_URL="${REPO_URL:-https://github.com/GoDo-Devs/priceasy.git}"
APP_PATH="${APP_PATH:-/root/priceasy-prod}"
BRANCH="${BRANCH:-main}"

SUDO=""
if [[ "$(id -u)" -ne 0 ]]; then
  SUDO="sudo"
fi

echo "==> Instalando Docker (se necessário)"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | $SUDO sh
  if [[ -n "$SUDO" ]]; then
    $SUDO usermod -aG docker "$USER"
    echo "    Docker instalado. Saia e entre novamente na sessão SSH para usar docker sem sudo."
  fi
fi

echo "==> Instalando git (se necessário)"
if ! command -v git >/dev/null 2>&1; then
  $SUDO apt-get update -y && $SUDO apt-get install -y git
fi

echo "==> Preparando ${APP_PATH}"
if [[ ! -d "$APP_PATH/.git" ]]; then
  $SUDO mkdir -p "$APP_PATH"
  if [[ -n "$SUDO" ]]; then
    $SUDO chown "$USER":"$USER" "$APP_PATH"
  fi
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_PATH"
else
  echo "    Repositório já existe, pulando clone."
fi

cd "$APP_PATH"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "    Criado .env a partir do exemplo."
fi

if [[ ! -f backend/.env ]]; then
  cp backend/.env.example backend/.env
  echo "    Criado backend/.env a partir do exemplo."
fi

cat <<MSG

==> Setup concluído.

Próximos passos, AINDA NA VPS:

  1. Edite os segredos (senhas, JWT_SECRET, SMTP, FRONTEND_URL):

       nano ${APP_PATH}/.env
       nano ${APP_PATH}/backend/.env

     Atenção: DB_PASSWORD no .env da raiz e em backend/.env
     precisam ter o MESMO valor.

  2. Libere a porta 80 no firewall da VPS / security group.

  3. Da sua máquina local, rode o deploy:

       ./scripts/deploy.sh

MSG
