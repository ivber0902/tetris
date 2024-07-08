# Подключение
Всегда подключаемся по /lobby
Затем посылаем запрос подключения
```json
{
  "type": "connect",
  "connection": {
    "player_id": 1
  }
}
```
Чтобы подключиться к уже существующему лобби, обращаемся к /lobby?lobby=<id>


# Обновление (На данный момент необходимо отправлять полную структуру Lobby, Как сверху)
```json
{
  "type": "update",
  "updates": // JSON лобби
}
```

# Получение
```json
{
  "type": "get"
}
```

# Отключение
```json
{
  "type": "disconnect",
  "connection": {
    "player_id": 1
  }
}
```

# Начало игры
```json
{
  "type": "run"
}
```

# В ответ он всегда возвращает JSON с информацией о лобби
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
