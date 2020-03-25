const server = require("http").createServer();
const io = require("socket.io")(server);
const {
  GENERAL_SOCKET_ENDPOINT,
  RESSOURCE_USAGE_ENDPOINT,
  NEWEST_OVERVIEW_DATA_REQUEST,
  NEWEST_STATS_DATA_REQUEST
} = require("../../interface/src/util/socketEvents");
const { GENEREL_INFO_TOPIC, STATS_TOPIC } = require("./topics");

const { Kafka } = require("kafkajs");

const kafkaUrls = ["kafka2.cfei.dk:9093"];

const kafka = new Kafka({
  brokers: kafkaUrls
});

const consumer = kafka.consumer({ groupId: "info-group" });

let latest_general_info_message = null;
let latest_stats_info_message = null;

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: GENEREL_INFO_TOPIC });
  await consumer.subscribe({ topic: STATS_TOPIC });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // console.log(JSON.parse(JSON.parse(message.value.toString())));
      switch (topic) {
        case GENEREL_INFO_TOPIC:
          latest_general_info_message = JSON.parse(
            JSON.parse(message.value.toString())
          );

          io.emit(GENERAL_SOCKET_ENDPOINT, latest_general_info_message);
          break;
        case STATS_TOPIC:
          latest_stats_info_message = JSON.parse(
            JSON.parse(message.value.toString())
          );
          io.emit(RESSOURCE_USAGE_ENDPOINT, latest_stats_info_message);
          break;
      }
      latestOffSet = message.offset;
    }
  });
};

io.on("connection", socket => {
  socket.on(NEWEST_OVERVIEW_DATA_REQUEST, () => {
    io.emit(GENERAL_SOCKET_ENDPOINT, latest_general_info_message);
  });
  socket.on(NEWEST_STATS_DATA_REQUEST, () => {
    io.emit(RESSOURCE_USAGE_ENDPOINT, latest_stats_info_message);
  });
});

server.listen(5000, () => {
  console.log("Server listening on port 5000");
});

run().catch(console.error);
