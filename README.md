# Zapguard - Dify

Este repositório configura um conjunto de serviços usando Docker para criar uma stack de trabalho para o Dify.

<hr>

## Configuração de Projeto

### 1. Clonar o Repositório

Primeiro, clone o repositório para o seu ambiente local:

```bash
git clone git@github.com:yourorg/dify-service-stack.git
cd dify-service-stack
```

### 2. Configuração de Variáveis de Ambiente
Deve-se replicar o arquivo `docker/.env.example` para um chamado `.env`
```bash
cp docker/.env.example .env
```

### 3. Desativar o Serviço de Certbot (opcional)

Se você não precisar do serviço Certbot para gerenciamento de certificados SSL, comente ou remova o serviço no arquivo `docker-compose.yml`
```bash
# certbot:
#   image: certbot/certbot
#   container_name: dify_certbot
#   profiles:
#     - certbot
#   volumes:
#     - ./volumes/certbot/conf:/etc/letsencrypt
#     - ./volumes/certbot/www:/var/www/html
#     - ./volumes/certbot/logs:/var/log/letsencrypt
```

### 4. Iniciar os Serviços

Execute o build do Docker Compose para construir e iniciar os serviços em segundo plano
```bash
docker compose up -d --build
```

### 5. Verificar se os Serviços Estão Funcionando

Para verificar se todos os serviços estão rodando corretamente, utilize o seguinte comando
```bash
docker compose ps
```

<hr>

## Docker Network

Todos os serviços estão conectados à rede Docker chamada `ssrf_proxy_network`, utilizando o driver `bridge`.

Caso a rede Docker não seja criada automaticamente, execute o comando

```bash
docker network create ssrf_proxy_network
```

<hr>

## Portas e Hosts

Abaixo está o mapeamento de portas e hosts para cada serviço em seu ambiente Docker

| **Serviço**                 | **Porta externa**           | **Porta interna**          | **Endereço IP**                 | **Host**                          |
|-----------------------------|-----------------------------|----------------------------|----------------------------------|-----------------------------------|
| API                         | 5001                        | 5001                       | http://195.200.2.164:5001       | http://srv649454.hstgr.cloud:5001 |
| Web                         | 8080                        | 8080                       | http://195.200.2.164:8080       | http://srv649454.hstgr.cloud:8080 |
| Worker                      | -                           | -                          | -                                | -                                 |
| Database (DB)               | 5432                        | 5432                       | http://195.200.2.164:5432       | http://srv649454.hstgr.cloud:5432 |
| Redis                       | 6379                        | 6379                       | http://195.200.2.164:6379       | http://srv649454.hstgr.cloud:6379 |
| Nginx (Reverse Proxy)       | 8082, 8443 (SSL)            | 80, 443 (SSL)              | http://195.200.2.164:8082       | http://srv649454.hstgr.cloud:8082 |
| Sandbox                     | 8194                        | 8194                       | http://195.200.2.164:8194       | http://srv649454.hstgr.cloud:8194 |
| Certbot                     | -                           | -                          | -                                | -                                 |
| Weaviate                    | -                           | -                          | -                                | -                                 |
| Qdrant                      | -                           | -                          | -                                | -                                 |
| Couchbase                   | -                           | -                          | -                                | -                                 |
| Milvus                      | 19530, 9091                 | 19530, 9091                | http://195.200.2.164:19530      | http://srv649454.hstgr.cloud:19530 |
| Elasticsearch               | 9200                        | 9200                       | http://195.200.2.164:9200       | http://srv649454.hstgr.cloud:9200 |
| Kibana                      | 5601                        | 5601                       | http://195.200.2.164:5601       | http://srv649454.hstgr.cloud:5601 |
| MyScale                     | 8123                        | 8123                       | http://195.200.2.164:8123       | http://srv649454.hstgr.cloud:8123 |
| Opensearch                  | 9200                        | 9200                       | http://195.200.2.164:9200       | http://srv649454.hstgr.cloud:9200 |
| Opensearch-Dashboards       | 5601                        | 5601                       | http://195.200.2.164:5601       | http://srv649454.hstgr.cloud:5601 |
| Oracle                      | -                           | -                          | -                                | -                                 |
| Chroma                      | -                           | -                          | -                                | -                                 |
| OceanBase                   | -                           | -                          | -                                | -                                 |


<hr>

## Certificados SSL
Se o serviço Certbot for ativado, o Nginx será configurado para usar os certificados SSL gerados para a comunicação segura via HTTPS nas portas 8443.

    O Certbot irá gerar e renovar os certificados para o Nginx automaticamente.
    Nginx estará disponível nas portas 8082 (HTTP) e 8443 (HTTPS).
