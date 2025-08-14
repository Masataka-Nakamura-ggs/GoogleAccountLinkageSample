#!/bin/bash
set -e

# Keycloakサーバーが起動して準備ができるまで待つ
echo "Waiting for Keycloak server to be ready..."
KEYCLOAK_URL="http://keycloak:8080/realms/one-account-realm/.well-known/openid-configuration"

# 最大試行回数
MAX_RETRIES=30
RETRY_INTERVAL=5

for i in $(seq 1 $MAX_RETRIES); do
  echo "Attempt $i of $MAX_RETRIES: Checking if Keycloak is ready..."
  
  if curl -s -f -o /dev/null "$KEYCLOAK_URL"; then
    echo "Keycloak is ready! Starting application..."
    break
  fi
  
  if [ $i -eq $MAX_RETRIES ]; then
    echo "Keycloak not ready after $MAX_RETRIES attempts. Starting application anyway..."
  else
    echo "Keycloak not ready yet. Waiting $RETRY_INTERVAL seconds..."
    sleep $RETRY_INTERVAL
  fi
done

# アプリケーションを起動
exec java -jar app.jar
