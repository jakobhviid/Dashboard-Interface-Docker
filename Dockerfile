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
#FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
FROM mcr.microsoft.com/dotnet/runtime:3.1

# Install ASP.NET Core
RUN aspnetcore_version=3.1.12 \
    && curl -SL --output aspnetcore.tar.gz https://dotnetcli.azureedge.net/dotnet/aspnetcore/Runtime/$aspnetcore_version/aspnetcore-runtime-$aspnetcore_version-linux-x64.tar.gz \
    && aspnetcore_sha512='e6d384a4c05bc6a693a85dc1da5f34e26449ad5d9414dee5f46a56805ac53eb304610be06d6a2a683f2d9e1447f316f47abea71fbfd6ee901dcc9da9d7c4e03b' \
    && echo "$aspnetcore_sha512  aspnetcore.tar.gz" | sha512sum -c - \
    && tar -ozxf aspnetcore.tar.gz -C /usr/share/dotnet ./shared/Microsoft.AspNetCore.App \
    && rm aspnetcore.tar.gz

RUN apt-get update && \
    apt-get install -y wget curl && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs build-essential supervisor net-tools

ENV SOCKETSERVER_HOME=/opt/socketserver
ENV INTERFACE_HOME=/usr/share/nginx/html/
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

# nginx serving
RUN export DEBIAN_FRONTEND=noninteractive && apt-get install nginx -y

# nginx config
RUN rm -rf /etc/nginx/conf.d
COPY ./nginx /etc/nginx/

# serving the static files from interface build into nginx html folder
COPY --from=interfacebuild /app/build ${INTERFACE_HOME}

WORKDIR ${INTERFACE_HOME}

# Runtime environment fix (by serving with nginx)
COPY ./env.sh ./
COPY ./.env ./

RUN chmod +x ./env.sh

HEALTHCHECK --interval=60s --timeout=20s --start-period=25s --retries=3 CMD [ "healthcheck.sh" ]

EXPOSE 80

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD [ "docker-entrypoint.sh" ]