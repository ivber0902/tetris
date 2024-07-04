const connection = new WebSocket("ws://localhost:9000");
let a = 1;
// если соединение успешно установлено
connection.onopen = (event) => {  
    console.log("Hello METANIT.COM");
    
};
// если возникла ошибка
connection.onerror = (error) => {
    console.log(`WebSocket Error: ${error}`);
};
// если соединение закрыто
connection.onclose = (event) => {
    console.log("Connection closed");
};
// получаем ответ сервера
connection.onmessage = (event) =>{ 
    console.log("Server response:", event.data);
};
connection.onmessage = (event) =>{ 
    let count = JSON.parse(event.data);
    console.log("her");
    console.log(count);
    id = count.players[0];
    console.log(id);

    async function sendResult(id) {
        let response = await fetch('/api/found', {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        });
        console.log(response);
    }

    sendResult(id).then(() => {});
};


