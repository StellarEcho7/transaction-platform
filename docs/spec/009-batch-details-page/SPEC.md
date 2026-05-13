# 1. Summary

Реализация страницы деталей batch со списком транзакций и автоматическим обновлением статуса в реальном времени (polling).

---

# 2. User Story

**Кто:** Пользователь системы  
**Что:** Просмотр деталей конкретного batch со списком транзакций и их статусами  
**Зачем:** Детально отслеживать прогресс обработки транзакций внутри batch, видеть результаты анализа (region, riskScore, fraudFlags)

---

# 3. Acceptance Criteria

## Страница деталей batch (`/batches/[id]`)
- [ ] Tile (карточка) с информацией о batch:
  - name, status, total, processed, failed, source, createdAt
- [ ] Прогресс-бар (processed + failed / total)
- [ ] Кнопка "Назад" для возврата к списку
- [ ] Таблица транзакций batch с пагинацией
- [ ] Для каждой транзакции показываются:
  - transactionId
  - amount
  - currency
  - timestamp
  - merchant
  - category
  - status (PENDING, PROCESSING, COMPLETED, FAILED, FAILED_FINAL)
  - currentStep (VALIDATE, ENRICH, ANALYZE, null)
  - region
  - riskScore
  - fraudFlags
- [ ] Polling для обновления данных транзакций:
  - Запускать polling когда batch в статусе PROCESSING
  - Интервал опроса: 3-5 секунд
  - Прекращать polling когда batch в статусе COMPLETED или FAILED
- [ ] Loading states при загрузке данных
- [ ] Error states при ошибках API
- [ ] Пустое состояние (no transactions)

---

# 4. Scope

## MVP
- Реализация страницы деталей batch с Tile и прогресс-баром
- Таблица транзакций с пагинацией
- Polling для реального времени статусов транзакций
- Добавление GET эндпоинтов в `/api/batches/[id]` и `/api/batches/[id]/transactions`

## Out of scope
- Редактирование транзакций
- Удаление транзакций
- Экспорт данных
- Real-time через WebSockets

---

# 5. Technical Plan

## Backend (не требует изменений)
- `GET /batches/:id` уже существует в transaction-service
- `GET /batches/:id/transactions` уже существует

## Frontend

### API Route (добавить GET)
- `GET /api/batches/[id]` - проксирует `GET /batches/:id`
- `GET /api/batches/[id]/transactions` - проксирует `GET /batches/:id/transactions?page=&limit=`

### Server Actions (создать)
- `getBatch(id)` - получить детали batch
- `getBatchTransactions(batchId, page, limit)` - получить транзакции batch

### Страница
- `(app)/batches/[id]/page.tsx` - компонент деталей batch с транзакциями и polling

### Polling логика
```
const [batch, setBatch] = useState(null)
const [transactions, setTransactions] = useState([])

useEffect(() => {
  const interval = setInterval(async () => {
    const [newBatch, newTransactions] = await Promise.all([
      getBatch(id),
      getBatchTransactions(id, page, limit)
    ])
    setBatch(newBatch)
    setTransactions(newTransactions)

    // Остановить polling если batch завершен
    if (newBatch.status === 'COMPLETED' || newBatch.status === 'FAILED') {
      clearInterval(interval)
    }
  }, 3000)

  return () => clearInterval(interval)
}, [id, page, limit])
```

---

# 6. Contracts

## GET /api/batches/[id]

Request:
```
GET /api/batches/cm123abc
```

Response:
```json
{
  "id": "string",
  "name": "string",
  "status": "PROCESSING",
  "total": 100,
  "processed": 50,
  "failed": 10,
  "source": "MANUAL",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## GET /api/batches/[id]/transactions

Request:
```
GET /api/batches/cm123abc/transactions?page=1&limit=20
```

Response:
```json
{
  "data": [
    {
      "id": "string",
      "transactionId": "string",
      "userId": "string",
      "amount": 120.50,
      "currency": "USD",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "merchant": "Amazon",
      "category": "shopping",
      "status": "COMPLETED",
      "currentStep": null,
      "region": "US",
      "operationType": "online",
      "riskScore": 0.25,
      "fraudFlags": null,
      "batchId": "string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

# 7. Tasks

1. **Добавить GET эндпоинты в `/api/batches` route**
   - Добавить GET метод для деталей batch (`[id]`)
   - Добавить GET метод для транзакций batch (`[id]/transactions`)
   - Прокидывать query params в backend

2. **Создать Server Actions для работы с batch**
   - `getBatch(id)`
   - `getBatchTransactions(batchId, page, limit)`

3. **Реализовать страницу деталей batch (`/batches/[id]`)**
   - Tile с информацией о batch + прогресс-бар
   - Кнопка "Назад"
   - Таблица транзакций с пагинацией
   - Polling логика (запуск/остановка на основе статуса batch)
   - Loading/error/empty states

4. **Запустить quality-gate**
   - Проверить build, lint, types

---

# 8. Risk Notes

- **Polling может нагружать сервер** - интервал 3-5 секунд разумный для отдельного batch
- **Зависимость от backend API** — frontend полагается на существующие эндпоинты transaction-service
- **Пагинация** — нужно корректно обрабатывать pagination response от backend

---

# 9. Definition of Done

- [ ] Страница `/batches/[id]` отображает Tile с информацией о batch
- [ ] Прогресс-бар отображается корректно
- [ ] Таблица транзакций отображает все необходимые поля (включая region, riskScore, fraudFlags)
- [ ] Пагинация работает для транзакций
- [ ] Polling запускается при статусе PROCESSING
- [ ] Polling останавливается при статусе COMPLETED или FAILED
- [ ] Кнопка "Назад" работает корректно
- [ ] Loading и error states реализованы
- [ ] Пустые состояния обработаны
- [ ] quality-gate проходит (build, lint, types)