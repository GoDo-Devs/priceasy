cd "$VPS_PATH"

echo "==> Atualizando código (${BRANCH})"
git fetch --all --prune
git checkout "$BRANCH"
git reset --hard "origin/${BRANCH}"

if [[ ! -f .env ]]; then
  echo "ERRO: .env não encontrado em $VPS_PATH (copie de .env.example)" >&2
  exit 1
fi

if [[ ! -f backend/.env ]]; then
  echo "ERRO: backend/.env não encontrado (copie de backend/.env.example)" >&2
  exit 1
fi

COMPOSE="docker compose -f docker-compose.prod.yml"

echo "==> Buildando imagens"
$COMPOSE build

echo "==> Subindo banco"
$COMPOSE up -d db

echo "==> Aguardando banco ficar saudável"
for i in $(seq 1 90); do
  status=$($COMPOSE ps db --format '{{.Health}}' 2>/dev/null || echo "")
  if [[ "$status" == "healthy" ]]; then
    echo "    banco pronto"
    break
  fi
  if [[ $i -eq 90 ]]; then
    echo "ERRO: banco não ficou saudável a tempo" >&2
    $COMPOSE logs --tail=50 db >&2
    exit 1
  fi
  sleep 2
done

echo "==> Rodando migrations"
$COMPOSE run --rm --no-deps -e NODE_ENV=production backend \
  npx sequelize-cli db:migrate --env production

echo "==> Subindo aplicação"
$COMPOSE up -d --force-recreate --remove-orphans

echo "==> Limpando imagens antigas"
docker image prune -f >/dev/null

echo "==> Status"
$COMPOSE ps
