const WebSocket = require('ws');

initWebSockets();

function initWebSockets() {
  const address = 'ws://localhost:8545/ws/ndm';
  const socket = new WebSocket(address);
  console.log(`Connecting to WebSockets @ ${address}...`);
  socket.onmessage = event => console.log(event.data);
  socket.onopen = event => {
    switch (socket.readyState) {
      case WebSocket.OPEN:
          console.log(`Connected to WebSockets @ ${address}`);
          break;
    }
  };
}
