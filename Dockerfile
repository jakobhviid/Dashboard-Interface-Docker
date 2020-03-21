FROM ubuntu:18.04

LABEL maintainer="Oliver Marco van Komen (oma@mmmi.sdu.dk)"

RUN apt update && \
    apt install -y jq curl python3 python3-pip && \
    pip3 install kafka-python

# Copy necessary scripts + configuration
COPY scripts /tmp/
RUN chmod +x /tmp/*.sh && \
    mv /tmp/* /usr/bin && \
    rm -rf /tmp/*

# ENTRYPOINT [ "docker-entrypoint.sh" ]

CMD [ "docker-entrypoint.sh", "get_status"]