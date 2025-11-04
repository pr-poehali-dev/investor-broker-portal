# API Документация - Rielvestor Platform

## 🚀 Обзор

Серверная архитектура платформы включает:
- **PostgreSQL база данных** с 4 таблицами
- **REST API** на Python 3.11
- **TypeScript API клиент** для frontend
- **Автоматические миграции** БД

## 📊 База данных

### Таблицы

#### 1. `users` - Пользователи
```sql
id              SERIAL PRIMARY KEY
email           TEXT NOT NULL UNIQUE
name            TEXT NOT NULL
role            TEXT NOT NULL (investor | broker)
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### 2. `investment_objects` - Объекты недвижимости
```sql
id              SERIAL PRIMARY KEY
broker_id       INTEGER REFERENCES users(id)
title           TEXT NOT NULL
city            TEXT NOT NULL
address         TEXT NOT NULL
property_type   TEXT NOT NULL (flats | apartments | commercial | country)
area            NUMERIC NOT NULL
price           NUMERIC NOT NULL
yield_percent   NUMERIC NOT NULL
payback_years   NUMERIC NOT NULL
description     TEXT
images          TEXT[]
status          TEXT DEFAULT 'available' (available | reserved | sold)
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### 3. `favorites` - Избранное пользователей
```sql
id              SERIAL PRIMARY KEY
user_id         INTEGER REFERENCES users(id)
object_id       INTEGER REFERENCES investment_objects(id)
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
UNIQUE(user_id, object_id)
```

#### 4. `inquiries` - Заявки на консультацию
```sql
id              SERIAL PRIMARY KEY
object_id       INTEGER REFERENCES investment_objects(id)
user_id         INTEGER REFERENCES users(id)
name            TEXT NOT NULL
email           TEXT NOT NULL
phone           TEXT NOT NULL
message         TEXT
status          TEXT DEFAULT 'new' (new | contacted | closed)
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## 🔌 REST API

### Base URL
```
https://functions.poehali.dev/fc00dc4e-18bf-4893-bb9d-331e8abda973
```

### Все запросы используют query параметр `resource`

---

## 👤 Users API

### GET - Получить всех пользователей
```http
GET /?resource=users
```

**Response:**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "investor",
    "created_at": "2025-11-04T20:27:28.834179"
  }
]
```

### GET - Получить пользователя по email
```http
GET /?resource=users&email=user@example.com
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "investor",
  "created_at": "2025-11-04T20:27:28.834179"
}
```

### GET - Получить пользователя по ID
```http
GET /?resource=users&id=1
```

### POST - Создать пользователя
```http
POST /?resource=users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "role": "broker"
}
```

**Response:**
```json
{
  "id": 2,
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "role": "broker",
  "created_at": "2025-11-04T20:30:15.123456"
}
```

### PUT - Обновить пользователя
```http
PUT /?resource=users
Content-Type: application/json

{
  "id": 1,
  "name": "John Updated"
}
```

---

## 🏢 Objects API

### GET - Получить все объекты
```http
GET /?resource=objects
```

**Фильтры (опционально):**
- `city` - город
- `property_type` - тип (flats, apartments, commercial, country)
- `status` - статус (available, reserved, sold)
- `min_price` - минимальная цена
- `max_price` - максимальная цена
- `min_yield` - минимальная доходность
- `max_yield` - максимальная доходность

**Пример с фильтрами:**
```http
GET /?resource=objects&city=Москва&property_type=apartments&min_yield=10&max_price=5000000
```

**Response:**
```json
[
  {
    "id": 1,
    "broker_id": 2,
    "title": "Апартаменты в центре",
    "city": "Москва",
    "address": "ул. Тверская, 1",
    "property_type": "apartments",
    "area": 45.0,
    "price": 5000000.0,
    "yield_percent": 12.0,
    "payback_years": 7.0,
    "description": "Отличные апартаменты",
    "images": ["https://example.com/image.jpg"],
    "status": "available",
    "created_at": "2025-11-04T20:35:00.000000"
  }
]
```

### GET - Получить объект по ID
```http
GET /?resource=objects&id=1
```

### POST - Создать объект
```http
POST /?resource=objects
Content-Type: application/json

{
  "broker_id": 2,
  "title": "Студия в ЖК Престиж",
  "city": "Москва",
  "address": "ул. Ленина, 15",
  "property_type": "flats",
  "area": 30,
  "price": 3200000,
  "yield_percent": 11.5,
  "payback_years": 8,
  "description": "Компактная студия с ремонтом",
  "images": ["https://unsplash.com/photo1.jpg"],
  "status": "available"
}
```

**Response:**
```json
{
  "id": 5,
  "broker_id": 2,
  "title": "Студия в ЖК Престиж",
  ...
  "created_at": "2025-11-04T20:40:00.000000"
}
```

### PUT - Обновить объект
```http
PUT /?resource=objects
Content-Type: application/json

{
  "id": 1,
  "status": "reserved",
  "price": 5200000
}
```

**Можно обновить:** `status`, `price`, `yield_percent`, `description`

---

## ⭐ Favorites API

### GET - Получить избранное пользователя
```http
GET /?resource=favorites&user_id=1
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "object_id": 3,
    "created_at": "2025-11-04T20:45:00.000000",
    "object": {
      "title": "Апартаменты у моря",
      "city": "Сочи",
      "price": 4500000.0,
      "yield_percent": 14.0,
      "images": ["https://example.com/image.jpg"]
    }
  }
]
```

### POST - Добавить в избранное
```http
POST /?resource=favorites
Content-Type: application/json

{
  "user_id": 1,
  "object_id": 3
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "object_id": 3,
  "created_at": "2025-11-04T20:45:00.000000"
}
```

### DELETE - Удалить из избранного
```http
DELETE /?resource=favorites&user_id=1&object_id=3
```

**Response:**
```json
{
  "message": "Favorite removed",
  "id": 1
}
```

---

## 💻 TypeScript API Client

### Использование в React компонентах

```typescript
import { api } from '@/services/api';

// Получить объекты
const objects = await api.getObjects({
  city: 'Москва',
  min_yield: 10,
  max_price: 5000000
});

// Создать пользователя
const user = await api.createUser({
  email: 'user@example.com',
  name: 'John Doe',
  role: 'investor'
});

// Добавить в избранное
const favorite = await api.addToFavorites(userId, objectId);

// Получить избранное
const favorites = await api.getFavorites(userId);

// Создать объект
const newObject = await api.createObject({
  broker_id: brokerId,
  title: 'Апартаменты',
  city: 'Москва',
  address: 'ул. Тверская, 1',
  property_type: 'apartments',
  area: 45,
  price: 5000000,
  yield_percent: 12,
  payback_years: 7,
  status: 'available'
});

// Обновить статус объекта
const updated = await api.updateObject(objectId, {
  status: 'reserved'
});
```

### Пример React Hook

```typescript
import { useState, useEffect } from 'react';
import { api, InvestmentObjectDB } from '@/services/api';

export function useObjects(filters?: any) {
  const [objects, setObjects] = useState<InvestmentObjectDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        setLoading(true);
        const data = await api.getObjects(filters);
        setObjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [JSON.stringify(filters)]);

  return { objects, loading, error };
}
```

---

## 🔐 Безопасность

### CORS
API поддерживает CORS для всех origins:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, X-User-Id, X-Auth-Token`

### Аутентификация
В будущих версиях будет добавлена:
- JWT токены
- OAuth 2.0
- Роли и права доступа

---

## 📈 Преимущества серверной архитектуры

✅ **Синхронизация данных** - работа на всех устройствах  
✅ **Безопасность** - данные в PostgreSQL с бэкапами  
✅ **Масштабируемость** - легко добавлять новые таблицы  
✅ **Производительность** - индексы для быстрых запросов  
✅ **Надежность** - автоматическое восстановление  

---

## 🛠️ Миграции БД

Все изменения схемы БД через миграции в `db_migrations/`:

```
db_migrations/
├── V0001__initial_schema.sql
├── V0002__add_brokers.sql
├── V0003__add_properties.sql
├── V0004__add_interactions.sql
└── V0005__create_main_tables.sql
```

### Применение миграций

Миграции применяются автоматически через инструмент `migrate_db`.

---

## 📊 Мониторинг

### Проверка здоровья API
```bash
curl https://functions.poehali.dev/fc00dc4e-18bf-4893-bb9d-331e8abda973?resource=objects
```

### Логи
Доступны через `get_logs` tool:
```
get_logs(source="backend/api")
```

---

## 🚀 Развертывание

Backend функция автоматически деплоится через `sync_backend`:
1. Изменяем код в `backend/api/`
2. Запускаем `sync_backend`
3. Функция обновляется автоматически
4. Тесты проверяют работоспособность

---

## 📝 Примеры использования

### Регистрация нового пользователя
```typescript
async function registerUser(email: string, name: string, role: 'investor' | 'broker') {
  try {
    const user = await api.createUser({ email, name, role });
    console.log('User created:', user);
    return user;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}
```

### Поиск объектов с фильтрами
```typescript
async function searchObjects() {
  const filters = {
    city: 'Москва',
    property_type: 'apartments',
    min_yield: 10,
    max_price: 5000000,
    status: 'available'
  };

  const objects = await api.getObjects(filters);
  return objects;
}
```

### Добавление в избранное
```typescript
async function toggleFavorite(userId: number, objectId: number, isFavorite: boolean) {
  if (isFavorite) {
    await api.removeFromFavorites(userId, objectId);
  } else {
    await api.addToFavorites(userId, objectId);
  }
}
```

---

## 💡 Best Practices

1. **Всегда обрабатывайте ошибки** в try-catch блоках
2. **Используйте TypeScript типы** из `api.ts`
3. **Кэшируйте результаты** в React state или SWR
4. **Валидируйте данные** перед отправкой на сервер
5. **Используйте React Query** для автоматической синхронизации

---

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте логи: `get_logs(source="backend/api")`
2. Проверьте структуру БД: `get_db_info(level="table", table_name="...")`
3. Обратитесь к документации API выше

---

**Готово!** 🎉 Ваша платформа теперь работает с полноценной серверной архитектурой.
