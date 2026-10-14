# 🏠 Guia de Deploy em Cluster Kubernetes Local (Bare-Metal / On-Premise) com IP Público

Este guia cobre como subir a aplicação no seu **Cluster Kubernetes Local** (K3s, MicroK8s, Kubeadm ou RKE) exposto via **IP Público**.

---

## 🛠️ 1. Build da Imagem no Ambiente Local

Como o cluster é local, você não precisa de registry na nuvem (ACR). Basta gerar a imagem Docker diretamente:

```bash
# Na raiz do projeto:
docker build -t floricultura-bia:latest .
```

### Se você usa K3s, MicroK8s ou Containerd:
* **K3s:** Salve e importe para o containerd do K3s:
  ```bash
  docker save floricultura-bia:latest | sudo k3s ctr images import -
  ```
* **MicroK8s:**
  ```bash
  docker save floricultura-bia:latest | microk8s ctr image import -
  ```
* **Kubeadm:** Se os nós compartilham o Docker daemon local, a imagem já estará disponível (pois configuramos `imagePullPolicy: IfNotPresent` no [`k8s/deployment.yaml`](file:///c:/git/floricultura_bia/k8s/deployment.yaml)).

---

## 🚀 2. Aplicar os Manifestos no Cluster

Com o `kubectl` apontando para o seu cluster local:

```bash
kubectl apply -k k8s/
```

Verifique se os pods estão rodando:
```bash
kubectl get pods,svc -n floricultura
```

---

## 🌐 3. Exposição para o IP Público (Port Forwarding / NAT)

O serviço está configurado como **NodePort** na porta `30080` (definido em [`k8s/service.yaml`](file:///c:/git/floricultura_bia/k8s/service.yaml)):

1. Descubra o IP local do nó do cluster (ex: `192.168.1.100`).
2. No seu **Roteador / Firewall de Borda** (Mikrotik, pfSense, FortiGate ou modem da operadora), configure o encaminhamento de portas (NAT / Port Forwarding):
   * **Porta Externa:** `80` (HTTP) ➔ **IP Interno do Nó:** `192.168.1.100` : **Porta Interna:** `30080`
   * *(Opcional)* **Porta Externa:** `443` (HTTPS) ➔ **IP Interno do Nó:** `192.168.1.100` : **Porta Interna:** `30443` (se usar Ingress SSL).

*Caso seu cluster local utilize **MetalLB**, altere `type: NodePort` para `type: LoadBalancer` no [`k8s/service.yaml`](file:///c:/git/floricultura_bia/k8s/service.yaml).*

---

## 🛡️ 4. Segurança Crítica para Cluster Local com IP Público

Diferente da nuvem (onde os datacenters absorvem terabits de ataque), um cluster local com IP público depende da capacidade do seu link de internet e do seu firewall físico. Siga estas 4 recomendações essenciais:

### A. DMZ / VLAN Isolada (Impedir invasão à rede local)
* **Nunca** coloque o nó do Kubernetes na mesma rede interna dos computadores de escritório, PDV ou Wi-Fi da loja.
* Crie uma **VLAN isolada ou DMZ** no roteador exclusiva para o servidor do site. Se o servidor for atacado, o restante da rede fica 100% protegido.

### B. Proteção contra SYN Flood no Roteador / Firewall de Borda
* No seu firewall de borda (Mikrotik/pfSense/modem), ative a **proteção contra DoS / SYN Flood / TCP Connection Limiting**.
* Bloqueie tudo de entrada na WAN, liberando **estritamente a porta 80 e 443**.

### C. Fail2ban / CrowdSec no Host Linux do Cluster
* Instale o `fail2ban` ou `crowdsec` no sistema operacional do nó do cluster.
* Se um IP externo fizer varreduras de portas ou conexões anômalas, o `iptables`/`nftables` do Linux bloqueia o IP diretamente no kernel, antes mesmo do tráfego consumir a CPU do Kubernetes.

### D. Rate Limiting e Filtros Já Ativos no Container
O [`nginx.conf`](file:///c:/git/floricultura_bia/nginx.conf) já está equipado com:
* **Rate Limiting:** Máximo de 15 req/s por IP com bloqueio automático de HTTP Floods.
* **Slowloris Defense:** Conexões lentas são derrubadas em 10 segundos.
* **Bloqueio de Métodos:** Apenas requisições `GET` e `HEAD` são processadas.
