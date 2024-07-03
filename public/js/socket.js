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
    document.querySelector('.players__count').innerHTML = event.data;
    let count = event.data;
    connection.send("her");
};


