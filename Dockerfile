FROM albovieira/nodeapp

RUN apt-get update && \
    apt-get install -y \
        git \
        openssh-server

RUN npm install typescript -g
RUN mkdir -p /usr/src/app

COPY . /usr/src/app/
WORKDIR /usr/src/app

RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    ssh-keyscan github.com > /root/.ssh/known_hosts

# Add the keys and set permissions

RUN ls -la
RUN cat key > /root/.ssh/id_rsa && \
    cat key.pub > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub

RUN npm install

RUN npm run build && npm prune --silent --production

RUN cp .env.hmg .env

ENV NODE_ENV production

EXPOSE 3000
CMD ["pm2-docker", "process.json"]
