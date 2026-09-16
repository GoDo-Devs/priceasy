# Deploy em produção

Stack: **Nginx** (serve o frontend e faz proxy do `/api`) → **backend Node** → **MySQL**, tudo em Docker.
Só a porta **80** fica exposta; backend e banco ficam na rede interna do Docker.

```
internet :80 → [nginx + build do frontend] ──/api/──→ [backend :4000] ──→ [mysql]
```

---

## 1. Preparar a VPS (uma única vez)

Dentro da VPS:

```bash
curl -fsSL https://raw.githubusercontent.com/GoDo-Devs/priceasy/main/scripts/setup-vps.sh | bash
```

O script instala Docker e git, clona o repositório em `/root/priceasy-prod` e cria os `.env`
a partir dos exemplos.

Em seguida, **edite os segredos** (ainda na VPS):

```bash
nano /root/priceasy-prod/.env          # DB_ROOT_PASSWORD, DB_NAME, VITE_API_URL
nano /root/priceasy-prod/backend/.env  # JWT_SECRET, SMTP, FRONTEND_URL, API_PLATE_KEY
```

> `DB_ROOT_PASSWORD` (`.env`) e `DB_PASSWORD` (`backend/.env`) precisam ter o
> **mesmo valor** enquanto `DB_USER=root`.
>
> `FRONTEND_URL` deve ser a URL pública (ex.: `http://52.67.41.3`) — é ela que o CORS usa.

Por fim, libere a porta 80 no firewall / security group da VPS.

---

## 2. Configurar o deploy (uma única vez, na sua máquina)

```bash
cp scripts/deploy.env.example scripts/deploy.env
nano scripts/deploy.env   # VPS_HOST, VPS_USER, VPS_PATH e a autenticação
```

A autenticação aceita duas formas (`SSH_KEY` tem prioridade se as duas existirem):

| Variável | Uso |
|---|---|
| `SSH_KEY` | caminho do arquivo de chave privada, ex.: `~/.ssh/priceasy.pem` |
| `SSH_PASSWORD` | senha do usuário; requer `sshpass` (`brew install sshpass`) |

`scripts/deploy.env` é ignorado pelo git — a senha/chave não vai para o repositório.

> Chave SSH é mais segura que senha. Para migrar depois:
> `ssh-keygen -t ed25519 -f ~/.ssh/priceasy` e `ssh-copy-id -i ~/.ssh/priceasy.pub root@SEU_IP`,
> trocando `SSH_PASSWORD` por `SSH_KEY=~/.ssh/priceasy`.

---

## 3. Deploy

```bash
./scripts/deploy.sh
```

O script conecta via SSH e executa, na VPS:

1. `git reset --hard origin/main` (o código da VPS vira um espelho da branch)
2. build das imagens de produção
3. sobe o banco e **aguarda ficar saudável**
4. roda as **migrations** (`sequelize-cli db:migrate --env production`)
5. sobe backend e frontend
6. remove imagens órfãs

Para publicar outra branch: `BRANCH=develop ./scripts/deploy.sh`

> O deploy faz `git reset --hard`: qualquer alteração feita manualmente na VPS
> (fora dos arquivos `.env`, que são ignorados pelo git) é descartada.

---

## Git flow sugerido

```
feature/x ──PR──► main ──► ./scripts/deploy.sh
```

Trabalhe em branches de feature, abra PR para `main` e rode o deploy após o merge.

---

## Operação do dia a dia

Todos os comandos são executados na VPS, dentro de `/root/priceasy-prod`:

```bash
# logs
docker compose -f docker-compose.prod.yml logs -f backend

# status
docker compose -f docker-compose.prod.yml ps

# reiniciar um serviço
docker compose -f docker-compose.prod.yml restart backend

# rodar migrations manualmente
docker compose -f docker-compose.prod.yml run --rm --no-deps \
  -e NODE_ENV=production backend npx sequelize-cli db:migrate --env production

# seeders (primeira carga de dados)
docker compose -f docker-compose.prod.yml run --rm --no-deps \
  -e NODE_ENV=production backend npx sequelize-cli db:seed:all --env production

# backup do banco
docker compose -f docker-compose.prod.yml exec db \
  mysqldump -uroot -p"$DB_ROOT_PASSWORD" priceasy > backup-$(date +%F).sql
```

---

## Desenvolvimento local

Continua igual, com o compose padrão:

```bash
docker compose up
```

Frontend em `http://localhost:3000`, backend em `http://localhost:4000`.

---

## Variáveis de ambiente

**`.env` (raiz)** — consumido pelo `docker-compose.prod.yml`:

| Variável | Descrição |
|---|---|
| `DB_ROOT_PASSWORD` | senha do root do MySQL (obrigatória) |
| `DB_NAME` | nome do banco criado na primeira subida |
| `VITE_API_URL` | caminho da API no build do frontend (`/api`) |

**`backend/.env`** — consumido pelo backend:

| Variável | Descrição |
|---|---|
| `FRONTEND_URL` | URL pública, usada pelo CORS |
| `DB_HOST` | forçado para `db` pelo compose de produção |
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | credenciais do banco |
| `JWT_SECRET` | segredo de assinatura dos tokens |
| `SMTP_*`, `EMAIL_FROM` | envio de e-mails |
| `API_PLATE_KEY` | integração de consulta de placa |

---

## Adicionar HTTPS depois

Com um domínio apontando para a VPS, o caminho mais curto é colocar um
proxy com TLS automático (Caddy ou Traefik) na frente do serviço `frontend`,
ou rodar o certbot e montar os certificados no Nginx do container, passando a
expor também a porta 443.
