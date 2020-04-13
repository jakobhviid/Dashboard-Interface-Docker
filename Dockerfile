FROM ubuntu:18.04

# 1. Updating
# 2. Updating package cache for node to the newest version of Node.js from deb.nodesource.com
# 3. Installing nodejs and build essential in order to be able to run npm packages which needs to be compiled such as npm packages which are written in C.
# Supervisor for process management
# 4. Installing serve for deployment of the ui
RUN apt update && \
    apt install curl -y && curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt install -y nodejs build-essential supervisor && \
    npm install -g serve

# Copy necessary scripts
COPY scripts /tmp/
RUN chmod +x /tmp/*.sh && \
    mv /tmp/* /usr/bin && \
    rm -rf /tmp/*

ENV CONSUMER_HOME=/opt/consumer
ENV INTERFACE_HOME=/opt/interface

# Setting node environment to production so dev only tools aren't installed
ENV NODE_ENV=production

COPY ./kafka_consumer_server ${CONSUMER_HOME}
COPY ./interface ${INTERFACE_HOME}

# 1. + 2. Go into consumer directory and npm continoues integration install packages from package-lock.json fast and reliably. It will not install packages declared under "devDependencies in package.json"
# 3. Building the files ready for deployment
RUN cd ${CONSUMER_HOME} && npm ci --only=production
RUN cd ${INTERFACE_HOME} && npm ci --only=production && \
    npm run build

# TODO - CLEAN UP UNNECESSARY FILES, look into multistage builds

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD [ "docker-entrypoint.sh" ]