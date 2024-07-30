# Use uma imagem base do Node.js
FROM node:20

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código fonte para o container
COPY . .

# Compila o TypeScript
RUN npm run build

# Expõe a porta na qual o aplicativo irá rodar
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD ["npm", "run", "start:prod"]