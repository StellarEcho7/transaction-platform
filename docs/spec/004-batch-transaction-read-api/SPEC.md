# Feature Plan: Read API Endpoints for Batches and Transactions

## 1. Summary

Добавить в transaction-service REST API эндпоинты для чтения данных:
- GET /batches — список всех батчей
- GET /batches/:id — детали батча с прогрессом
- GET /batches/:id/transactions — транзакции конкретного батча
- GET /transactions/:id — конкретная транзакция

## 2. User Story

**Кто**: Frontend разработчик / UI приложение
**Что**: Нужны API endpoints для получения данных о батчах и транзакциях
**Почему**: UI должен отображать прогресс обработки и список транзакций (README строка 178)

## 3. Acceptance Criteria

- [ ] GET /batches возвращает массив всех батчей с полями: id, name, status, total, processed, failed, createdAt
- [ ] GET /batches/:id возвращает батч с транзакциями (пагинированными)
- [ ] GET /batches/:id/transactions возвращает массив транзакций батча с фильтрацией по status
- [ ] GET /transactions/:id возвращает полную информацию о транзакции
- [ ] Поддержка query params: page, limit для пагинации; status для фильтрации

## 4. Scope (MVP / Out of scope)

**MVP**:
- Все 4 GET эндпоинта
- Пагинация (page, limit)
- Фильтрация по status

**Out of scope**:
- POST/PUT/DELETE (только чтение)
- Сортировка, расширенная фильтрация

## 5. Technical Plan

### BatchController — новые эндпоинты
- `GET /batches` — найти все батчи
- `GET /batches/:id` — батч с транзакциями
- `GET /batches/:id/transactions` — транзакции батча

### BatchService — расширить
- `findAll(query)` — пагинированный список батчей
- `findById(id)` — батч с транзакциями

### TransactionController — создать
- `GET /transactions/:id` — транзакция по ID

### TransactionService — расширить
- `findById(id)` — найти транзакцию
- `findByBatchId(batchId, query)` — транзакции батча

### DTOs
- `BatchListQueryDto` (page, limit, status)
- `BatchDetailDto` (включает transactions)
- `TransactionListQueryDto` (page, limit, status)
- `TransactionResponseDto`
- `PaginationResponseDto`

## 6. Contracts

### GET /batches
**Request**: `GET /batches?page=1&limit=10&status=PROCESSING`
**Response**:
```json
{
  "data": [{ "id": "batch_123", "name": "...", "status": "PROCESSING", "total": 100, "processed": 45, "failed": 5, "createdAt": "..." }],
  "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

### GET /batches/:id
**Request**: `GET /batches/:id?page=1&limit=20`
**Response**: Batch + transactions array + pagination

### GET /batches/:id/transactions
**Request**: `GET /batches/:id/transactions?page=1&limit=20&status=PENDING`
**Response**: Transactions array + pagination

### GET /transactions/:id
**Request**: `GET /transactions/:id`
**Response**: Full transaction object with all fields

## 7. Tasks

1. **Add DTOs** — BatchListQueryDto, TransactionListQueryDto, PaginationResponseDto, BatchDetailDto, TransactionResponseDto
2. **Extend BatchService** — findAll(), findById() с пагинацией
3. **Extend TransactionService** — findById(), findByBatchId()
4. **Add BatchController endpoints** — GET /batches, /batches/:id, /batches/:id/transactions
5. **Create TransactionController** — GET /transactions/:id
6. **Run quality-gate** — build, lint, typecheck

## 8. Risk Notes

No significant risks — read-only endpoints, no schema changes.

## 9. Definition of Done

- All 4 endpoints exist and return data matching contracts
- Build passes
- Types correct