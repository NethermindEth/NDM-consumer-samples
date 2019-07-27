const kafka = require('kafka-node');
const WebSocket = require('ws');
let kafkaConnected = false;

init();

function init() {
  const kafkaProducer = initKafka();
  initWebSockets(kafkaProducer);
}

function initKafka() {
  const address = 'localhost:9092';
  console.log(`Connecting to Kafka @ ${address}...`);
  const client = new kafka.KafkaClient(address);
  client.on('error', function(err) {
    kafkaConnected = false;
    console.error(err);
    throw err;
  });

  const producer = new kafka.Producer(client);
  producer.on('ready', async function() {
    console.log(`Connected to Kafka @ ${address}`);
    kafkaConnected = true;
  });

  return producer;
}

function initWebSockets(kafkaProducer) {
  const address = 'ws://localhost:8545/ws/ndm';
  const socket = new WebSocket(address);
  const kafkaTopic = 'nethermind';
  console.log(`Connecting to WebSockets @ ${address}...`);
  socket.onmessage = event => {
    if (!kafkaConnected) {
      return;
    }
    let payload = [{
      topic: kafkaTopic,
      messages: event.data
    }];
    kafkaProducer.send(payload, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Data was sent to Kafka topic: ${kafkaTopic}`);
      }
    });
  }
  socket.onopen = event => {
    switch (socket.readyState) {
      case WebSocket.OPEN:
          console.log(`Connected to WebSockets @ ${address}`);
          break;
    }
  };
}