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