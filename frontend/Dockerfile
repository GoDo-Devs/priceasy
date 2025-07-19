FROM node:22

# Evita que o Puppeteer tente baixar o Chrome
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
