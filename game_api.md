## Получить рейтинг
`GET /api/player/rating?sortKey=<sortKey>&count=<num>`

### Если не указан один из параметров или `count` не больше нуля
`Response 400`

### Ответ
```json
[
  {
    "id": string,
    "login": string,
    "avatar": string|null,
    "statistics": {
      "last_score": int,
      "total_score": int,
      "max_score": int,
      "game_count": int,
      "win_count": int
    }
  },
  ...
]
```

## Сохранить одиночную игру
`POST /api/game/single/add`
```json
{
  "mode": int,
  "time": int,
  "score": int,
  "tetris_count": int,
  "figure_count": int,
  "filled_rows": int,
  "field_mode": int,
  "is_won": bool
}
```
### Если JSON не получен
```
Response 400
{
}
```
### Если пользователь не авторизован
```
Response 401
{
}
```
### Если запрос верный
```
Response 200
{
    "game": "<gameID>"
}
```