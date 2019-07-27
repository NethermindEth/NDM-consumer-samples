const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync('./Nethermind.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

initGrpc();

function initGrpc() {
  const address = 'localhost:50000';
  const deadline = new Date().getTime() + 60000;
  const client = new proto.Nethermind.Grpc.NethermindService(address, grpc.credentials.createInsecure());
  console.log(`Connecting to gRPC @ ${address}...`);
  client.waitForReady(deadline, err => {
    if (err) {
      console.log(`Couldn't connect to gRPC @ ${address}`, err);
      process.exit(1);
    }
    console.log(`Connected to gRPC @ ${address}`);
    var call = client.subscribe({args: []});
    call.on('data', function(data ) {
      console.log(data);
    });
  });
}