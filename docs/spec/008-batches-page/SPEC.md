# 1. Summary

Реализация страницы списка batchей с отображением прогресс-бара и автоматическим обновлением статуса в реальном времени (polling).

---

# 2. User Story

**Кто:** Пользователь системы  
**Что:** Просмотр списка batchей с отслеживанием прогресса обработки транзакций  
**Зачем:** Видеть актуальное состояние всех batchей в реальном времени

---

# 3. Acceptance Criteria

## Страница списка batchей (`/batches`)
- [ ] Отображается таблица/список всех batchей
- [ ] Показываются: name, status, total, processed, failed, createdAt
- [ ] Пагинация (по 10/20/50 записей)
- [ ] Фильтр по status (PROCESSING, COMPLETED, FAILED)
- [ ] Клик по batch → переход на страницу деталей
- [ ] Прогресс-бар для каждого batch (processed + failed / total)
- [ ] Polling для обновления данных:
  - Запускать polling когда есть хотя бы один batch со статусом PROCESSING
  - Интервал опроса: 3-5 секунд
  - Прекращать polling когда все batchи в статусе COMPLETED или FAILED (или нет PROCESSING)
- [ ] Loading states при загрузке данных
- [ ] Error states при ошибках API
- [ ] Пустое состояние (no batches)

---

# 4. Scope

## MVP
- Реализация страницы списка batchей с пагинацией и фильтром
- Прогресс-бар для каждого batch
- Polling для реального времени (только для списка, не для конкретного batch)
- Добавление GET эндпоинта в `/api/batches`

## Out of scope
- Страница деталей batch ( будет в задаче 009)
- Редактирование batchей
- Удаление batchей
- Real-time через WebSockets

---

# 5. Technical Plan

## Backend (не требует изменений)
- `GET /batches` уже существует в transaction-service

## Frontend

### API Route (добавить GET)
- `GET /api/batches` - проксирует `GET /batches?page=&limit=&status=`

### Server Actions (создать)
- `getBatches(page, limit, status)` - получить список batchей

### Страница
- `(app)/batches/page.tsx` - компонент списка batchей с polling

### Polling логика
```
const [batches, setBatches] = useState([])

useEffect(() => {
  const interval = setInterval(async () => {
    const newBatches = await getBatches(...)
    setBatches(newBatches)

    // Проверить есть ли PROCESSING
    const hasProcessing = newBatches.some(b => b.status === 'PROCESSING')
    if (!hasProcessing) clearInterval(interval)
  }, 3000)

  return () => clearInterval(interval)
}, [])
```

---

# 6. Contracts

## GET /api/batches

Request:
```
GET /api/batches?page=1&limit=10&status=PROCESSING
```

Response:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "status": "PROCESSING | COMPLETED | FAILED",
      "total": 100,
      "processed": 50,
      "failed": 10,
      "source": "MANUAL",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

# 7. Tasks

1. **Добавить GET эндпоинт в `/api/batches` route**
   - Добавить GET метод для списка batchей
   - Прокидывать query params в backend

2. **Создать Server Action для работы с batches**
   - `getBatches(page, limit, status)`

3. **Реализовать страницу списка batchей (`/batches`)**
   - Компонент таблицы batchей
   - Пагинация
   - Фильтр по status
   - Прогресс-бар
   - Polling логика (запуск/остановка на основе статусов)
   - Loading/error/empty states

4. **Запустить quality-gate**
   - Проверить build, lint, types

---

# 8. Risk Notes

- **Polling может нагружать сервер** - интервал 3-5 секунд разумный для небольшого количества пользователей
- **Нет рисков для существующих flows** — добавляются только GET эндпоинты, POST остается без изменений
- **Зависимость от backend API** — frontend полагается на существующий эндпоинт transaction-service

---

# 9. Definition of Done

- [ ] Страница `/batches` отображает список batchей с пагинацией и фильтром
- [ ] Прогресс-бар отображается корректно для каждого batch
- [ ] Polling запускается при наличии PROCESSING batchей
- [ ] Polling останавливается когда все batchи завершены (COMPLETED/FAILED)
- [ ] Loading и error states реализованы
- [ ] Пустые состояния обработаны
- [ ] quality-gate проходит (build, lint, types)
- [ ] Существующие flows (upload, create batch) работают без изменений