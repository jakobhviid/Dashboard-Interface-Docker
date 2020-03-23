const server = require("http").createServer();
const io = require("socket.io")(server);
io.on("connection", socket => {
  console.log("Client connected!");
});
server.listen(5000, () => {
  console.log("Server listening on port 5000");
});

const { Kafka } = require("kafkajs");

const kafkaUrls = ["kafka2.cfei.dk:9093"];
const kafkaTopic = "test";

const kafka = new Kafka({
  brokers: kafkaUrls
});

const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: kafkaTopic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      io.emit("ContainerUpdate", message);
    }
  });
};

run().catch(console.error);
