# 🚀 Guia de Deploy - School Management System

Este guia fornece instruções detalhadas para fazer o deploy do School Management System em produção usando Docker, Docker Compose e Nginx.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Git** (para clonar o repositório)
- **Servidor Linux** (Ubuntu 20.04 LTS ou superior recomendado)
- **Domínio configurado** (opcional, mas recomendado para HTTPS)

### Requisitos de Hardware Recomendados

| Componente | Mínimo | Recomendado |
|-----------|--------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 2 GB | 4+ GB |
| Disco | 20 GB | 50+ GB SSD |
| Rede | 100 Mbps | 1 Gbps |

## 🛠️ Preparação do Servidor

### 1. Atualizar o Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Docker

```bash
# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionar repositório do Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verificar instalação
docker --version
docker compose version
```

### 3. Configurar Usuário Docker (Opcional)

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 4. Instalar Utilitários Adicionais

```bash
sudo apt install -y git htop ufw fail2ban
```

## 📦 Deploy da Aplicação

### 1. Clonar o Repositório

```bash
cd /opt
sudo git clone https://github.com/your-org/school-management-system.git
cd school-management-system
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.production.example .env.production

# Editar com suas configurações
nano .env.production
```

**Configurações Críticas a Modificar:**

```env
# Database
DB_USER=seu_usuario_db
DB_PASSWORD=senha_segura_aqui_minimo_16_caracteres

# JWT Secret (gerar com: openssl rand -base64 32)
JWT_SECRET=seu-jwt-secret-super-seguro-32-caracteres-minimo

# URLs
API_URL=https://seu-dominio.com/api
FRONTEND_URL=https://seu-dominio.com
NEXT_PUBLIC_API_URL=https://seu-dominio.com/api

# Email SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app
```

### 3. Executar Migrações do Banco de Dados

```bash
# Subir apenas o banco de dados
docker compose -f docker-compose.production.yml up -d postgres

# Aguardar inicialização (30 segundos)
sleep 30

# Executar migrações
docker compose -f docker-compose.production.yml run --rm backend npx prisma migrate deploy

# Gerar Prisma Client
docker compose -f docker-compose.production.yml run --rm backend npx prisma generate

# (Opcional) Popular com dados iniciais
docker compose -f docker-compose.production.yml run --rm backend npx prisma db seed
```

### 4. Construir e Iniciar Todos os Serviços

```bash
# Build das imagens
docker compose -f docker-compose.production.yml build

# Iniciar serviços em background
docker compose -f docker-compose.production.yml up -d

# Verificar status
docker compose -f docker-compose.production.yml ps

# Ver logs em tempo real
docker compose -f docker-compose.production.yml logs -f
```

### 5. Verificar Saúde dos Serviços

```bash
# Backend health check
curl http://localhost/api/health

# Frontend health check
curl http://localhost/

# Verificar containers
docker ps
```

## 🔐 Configuração HTTPS com Let's Encrypt

### 1. Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obter Certificado SSL

```bash
# Parar nginx temporariamente
docker compose -f docker-compose.production.yml stop nginx

# Obter certificado
sudo certbot certonly --standalone -d seu-dominio.com -d www.seu-dominio.com

# Copiar certificados para nginx
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem nginx/ssl/
```

### 3. Habilitar HTTPS no Nginx

Edite `nginx/nginx.conf` e descomente o bloco do servidor HTTPS:

```bash
nano nginx/nginx.conf
```

Descomente as linhas do servidor SSL (linhas 135-170).

### 4. Reiniciar Nginx

```bash
docker compose -f docker-compose.production.yml restart nginx
```

### 5. Configurar Renovação Automática

```bash
# Adicionar job ao cron
sudo crontab -e

# Adicionar linha (renovar certificados a cada 2 meses)
0 0 1 */2 * certbot renew --quiet && docker compose -f /opt/school-management-system/docker-compose.production.yml restart nginx
```

## 🛡️ Segurança e Firewall

### 1. Configurar UFW (Uncomplicated Firewall)

```bash
# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

### 2. Configurar Fail2Ban

```bash
sudo nano /etc/fail2ban/jail.local
```

Adicionar:

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
```

Reiniciar:

```bash
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

## 📊 Monitoramento e Logs

### 1. Ver Logs dos Serviços

```bash
# Todos os serviços
docker compose -f docker-compose.production.yml logs -f

# Backend apenas
docker compose -f docker-compose.production.yml logs -f backend

# Últimas 100 linhas
docker compose -f docker-compose.production.yml logs --tail=100 backend
```

### 2. Monitorar Recursos

```bash
# CPU e memória dos containers
docker stats

# Espaço em disco
df -h
docker system df
```

### 3. Limpar Recursos Não Utilizados

```bash
# Remover containers parados
docker container prune -f

# Remover imagens não utilizadas
docker image prune -a -f

# Limpar volumes órfãos (cuidado!)
docker volume prune -f

# Limpeza completa
docker system prune -a -f --volumes
```

## 🔄 Atualizações e Manutenção

### 1. Atualizar Aplicação

```bash
# Navegar para diretório
cd /opt/school-management-system

# Fazer backup do banco de dados
docker compose -f docker-compose.production.yml exec postgres pg_dump -U school_admin school_management_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Parar serviços
docker compose -f docker-compose.production.yml down

# Atualizar código
git pull origin main

# Rebuild e restart
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml up -d

# Executar migrações se houver
docker compose -f docker-compose.production.yml run --rm backend npx prisma migrate deploy
```

### 2. Backup do Banco de Dados

Script de backup automático (`backup.sh`):

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/school_db_$DATE.sql"

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Fazer backup
docker compose -f /opt/school-management-system/docker-compose.production.yml exec -T postgres \
  pg_dump -U school_admin school_management_prod > $BACKUP_FILE

# Compactar
gzip $BACKUP_FILE

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "school_db_*.sql.gz" -mtime +7 -delete

echo "Backup concluído: ${BACKUP_FILE}.gz"
```

Adicionar ao cron:

```bash
chmod +x backup.sh
sudo crontab -e

# Backup diário às 2h da manhã
0 2 * * * /opt/school-management-system/backup.sh >> /var/log/backup.log 2>&1
```

### 3. Restaurar Backup

```bash
# Descompactar backup
gunzip backup_20241020_120000.sql.gz

# Restaurar
docker compose -f docker-compose.production.yml exec -T postgres \
  psql -U school_admin school_management_prod < backup_20241020_120000.sql
```

## 📈 Otimizações de Performance

### 1. Ajustar Configurações do PostgreSQL

```bash
docker compose -f docker-compose.production.yml exec postgres bash

# Dentro do container
nano /var/lib/postgresql/data/postgresql.conf
```

Configurações recomendadas:

```conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 6MB
min_wal_size = 1GB
max_wal_size = 4GB
max_connections = 100
```

### 2. Configurar Rate Limiting no Nginx

Já configurado em `nginx/nginx.conf`:
- API geral: 100 req/min
- Login: 5 req/min

### 3. Ativar Cache HTTP

Cache já configurado para assets estáticos (1 ano).

## 🚨 Troubleshooting

### Problema: Container não inicia

```bash
# Ver logs detalhados
docker compose -f docker-compose.production.yml logs backend

# Verificar configurações
docker compose -f docker-compose.production.yml config

# Reiniciar container específico
docker compose -f docker-compose.production.yml restart backend
```

### Problema: Erro de conexão com banco de dados

```bash
# Verificar se PostgreSQL está rodando
docker compose -f docker-compose.production.yml ps postgres

# Testar conexão manualmente
docker compose -f docker-compose.production.yml exec postgres psql -U school_admin -d school_management_prod -c "SELECT 1;"

# Verificar variáveis de ambiente
docker compose -f docker-compose.production.yml exec backend env | grep DATABASE_URL
```

### Problema: Frontend não carrega

```bash
# Verificar logs do frontend
docker compose -f docker-compose.production.yml logs frontend

# Verificar se nginx está proxy correto
docker compose -f docker-compose.production.yml exec nginx cat /etc/nginx/nginx.conf

# Reiniciar nginx
docker compose -f docker-compose.production.yml restart nginx
```

### Problema: Erros 502 Bad Gateway

```bash
# Verificar se backend está respondendo
curl http://localhost:5000/health

# Verificar conectividade entre containers
docker compose -f docker-compose.production.yml exec nginx ping backend

# Ver logs do nginx
docker compose -f docker-compose.production.yml logs nginx
```

## 📞 Suporte e Recursos

- **Documentação da API**: `/api/docs` (Swagger UI)
- **Health Check**: `/health` ou `/api/health`
- **GitHub Issues**: https://github.com/your-org/school-management-system/issues
- **Email de Suporte**: support@your-domain.com

## 📝 Checklist Pré-Deploy

Antes de colocar em produção, verifique:

- [ ] Variáveis de ambiente configuradas corretamente
- [ ] Senhas fortes (mínimo 16 caracteres)
- [ ] JWT_SECRET gerado com segurança
- [ ] Firewall configurado (UFW)
- [ ] Fail2Ban ativo
- [ ] HTTPS configurado (Let's Encrypt)
- [ ] Backups automáticos configurados
- [ ] Monitoramento ativo
- [ ] Logs centralizados
- [ ] Rate limiting configurado
- [ ] Domínio apontando para o servidor
- [ ] Email SMTP testado e funcionando

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. **Criar usuário administrador inicial**
2. **Configurar estrutura acadêmica** (Segmentos → Séries → Turmas)
3. **Cadastrar preços e serviços**
4. **Importar estudantes** (via CSV ou individualmente)
5. **Configurar matrizes contratuais**
6. **Testar exportações de relatórios**
7. **Configurar backups externos** (AWS S3, Google Cloud Storage)
8. **Implementar monitoring** (Datadog, New Relic, ou Prometheus + Grafana)

---

**🚀 Pronto! Seu School Management System está no ar!**

Para mais informações, consulte o [README.md](./README.md) e a [documentação da API](./API-EXAMPLES.md).
