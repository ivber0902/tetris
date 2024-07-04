const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 9000 });
let clients = [];

const arra = {
    id: 'kjhgnflhfwwv-ae-bvrshdtrhj-drh',
    host_id: 11,
    players: [ 11 ],
    settings: {
      music: '/audio/Korobeiniki.wav',
      background: '/images/bg.png',
      difficulty: 1,
      play_field: { width: 10, height: 20 }
    }
  };

server.on('message', message => {
    console.log("her");
});


server.on('connection', socket => {
    clients.push(socket);
    console.log('New client connected. Total clients: ', clients.length);
    socket.on('close', () => {
        clients = clients.filter(client => client !== socket);
        console.log('Client disconnected. Total clients: ', clients.length);
    });
    let clientCount = clients.length;
    
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(arra));
        }
    });  

});

