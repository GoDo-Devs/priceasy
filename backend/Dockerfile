FROM node:22

# Instala dependências do sistema para Chromium headless
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    libgbm1 \
    && rm -rf /var/lib/apt/lists/*

# Cria diretório de trabalho
WORKDIR /app

# Copia e instala dependências do projeto
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Instala nodemon globalmente
RUN npm install -g nodemon

# Instala os navegadores usados pelo Playwright
RUN npx playwright install --with-deps

# Expõe porta da API
EXPOSE 4000

# Inicia a aplicação com nodemon
CMD ["nodemon", "index.js"]
