# socket stage
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 as socketbuild

ARG BUILDCONFIG=RELEASE
ARG VERSION=1.0.0

COPY ./SocketServer/SocketServer.csproj /build/SocketServer.csproj

RUN dotnet restore ./build/SocketServer.csproj

COPY ./SocketServer/ /build/

WORKDIR /build/

RUN dotnet publish ./SocketServer.csproj -c ${BUILDCONFIG} -o out /p:Version=${VERSION}

# interface stage
FROM node AS interfacebuild

COPY ./interface .

# Install dependencies (including dev dependencies)
RUN npm install

# Build the project
RUN npm run build

# final stage
FROM ubuntu:19.10

LABEL Maintainer="Oliver Marco van Komen"

# 1. Updating
# 2. Updating package cache for node to the newest version of Node.js from deb.nodesource.com
# 3. Installing nodejs and build essential in order to be able to run npm packages which needs to be compiled such as npm packages which are written in C.
# Supervisor for process management
# 4. Installing serve for deployment of the ui
# TODO: installing both wget and curl... This is just for a quick demo
RUN apt update && \
    apt install -y wget && wget https://packages.microsoft.com/config/ubuntu/19.10/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg --purge packages-microsoft-prod && dpkg -i packages-microsoft-prod.deb && \
    apt update && \
    apt install aspnetcore-runtime-3.1 -y && \
    apt install curl -y && curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt install -y nodejs build-essential supervisor && \
    npm install -g serve

ENV SOCKETSERVER_HOME=/opt/socketserver
ENV INTERFACE_HOME=/opt/interface
ENV ASPNETCORE_ENVIRONMENT=Production
# # Setting node environment to production so dev only tools aren't installed
# ENV NODE_ENV=production

# Copy necessary scripts
COPY scripts /tmp/
RUN chmod +x /tmp/*.sh && \
    mv /tmp/* /usr/bin && \
    rm -rf /tmp/*

COPY --from=socketbuild /build/out ${SOCKETSERVER_HOME}

COPY --from=interfacebuild /build ${INTERFACE_HOME}/build

# 1. + 2. Go into consumer directory and npm continoues integration install packages from package-lock.json fast and reliably. It will not install packages declared under "devDependencies in package.json"
# 3. Building the files ready for deployment

# RUN cd ${INTERFACE_HOME} && npm ci --only=production && \
#     npm run build

# TODO - CLEAN UP UNNECESSARY FILES, look into multistage builds

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD [ "docker-entrypoint.sh" ]