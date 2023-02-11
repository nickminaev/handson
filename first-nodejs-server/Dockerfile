FROM node:alpine
WORKDIR /app
COPY package.json ./
RUN npm i
COPY server.js ./
ENTRYPOINT ["node"]
CMD ["server.js"]