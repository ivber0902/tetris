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
    "background": "/images/bg.png",
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
    "background": "/images/bg.png",
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
      "background": "/images/bg.png",
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
      "background": "/images/bg.png",
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