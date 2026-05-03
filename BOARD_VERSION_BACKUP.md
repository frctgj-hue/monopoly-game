# Резервная копия Board.tsx

**Дата создания:** 2026-05-03 12:15

## Описание версии

Эта версия Board.tsx содержит следующие улучшения:

### 1. Цветные полоски снизу клеток
- Высота: 14px
- Цвета для каждой группы недвижимости (коричневый, голубой, розовый, оранжевый, красный, жёлтый, зелёный, тёмно-синий)
- Чёрная граница сверху (2px)
- Используются inline стили (не Tailwind классы)

### 2. Цена поверх полосок
- z-index: 101 для отображения поверх цветных полосок
- Белый полупрозрачный фон для читаемости

### 3. Улучшенный центр доски
- Чистый дизайн без логотипов и карточек
- SVG паттерн с диагональными линиями
- Декоративные рамки

### 4. Улучшенные клетки
- Градиенты для угловых клеток (Старт, В гостях, Парковка, В тюрьму)
- Тени для объемности
- Улучшенные иконки для специальных клеток
- Блики на цветных полосках сверху

### 5. Цвета доски
- Основной фон: #CDE6D0 (классический зеленый Монополии)
- Клетки: #F5F0E8 (бежевый)

## Файлы резервной копии

- `Board.backup.YYYYMMDD_HHMMSS.tsx` - полная копия файла
- Этот файл содержит описание версии

## Как восстановить

```bash
cd "C:\Users\Александ Годунок\monopoly-game\client\src\components"
cp Board.backup.YYYYMMDD_HHMMSS.tsx Board.tsx
```

## Ключевые настройки

### Цветная полоска снизу
```javascript
{property.type === 'property' && (
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '14px',
      backgroundColor: property.color === 'brown' ? '#8B4513' :
                      property.color === 'lightblue' ? '#87CEEB' :
                      property.color === 'pink' ? '#FF1493' :
                      property.color === 'orange' ? '#FF8C00' :
                      property.color === 'red' ? '#DC143C' :
                      property.color === 'yellow' ? '#FFD700' :
                      property.color === 'green' ? '#228B22' :
                      property.color === 'darkblue' ? '#00008B' : '#FF0000',
      borderTop: '2px solid #000000',
      zIndex: 100
    }}
  >
  </div>
)}
```

### Цена с z-index
```javascript
{property.price > 0 && (
  <div className={`${isCorner ? 'text-[10px]' : 'text-[9px]'} text-center font-bold mt-1 relative`} style={{ zIndex: 101 }}>
    <span className="bg-white bg-opacity-80 px-1 py-0.5 rounded text-gray-900">
      ${property.price}
    </span>
  </div>
)}
```

## Важно

- Используются только inline стили для цветов (Tailwind классы bg-* не работают в этом проекте)
- Полоски находятся внутри каждой клетки, а не в отдельном слое поверх доски
- z-index цены (101) выше z-index полоски (100)
