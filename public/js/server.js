const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 9000 });
let clients = [];

server.on('connection', socket => {
    clients.push(socket);
    console.log('New client connected. Total clients: ', clients.length);
    let clientCount = clients.length;
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(clientCount));
        }
    });   
    socket.on('message', message => {
        console.log("her")
        const data = JSON.parse(message);
        if (data.type === 'newUser') {
            userName = data.name;
            console.log(userName);
        }
    });
});



server.on('close', socket => {
    console.log('New client connected. Total clients: ', clients.length);
    socket.on('close', () => {
        clients = clients.filter(client => client !== socket);
        console.log('Client disconnected. Total clients: ', clients.length);
    });
    let clientCount = clients.length;
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(clientCount));
        }
    });   
});

