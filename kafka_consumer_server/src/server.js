const server = require("http").createServer();
const io = require("socket.io")(server);
const {
  GENERAL_SOCKET_ENDPOINT,
  RESSOURCE_USAGE_ENDPOINT
} = require("../../interface/src/util/socketEndpoints");
const { GENEREL_INFO_TOPIC, STATS_TOPIC } = require("./topics");

io.on("connection", socket => {
  console.log("Client connected!");
});
server.listen(5000, () => {
  console.log("Server listening on port 5000");
});

const { Kafka } = require("kafkajs");

const kafkaUrls = ["kafka2.cfei.dk:9093"];

const kafka = new Kafka({
  brokers: kafkaUrls
});

const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: GENEREL_INFO_TOPIC });
  await consumer.subscribe({ topic: RESSOURCE_USAGE_ENDPOINT });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      switch (topic) {
        case GENEREL_INFO_TOPIC:
          io.emit(
            GENERAL_SOCKET_ENDPOINT,
            JSON.parse(JSON.parse(message.value.toString()))
          );
          break;
        case STATS_TOPIC:
          io.emit(
            RESSOURCE_USAGE_ENDPOINT,
            JSON.parse(JSON.parse(message.value.toString()))
          );
          break;
      }
    }
  });
};

run().catch(console.error);
