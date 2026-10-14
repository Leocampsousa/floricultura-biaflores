# 🚀 Guia de Deploy no Azure Kubernetes Service (AKS) & Docker

Este repositório está 100% preparado para ser conteinerizado via **Docker** e publicado em produção no **AKS (Azure Kubernetes Service)**.

---

## 📁 Arquivos Criados

- [`Dockerfile`](file:///c:/git/floricultura_bia/Dockerfile): Imagem baseada em `nginx:1.27-alpine` otimizada com healthcheck.
- [`nginx.conf`](file:///c:/git/floricultura_bia/nginx.conf): Configuração de produção com compressão Gzip, cache de assets e endpoint `/healthz`.
- [`.dockerignore`](file:///c:/git/floricultura_bia/.dockerignore): Ignora arquivos desnecessários no build do container.
- [`docker-compose.yml`](file:///c:/git/floricultura_bia/docker-compose.yml): Para execução e testes locais.
- **Manifestos Kubernetes (`k8s/`):**
  - [`k8s/namespace.yaml`](file:///c:/git/floricultura_bia/k8s/namespace.yaml): Namespace isolado `floricultura`.
  - [`k8s/deployment.yaml`](file:///c:/git/floricultura_bia/k8s/deployment.yaml): 2 réplicas com RollingUpdate, health probes e limites de CPU/memória.
  - [`k8s/service.yaml`](file:///c:/git/floricultura_bia/k8s/service.yaml): Service do tipo `LoadBalancer` (provisiona IP público no Azure).
  - [`k8s/hpa.yaml`](file:///c:/git/floricultura_bia/k8s/hpa.yaml): Auto-escalabilidade de 2 a 5 Pods para datas comemorativas (Dia das Mães/Namorados).
  - [`k8s/ingress.yaml`](file:///c:/git/floricultura_bia/k8s/ingress.yaml): Roteamento com domínio personalizado e suporte a SSL/TLS.
  - [`k8s/kustomization.yaml`](file:///c:/git/floricultura_bia/k8s/kustomization.yaml): Permite aplicar todos os manifestos com 1 único comando.

---

## 🛠️ Passo a Passo para Deploy no AKS

### 1. Testar Localmente com Docker (Opcional)
Inicie o **Docker Desktop** no Windows e execute no terminal:

```powershell
# Build da imagem
docker build -t floricultura-bia:latest .

# Rodar localmente na porta 80
docker run -d -p 80:80 --name floricultura-app floricultura-bia:latest

# Ou usando Docker Compose:
docker compose up -d
```
Acesse no navegador: `http://localhost/`

---

### 2. Login na Azure e Criar o Registro de Containers (ACR)

Se ainda não tiver um Container Registry (ACR), crie um:

```powershell
# 1. Login na sua conta Azure
az login

# 2. Definir variáveis (substitua pelos seus dados)
$RG = "rg-floricultura"
$ACR_NAME = "acrfloriculturabia"   # Nome único global (apenas letras e números minúsculos)
$AKS_CLUSTER = "aks-floricultura"

# 3. Criar Resource Group (se não existir)
az group create --name $RG --location brazilsouth

# 4. Criar Azure Container Registry
az acr create --resource-group $RG --name $ACR_NAME --sku Basic

# 5. Login no ACR
az acr login --name $ACR_NAME
```

---

### 3. Fazer o Build e Push da Imagem para o ACR

```powershell
# 1. Obter o servidor de login do ACR
$ACR_SERVER = "$ACR_NAME.azurecr.io"

# 2. Build com a tag do ACR
docker build -t "$ACR_SERVER/floricultura-bia:latest" .

# 3. Push para o Azure
docker push "$ACR_SERVER/floricultura-bia:latest"
```

---

### 4. Conectar o Cluster AKS ao ACR

Permite que o AKS baixe imagens do seu ACR sem precisar configurar secrets manuais:

```powershell
az aks update -n $AKS_CLUSTER -g $RG --attach-acr $ACR_NAME
```

Obter as credenciais do cluster para usar com `kubectl`:
```powershell
az aks get-credentials --resource-group $RG --name $AKS_CLUSTER --overwrite-existing
```

---

### 5. Configurar o Manifesto e Publicar no AKS

Abra o arquivo [`k8s/deployment.yaml`](file:///c:/git/floricultura_bia/k8s/deployment.yaml) e atualize a linha da imagem com o nome do seu ACR:

```yaml
image: acrfloriculturabia.azurecr.io/floricultura-bia:latest
```

Em seguida, aplique todos os manifestos de uma vez:

```powershell
kubectl apply -k k8s/
```

---

### 6. Verificar a Aplicação e Obter o IP Público

```powershell
# Verificar status dos pods
kubectl get pods -n floricultura

# Verificar o IP externo provisionado pelo Azure Load Balancer
kubectl get svc floricultura-service -n floricultura --watch
```

Assim que a coluna `EXTERNAL-IP` mostrar o endereço IP (ex: `20.195.xxx.xxx`), o site da **Floricultura Bia Presentes** já estará no ar para o mundo todo na nuvem da Microsoft Azure! 🚀

---

## 🛡️ Segurança Direta no AKS (Sem CDN / Cloudflare)

Quando o tráfego aponta diretamente para o AKS sem um proxy/CDN externo, a proteção contra ataques é feita em 4 camadas internas já configuradas:

1. **Ataques Volumétricos L3/L4 (SYN/UDP Flood):** Protegidos automaticamente pela infraestrutura de rede da Microsoft Azure no IP público.
2. **WAF ModSecurity (Camada 7):** Configurado no [`k8s/ingress.yaml`](file:///c:/git/floricultura_bia/k8s/ingress.yaml) com regras OWASP para bloquear requisições maliciosas.
3. **Rate Limiting no IP Real:** Configurado no [`nginx.conf`](file:///c:/git/floricultura_bia/nginx.conf) e no Ingress, limitando a 10-15 req/s por IP com identificação do cliente real via `X-Forwarded-For`.
4. **Resiliência e Auto-Scale:** O HPA ([`k8s/hpa.yaml`](file:///c:/git/floricultura_bia/k8s/hpa.yaml)) escala os pods automaticamente caso haja aumento de requisições, e a NetworkPolicy ([`k8s/network-policy.yaml`](file:///c:/git/floricultura_bia/k8s/network-policy.yaml)) bloqueia movimentação lateral no cluster.

