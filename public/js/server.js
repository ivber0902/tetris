const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 9000 });
let clients = [];

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

    
});
server.on('connection', socket => {
    let clientCount = clients.length;
    clients.forEach(client => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(clientCount));
        }
    });


});



