# Лобби
## ⇒ Подключение
Всегда подключаемся по `/game`
Затем посылаем запрос подключения
```json
{
  "type": "connect",
  "connection": {
    "player_id": 1
  }
}
```
Чтобы подключиться к уже существующему лобби, обращаемся к /game?game=<id>


## ⇒ Обновление (На данный момент необходимо отправлять полную структуру LobbyInfo, Как сверху)
```json
{
  "type": "update",
  "updates": // JSON лобби
}
```

## ⇒ Получение
```json
{
  "type": "get"
}
```

## ⇒ Отключение
```json
{
  "type": "disconnect",
  "connection": {
    "player_id": 1
  }
}
```

## ⇐ В ответ он всегда возвращает JSON с информацией о лобби
```json
{
  "ID": "dc301596-1fde-469a-991f-de8df780ccb5",
  "players": [123],
  "settings": {
    "music": "/audio/Korobeiniki.wav",
    "background": "https://i.postimg.cc/1zyHTmtK/bg.png",
    "difficulty": 1,
    "play_field": {
      "width": 10,
      "height": 20
    }
  }
}
```


## ⇒ Начало игры
```json
{
  "type": "run"
}
```
### ⇐ Ответ

```json
{
  "ID": "dc301596-1fde-469a-991f-de8df780ccb5",
  "players": [123],
  "settings": {
    "music": "/audio/Korobeiniki.wav",
    "background": "https://i.postimg.cc/1zyHTmtK/bg.png",
    "difficulty": 1,
    "play_field": {
      "width": 10,
      "height": 20
    }
  },
  "game_run": true
}
```

# Список лобби
На сокет `/game/list` происходит подключение.

После этого при каждом новом лобби с сервера будет приходить данный JSON

```json
{
  "type": "new",
  "game": {
    "ID": "dc301596-1fde-469a-991f-de8df780ccb5",
    "players": [123],
    "settings": {
      "music": "/audio/Korobeiniki.wav",
      "background": "https://i.postimg.cc/1zyHTmtK/bg.png",
      "difficulty": 1,
      "play_field": {
        "width": 10,
        "height": 20
      }
    }
  }
}
```
а при каждом новом лобби с сервера будет приходить данный JSON
```json
{
  "type": "update",
  "game": {
    "ID": "dc301596-1fde-469a-991f-de8df780ccb5",
    "players": [123, 456],
    "settings": {
      "music": "/audio/Korobeiniki.wav",
      "background": "https://i.postimg.cc/1zyHTmtK/bg.png",
      "difficulty": 1,
      "play_field": {
        "width": 10,
        "height": 20
      }
    }
  }
}
```

## Получить всё
При отправке сообщения `get`, сервер последовательно отправит все лобби

# Мультиплеер
Путь: `/game`
В GET-параметр передаём `lobby=<roomID>`

## Структура State
```json lines
{
  id: 1,// ID игрока
  play_field: [], // Матрица
  buffer: 3,
  score: 12345,
  figure_count: 234,
  current_figure: {
    matrix: [],
    pos: {
      x: 3,
      y: 1
    }
  },
  game_over: false, 
  started: true
}
```

## Получение конфигурации (настроек лобби)
### Запрос
```json
{
  "type": "config"
}
```

### Ответ
```json
{
  "type": "config",
  "config": ...,// Структура лобби
  "figures": [] // Все фигуры
}
```
## Обновление
### Запрос
```json
{
  "type": "update",
  "update": // State
}
```
### Ответ
```json
{
  "type": "update",
  "state": // State
}
```

## Начать игру (От хоста)
### Запрос
```json
{
  "type": "start"
}
```
### Ответ
Отправляет всем игрокам
```json
{
  "type": "start"
}
```

## Получить все поля
### Запрос
```json
{
  "type": "all"
}
```
### Ответ
Возвращает последовательно все поля
```json
{
  "type": "state",
  "state": // State
}
```

## Установка фигуры
### Запрос
Подсчитывает количество поставленных фигур
```json
{
   "type": "set"
}
```

## Отправка линий
### Запрос
```json
{
  "type": "clear_rows",
  "info": 2 // Количество очищенных линий
}
```

### Ответ
Случайному игроку
```json
{
  "type": "add_rows",
  "info": {
    "count": 2,
    "empty_column": 4 // Номер пустой колонки
  }
}
```

## Окончание игры
### Запрос
```json
{
  "type": "game_over"
}
```

### Ответ
В ответ присылается [обновление](#обновление)

### Завершение игры
Если все игроки отправили данный запрос, возвращается:
```json
{
  "type": "game_over"
}
```



# Результаты
`GET /game/results?lobby=<LobbyID>`
### Ответ
```json
[
  {
    "player_id": 1,
    "score": 1500
  },
  {
    "player_id": 2,
    "score": 1700
  },
  {
    "player_id": 3,
    "score": 2000
  }
]
```
