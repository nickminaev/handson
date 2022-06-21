FROM node
WORKDIR /server
RUN npm install express --production
COPY server.js .
ENTRYPOINT ["node"]
CMD ["server.js"]