# Руководство по интеграции API - Rielvestor Platform

## ✅ Выполненная интеграция

Платформа теперь работает с полноценной серверной архитектурой:

### 🎯 Интегрированные компоненты:

#### 1. **ObjectsPage** (`src/components/objects/ObjectsPage.tsx`)
✅ Загрузка объектов из PostgreSQL  
✅ Объединение с локальными данными  
✅ Индикаторы загрузки и ошибок  
✅ Автоматическая синхронизация  

**Что изменилось:**
- Объекты загружаются из БД через `api.getObjects()`
- Добавлены состояния `loading` и `error`
- Локальные объекты объединяются с серверными
- Удален setInterval для экономии ресурсов

#### 2. **ObjectDetailPage** (`src/components/objects/ObjectDetailPage.tsx`)
✅ Загрузка деталей объекта из API  
✅ Интеграция избранного с API  
✅ Обработка ошибок загрузки  
✅ Fallback на локальные данные  

**Что изменилось:**
- Детали объекта загружаются через `api.getObjectById()`
- Избранное синхронизируется с сервером
- Добавлены индикаторы загрузки
- Graceful degradation при ошибках

#### 3. **BrokerObjectsManager** (`src/components/broker/BrokerObjectsManager.tsx`)
✅ Загрузка объектов брокера  
✅ Обновление статусов через API  
✅ Синхронизация с БД  
✅ Индикаторы состояния  

**Что изменилось:**
- Объекты загружаются из БД
- Изменение статуса через `api.updateObject()`
- Локальные изменения синхронизируются с сервером

#### 4. **Система избранного**
✅ Сохранение в БД  
✅ API для добавления/удаления  
✅ Синхронизация между устройствами  
✅ Fallback на localStorage  

**Что изменилось:**
- Избранное сохраняется в таблице `favorites`
- Доступ через `api.addToFavorites()` и `api.removeFromFavorites()`

#### 5. **Система авторизации** (`src/contexts/AuthContext.tsx`)
✅ React Context для управления пользователем  
✅ Автоматическая регистрация в БД  
✅ Переключение ролей  
✅ Персистентность состояния  

**Новые возможности:**
- `useAuth()` hook для доступа к пользователю
- Автоматическое создание пользователя при входе
- Синхронизация с БД при загрузке

---

## 🔄 Как работает интеграция

### Схема работы:

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend  │────────▶│   REST API   │────────▶│  PostgreSQL  │
│   (React)   │◀────────│   (Python)   │◀────────│      DB      │
└─────────────┘         └──────────────┘         └──────────────┘
       │
       │ Fallback
       ▼
┌─────────────┐
│ localStorage│
└─────────────┘
```

### Принцип работы:

1. **Primary source**: API + PostgreSQL
2. **Fallback**: localStorage при ошибках
3. **Hybrid**: Объединение серверных и локальных данных
4. **Graceful degradation**: Приложение работает даже при сбоях API

---

## 📦 Структура данных

### Конвертация типов

**БД → Frontend:**
```typescript
InvestmentObjectDB → InvestmentObject
{
  property_type: 'apartments',  // БД
  yield_percent: 12,
  payback_years: 7
}
→
{
  type: 'apartments',           // Frontend
  yield: 12,
  paybackPeriod: 7
}
```

### Маппинг полей:

| БД Field | Frontend Field | Тип |
|----------|----------------|-----|
| `property_type` | `type` | string |
| `yield_percent` | `yield` | number |
| `payback_years` | `paybackPeriod` | number |
| `created_at` | `createdAt` | string |
| `broker_id` | `brokerId` | number |

---

## 🚀 Использование в компонентах

### 1. Загрузка объектов

```typescript
import { api, InvestmentObjectDB } from '@/services/api';

const loadObjects = async () => {
  try {
    setLoading(true);
    const dbObjects = await api.getObjects({ status: 'available' });
    
    const converted = dbObjects.map(obj => ({
      id: obj.id,
      title: obj.title,
      type: obj.property_type,
      yield: obj.yield_percent,
      // ... остальные поля
    }));
    
    setObjects(converted);
  } catch (err) {
    console.error('API error:', err);
    // Fallback на localStorage
  } finally {
    setLoading(false);
  }
};
```

### 2. Фильтрация объектов

```typescript
const objects = await api.getObjects({
  city: 'Москва',
  property_type: 'apartments',
  min_yield: 10,
  max_price: 5000000,
  status: 'available'
});
```

### 3. Обновление статуса

```typescript
const updateStatus = async (id: number, status: string) => {
  await api.updateObject(id, { status });
  // Обновить UI
};
```

### 4. Работа с избранным

```typescript
import { api } from '@/services/api';

// Добавить в избранное
await api.addToFavorites(userId, objectId);

// Удалить из избранного
await api.removeFromFavorites(userId, objectId);

// Получить список избранного
const favorites = await api.getFavorites(userId);
```

### 5. Использование AuthContext

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, switchRole } = useAuth();
  
  const handleLogin = async () => {
    await login('user@example.com', 'John Doe', 'investor');
  };
  
  return (
    <div>
      {user ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

---

## 🎨 UI паттерны

### Индикаторы загрузки

```typescript
{loading && (
  <div className="text-center py-16">
    <Icon name="Loader2" size={48} className="mx-auto text-primary animate-spin mb-4" />
    <p className="text-muted-foreground">Загрузка...</p>
  </div>
)}
```

### Обработка ошибок

```typescript
{error && !loading && (
  <div className="text-center py-16">
    <Icon name="AlertCircle" size={48} className="mx-auto text-destructive mb-4" />
    <h3 className="text-xl font-semibold mb-2">Ошибка</h3>
    <p className="text-muted-foreground mb-4">{error}</p>
    <Button onClick={retry}>Попробовать снова</Button>
  </div>
)}
```

### Пустое состояние

```typescript
{!loading && !error && items.length === 0 && (
  <div className="text-center py-16">
    <Icon name="Search" size={64} className="mx-auto text-muted-foreground mb-4" />
    <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
    <p className="text-muted-foreground">Попробуйте изменить параметры</p>
  </div>
)}
```

---

## 🔧 Обработка ошибок

### Стратегия Graceful Degradation:

```typescript
try {
  // Попытка загрузить из API
  const data = await api.getObjects();
  setObjects(data);
} catch (err) {
  console.error('API failed, fallback to localStorage');
  
  // Fallback на локальные данные
  const local = localStorage.getItem('objects');
  if (local) {
    setObjects(JSON.parse(local));
  }
  
  // Показать ошибку пользователю (необязательно)
  setError('Данные загружены из кеша');
}
```

---

## 🔄 Синхронизация данных

### Гибридный подход:

```typescript
// Загрузить из API
const dbObjects = await api.getObjects();

// Загрузить локальные
const localObjects = JSON.parse(
  localStorage.getItem('objects') || '[]'
);

// Объединить (API имеет приоритет)
const merged = [...dbObjects, ...localObjects];

// Удалить дубликаты по ID
const unique = merged.filter((obj, index, self) =>
  index === self.findIndex(t => t.id === obj.id)
);

setObjects(unique);
```

---

## 📊 Мониторинг

### Логирование

```typescript
try {
  const data = await api.getObjects();
  console.log('✅ API success:', data.length, 'objects');
} catch (err) {
  console.error('❌ API failed:', err);
  console.log('🔄 Fallback to localStorage');
}
```

### Проверка API

```bash
# Проверить работоспособность
curl "https://functions.poehali.dev/fc00dc4e-18bf-4893-bb9d-331e8abda973?resource=objects"
```

---

## 🎯 Лучшие практики

### 1. **Всегда используйте try-catch**
```typescript
try {
  await api.someMethod();
} catch (err) {
  // Обработка ошибки
}
```

### 2. **Предоставьте fallback**
```typescript
catch (err) {
  const fallback = localStorage.getItem('data');
  if (fallback) setData(JSON.parse(fallback));
}
```

### 3. **Показывайте индикаторы**
```typescript
setLoading(true);
try { ... } 
finally { setLoading(false); }
```

### 4. **Валидируйте данные**
```typescript
if (!data || !Array.isArray(data)) {
  throw new Error('Invalid data format');
}
```

### 5. **Синхронизируйте localStorage**
```typescript
const data = await api.getObjects();
localStorage.setItem('objects', JSON.stringify(data));
```

---

## 🚀 Что дальше?

### Возможные улучшения:

1. **React Query** - автоматическое кеширование и синхронизация
2. **Optimistic updates** - мгновенное обновление UI
3. **Offline mode** - полная работа без интернета
4. **Real-time sync** - WebSocket для мгновенных обновлений
5. **Pagination** - для больших списков объектов

### Пример с React Query:

```typescript
import { useQuery } from '@tanstack/react-query';

function ObjectsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['objects'],
    queryFn: () => api.getObjects(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
  
  // Автоматическое кеширование и ре-фетч!
}
```

---

## 📞 Поддержка

При проблемах:
1. Проверьте логи: `get_logs(source="frontend")`
2. Проверьте API: `get_logs(source="backend/api")`
3. Проверьте БД: `get_db_info(level="table", table_name="...")`

---

**Готово!** 🎉 Платформа полностью интегрирована с API и готова к production.
