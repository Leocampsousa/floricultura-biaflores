# Imagem base oficial e ultra-leve do Nginx Alpine
FROM nginx:1.27-alpine

LABEL maintainer="Floricultura Bia Presentes"
LABEL description="Landing Page Floricultura Bia Presentes para AKS"

# Substitui a configuração padrão do Nginx pela nossa otimizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos da aplicação
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Permissões adequadas para os arquivos
RUN chmod -R 755 /usr/share/nginx/html

# Expõe a porta HTTP padrão
EXPOSE 80

# Healthcheck interno do Docker
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

# Comando padrão de inicialização
CMD ["nginx", "-g", "daemon off;"]
