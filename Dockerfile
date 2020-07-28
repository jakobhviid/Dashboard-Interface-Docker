# --- socket stage ---
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 as socketbuild

ARG BUILDCONFIG=RELEASE
ARG VERSION=1.0.0

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF \
    && echo "deb http://download.mono-project.com/repo/debian stretch main" | tee /etc/apt/sources.list.d/mono-official.list \
    && apt-get update && apt-get install -y mono-devel default-jre build-essential libssl-dev libsasl2-2 libsasl2-dev libsasl2-modules-gssapi-mit wget unzip

# lib folder contains librdkafka zip
COPY ./lib/ /
# installing librdkafka manually
RUN unzip librdkafka-1.4.4.zip && \
    cd librdkafka-1.4.4 && \
    ./configure && \
    make && \
    make install

WORKDIR /build/

COPY ./SocketServer/SocketServer.csproj ./SocketServer.csproj

RUN dotnet restore ./SocketServer.csproj

COPY ./SocketServer/ ./

RUN dotnet build -c ${BUILDCONFIG} -o out && dotnet publish ./SocketServer.csproj -c ${BUILDCONFIG} -o out /p:Version=${VERSION}

# --- interface stage ---
FROM node AS interfacebuild

COPY ./interface/package-lock.json /app/package-lock.json
COPY ./interface/package.json /app/package.json

WORKDIR /app/

# Installing dependencies (including dev dependencies)
RUN npm ci

COPY ./interface/ /app/

# Create a production build - this will generate a folder inside /app/build which can be served
RUN npm run build

# --- final stage ----
FROM ubuntu:20.04

LABEL Maintainer="Oliver Marco van Komen"

RUN apt-get update && \
    apt-get install -y wget curl && wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg --purge packages-microsoft-prod && dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install aspnetcore-runtime-3.1 -y && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs build-essential supervisor net-tools && \
    npm install -g serve

ENV SOCKETSERVER_HOME=/opt/socketserver
ENV INTERFACE_HOME=/opt/interface
ENV ASPNETCORE_ENVIRONMENT=Production
ENV CONF_FILES=/conf

# Copy necessary scripts
COPY scripts /tmp/
RUN chmod +x /tmp/*.sh && \
    mv /tmp/* /usr/bin && \
    rm -rf /tmp/*

COPY --from=socketbuild /build/out ${SOCKETSERVER_HOME}

# Kafka SASL directory (keytab is placed here)
RUN mkdir /sasl/ && mkdir ${CONF_FILES}
COPY ./configuration/ ${CONF_FILES}/

ENV KEYTAB_LOCATION=/sasl/dashboardi.service.keytab

# Installing dependencies for librdkafka
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt-get -y install krb5-user kstart \
    libsasl2-2 libsasl2-modules-gssapi-mit libsasl2-modules \
    && apt-get autoremove

# Replacing Nuget Confluent librdkafka build (with redist dependency) with the manually installed librdkafka library.
RUN rm -f ${SOCKETSERVER_HOME}/runtimes/linux-x64/native/librdkafka.so
COPY --from=socketbuild /usr/local/lib/librdkafka*.so* ${SOCKETSERVER_HOME}/runtimes/linux-x64/native/

COPY --from=interfacebuild /app/build ${INTERFACE_HOME}

COPY ./interface/.env .

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD [ "docker-entrypoint.sh" ]