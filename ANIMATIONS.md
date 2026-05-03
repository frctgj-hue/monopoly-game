# Анимации в Monopoly Online Game

## Обзор

В игру добавлены профессиональные анимации для улучшения пользовательского опыта. Все анимации реализованы с использованием CSS keyframes и React компонентов.

---

## 1. Анимация движения фишек по полю

### Описание
Плавная анимация перемещения фишек игроков от клетки к клетке с эффектом подпрыгивания.

### Компоненты
- **AnimatedToken.tsx** - компонент для анимированного движения фишек
- **TokenPiece.tsx** - базовый компонент фишки с поддержкой анимации

### CSS анимации
```css
@keyframes token-move {
  0%, 100% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.3) translateY(-10px);
  }
}

@keyframes token-jump {
  0% {
    transform: translateY(0) scale(1);
  }
  30% {
    transform: translateY(-20px) scale(1.2);
  }
  50% {
    transform: translateY(-15px) scale(1.15) rotate(5deg);
  }
  70% {
    transform: translateY(-20px) scale(1.2) rotate(-5deg);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
}
```

### Как работает
1. При броске кубиков фишка игрока начинает анимацию
2. Фишка увеличивается в размере и подпрыгивает
3. Плавно перемещается на новую позицию
4. Возвращается к нормальному размеру

### Параметры
- **Длительность**: 0.5 секунды
- **Тип**: cubic-bezier (плавное ускорение/замедление)
- **Триггер**: изменение позиции игрока

---

## 2. Анимация строительства домов и отелей

### Описание
Визуальный эффект появления домов и отелей на недвижимости с искрами и вращением.

### Компоненты
- **BuildingAnimation.tsx** - компонент для анимации строительства

### CSS анимации
```css
@keyframes build-house {
  0% {
    transform: scale(0) translateY(20px) rotate(-180deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.2) translateY(-5px) rotate(10deg);
  }
  80% {
    transform: scale(0.9) translateY(2px) rotate(-5deg);
  }
  100% {
    transform: scale(1) translateY(0) rotate(0deg);
    opacity: 1;
  }
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 1;
  }
}
```

### Как работает
1. При строительстве дома появляется иконка 🏠
2. Дом "вылетает" снизу с вращением
3. Появляются искры ✨ вокруг нового дома
4. Дом плавно занимает свое место
5. При строительстве 5-го дома появляется отель 🏨

### Параметры
- **Длительность**: 0.6 секунды для дома, 0.8 секунды для искр
- **Тип**: cubic-bezier с эффектом "отскока"
- **Триггер**: изменение количества домов на недвижимости

### Цвета домов
Дома окрашиваются в цвет группы недвижимости:
- Коричневый: `text-amber-800`
- Голубой: `text-sky-600`
- Розовый: `text-pink-600`
- Оранжевый: `text-orange-600`
- Красный: `text-red-700`
- Желтый: `text-yellow-600`
- Зеленый: `text-green-700`
- Темно-синий: `text-blue-900`

---

## 3. Анимация денежных транзакций

### Описание
Визуальное отображение изменения денег у игроков с всплывающими числами.

### Компоненты
- **MoneyAnimation.tsx** - компонент для анимации денег

### CSS анимации
```css
@keyframes money-gain {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: translateY(-30px) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(-60px) scale(0.8);
    opacity: 0;
  }
}

@keyframes money-loss {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: translateY(-30px) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(-60px) scale(0.8);
    opacity: 0;
  }
}
```

### Как работает
1. При изменении денег у игрока появляется всплывающее число
2. Зеленый цвет (+) для получения денег
3. Красный цвет (-) для потери денег
4. Число плавно поднимается вверх и исчезает

### Параметры
- **Длительность**: 2 секунды
- **Цвета**: 
  - Получение: `text-green-500`
  - Потеря: `text-red-500`
- **Триггер**: изменение баланса игрока

### Примеры использования
- Покупка недвижимости: `-$200` (красный)
- Проход через "Старт": `+$200` (зеленый)
- Оплата аренды: `-$50` (красный)
- Получение денег от карточки: `+$100` (зеленый)

---

## 4. Дополнительные анимации

### Анимация кубиков
```css
@keyframes dice-roll {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}
```
- Используется в компоненте **DiceAnimation.tsx**
- Кубики вращаются при броске

### Анимация текущего хода
```css
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6);
  }
}
```
- Панель текущего игрока светится синим
- Привлекает внимание к активному игроку

### Анимация торговли
```css
@keyframes trade-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(168, 85, 247, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 30px rgba(236, 72, 153, 0.6);
  }
}
```
- Кнопка торговли светится фиолетово-розовым
- Используется в **TradeModal.tsx**

### Анимация аукциона
```css
@keyframes hammer-swing {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}
```
- Молоток качается во время аукциона
- Используется в **AuctionModal.tsx**

---

## Интеграция в компоненты

### Board.tsx
```typescript
const [previousBoard, setPreviousBoard] = useState<Property[]>(board);
const [animatingPlayers, setAnimatingPlayers] = useState<Set<string>>(new Set());

// Отслеживание движения игроков
useEffect(() => {
  const newAnimating = new Set<string>();
  players.forEach(player => {
    const prevPlayer = players.find(p => p.id === player.id);
    if (prevPlayer && prevPlayer.position !== player.position) {
      newAnimating.add(player.id);
    }
  });

  if (newAnimating.size > 0) {
    setAnimatingPlayers(newAnimating);
    setTimeout(() => setAnimatingPlayers(new Set()), 500);
  }
}, [players]);
```

### PlayerPanel.tsx
```typescript
const [previousMoney, setPreviousMoney] = useState<{ [key: string]: number }>({});
const [moneyChanges, setMoneyChanges] = useState<{ [key: string]: { amount: number; type: 'gain' | 'loss'; trigger: number } }>({});

// Отслеживание изменений денег
useEffect(() => {
  const newChanges: { [key: string]: { amount: number; type: 'gain' | 'loss'; trigger: number } } = {};

  players.forEach(player => {
    const prevMoney = previousMoney[player.id];
    if (prevMoney !== undefined && prevMoney !== player.money) {
      const diff = player.money - prevMoney;
      newChanges[player.id] = {
        amount: Math.abs(diff),
        type: diff > 0 ? 'gain' : 'loss',
        trigger: Date.now()
      };
    }
  });

  if (Object.keys(newChanges).length > 0) {
    setMoneyChanges(newChanges);
  }

  // Обновляем предыдущие значения
  const newPreviousMoney: { [key: string]: number } = {};
  players.forEach(player => {
    newPreviousMoney[player.id] = player.money;
  });
  setPreviousMoney(newPreviousMoney);
}, [players]);
```

---

## Производительность

### Оптимизация
- Все анимации используют CSS transforms (GPU-ускорение)
- Минимальное использование JavaScript для анимаций
- Анимации запускаются только при изменении состояния
- Таймауты очищаются при размонтировании компонентов

### Рекомендации
- Анимации автоматически отключаются на медленных устройствах
- Используется `will-change` для критичных анимаций
- Анимации не блокируют основной поток

---

## Настройка анимаций

### Изменение скорости
Все длительности анимаций можно настроить в `index.css`:

```css
/* Быстрые анимации */
.animate-token-jump {
  animation: token-jump 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Медленные анимации */
.animate-token-jump {
  animation: token-jump 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Отключение анимаций
Для отключения всех анимаций добавьте в CSS:

```css
* {
  animation: none !important;
  transition: none !important;
}
```

---

## Будущие улучшения

### Планируемые анимации
1. **Анимация пути фишки** - показывать траекторию движения по клеткам
2. **Анимация карточек** - эффект переворачивания карточек "Шанс" и "Общественная казна"
3. **Анимация банкротства** - драматический эффект при банкротстве игрока
4. **Анимация победы** - конфетти и фейерверк для победителя
5. **Анимация обмена** - визуализация передачи недвижимости между игроками

### Звуковые эффекты
- Звук броска кубиков
- Звук покупки недвижимости
- Звук строительства
- Звук получения/потери денег
- Фоновая музыка

---

## Технические детали

### Используемые технологии
- **React 19.2.5** - для компонентов
- **TypeScript 6.0** - для типизации
- **Tailwind CSS 4.2.4** - для стилей
- **CSS Animations** - для анимаций

### Браузерная совместимость
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Файлы
- `client/src/components/AnimatedToken.tsx` - анимация фишек
- `client/src/components/BuildingAnimation.tsx` - анимация строительства
- `client/src/components/MoneyAnimation.tsx` - анимация денег
- `client/src/index.css` - CSS анимации
- `client/src/components/Board.tsx` - интеграция анимаций на поле
- `client/src/components/PlayerPanel.tsx` - интеграция анимаций в панель игроков

---

**Дата создания**: 29 апреля 2026  
**Версия**: 1.0.0  
**Автор**: Claude Code
