const server = require("http").createServer();
const io = require("socket.io")(server);
const {
  GENERAL_SOCKET_ENDPOINT,
  RESSOURCE_USAGE_ENDPOINT,
  NEWEST_OVERVIEW_DATA_REQUEST,
  NEWEST_STATS_DATA_REQUEST,
} = require("../../interface/src/util/socketEvents");
const { GENERAL_INFO_TOPIC, STATS_TOPIC } = require("./topics");

const { Kafka } = require("kafkajs");

// const kafkaUrls = process.env.KAFKA_URLS.split(",");
const kafkaUrls = [
  "kafka1.cfei.dk:9092",
  "kafka2.cfei.dk:9092",
  "kafka3.cfei.dk:9092",
];

const kafka = new Kafka({
  brokers: kafkaUrls,
});

const consumer = kafka.consumer({ groupId: "info-group" });

let latest_general_info_message = {};
let latest_stats_info_message = {};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: GENERAL_INFO_TOPIC });
  await consumer.subscribe({ topic: STATS_TOPIC });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      switch (topic) {
        case GENERAL_INFO_TOPIC:
          const generalInfoMessageParsed = JSON.parse(
            JSON.parse(message.value.toString())
          );
          for (const container of generalInfoMessageParsed.containers) {
            container["update_time"] = new Date();
          }

          latest_general_info_message[
            generalInfoMessageParsed.servername
          ] = generalInfoMessageParsed;

          io.emit(GENERAL_SOCKET_ENDPOINT, generalInfoMessageParsed);
          break;
        case STATS_TOPIC:
          const statsMessageParsed = JSON.parse(
            JSON.parse(message.value.toString())
          );
          for (const container of statsMessageParsed.containers) {
            container["update_time"] = new Date();
          }
          latest_stats_info_message[
            statsMessageParsed.servername
          ] = statsMessageParsed;
          io.emit(RESSOURCE_USAGE_ENDPOINT, statsMessageParsed);
          break;
      }
      latestOffSet = message.offset;
    },
  });
};

io.on("connection", (socket) => {
  socket.on(NEWEST_OVERVIEW_DATA_REQUEST, () => {
    for (const latestServerInfo of Object.keys(latest_general_info_message)) {
      io.emit(
        GENERAL_SOCKET_ENDPOINT,
        latest_general_info_message[latestServerInfo]
      );
    }
  });
  socket.on(NEWEST_STATS_DATA_REQUEST, () => {
    for (const lastestServerInfo of Object.keys(latest_stats_info_message)) {
      io.emit(
        RESSOURCE_USAGE_ENDPOINT,
        latest_stats_info_message[lastestServerInfo]
      );
    }
  });
});

const port = 5001;
server.listen(port, () => {
  console.log("Server listening on port " + port);
});

run().catch(console.error);
