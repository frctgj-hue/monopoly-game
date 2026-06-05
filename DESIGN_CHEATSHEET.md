# 🎨 Design Cheatsheet - Быстрая справка

## 🎯 Цвета

```css
/* Фоны */
#1c1c1e  /* Основной фон страниц */
#252528  /* Фон карточек и компонентов */

/* Акценты */
#d4af37  /* Золотой - основной акцент */
#f4d03f  /* Светло-золотой - для градиентов */
#2d5f3f  /* Зеленый - для действий */

/* Текст */
#d4af37  /* Золотой текст */
#888888  /* Серый текст */
#ffffff  /* Белый текст */
```

---

## 🎭 Тени

### Выпуклый элемент (карточка)
```css
box-shadow: 
  8px 8px 16px rgba(0,0,0,0.4),
  -8px -8px 16px rgba(60,60,60,0.1);
```

### Вдавленный элемент (input)
```css
box-shadow: 
  inset 4px 4px 8px rgba(0,0,0,0.5),
  inset -4px -4px 8px rgba(60,60,60,0.1);
```

### Свечение (активный элемент)
```css
box-shadow: 
  0 8px 24px rgba(212, 175, 55, 0.4),
  0 0 40px rgba(212, 175, 55, 0.2);
```

---

## ✨ Анимации

### fadeIn (появление)
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Использование */
animation: fadeIn 0.5s ease-out;
```

### float (плавание)
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
/* Использование */
animation: float 6s ease-in-out infinite;
```

### glow (свечение)
```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.6); }
}
/* Использование */
animation: glow 2s ease-in-out infinite;
```

---

## 🔘 Кнопки

### Золотая кнопка (primary)
```tsx
<button
  className="px-8 py-4 rounded-xl transition-all hover:scale-105"
  style={{
    background: '#d4af37',
    color: '#1c1c1e',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
  }}
>
  Текст
</button>
```

### Зеленая кнопка (action)
```tsx
<button
  className="px-8 py-4 rounded-xl transition-all hover:scale-105"
  style={{
    background: '#2d5f3f',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(45, 95, 63, 0.3)',
  }}
>
  Текст
</button>
```

### Темная кнопка (secondary)
```tsx
<button
  className="px-8 py-4 rounded-xl transition-all hover:scale-105"
  style={{
    background: '#252528',
    color: '#d4af37',
    boxShadow: '8px 8px 16px rgba(0,0,0,0.4), -8px -8px 16px rgba(60,60,60,0.1)',
    border: '1px solid rgba(212, 175, 55, 0.1)',
  }}
>
  Текст
</button>
```

---

## 📦 Карточки

### Базовая карточка
```tsx
<div 
  className="rounded-2xl p-6"
  style={{
    background: '#252528',
    boxShadow: '8px 8px 16px rgba(0,0,0,0.4), -8px -8px 16px rgba(60,60,60,0.1)',
    border: '1px solid rgba(212, 175, 55, 0.1)',
  }}
>
  Содержимое
</div>
```

### Активная карточка
```tsx
<div 
  className="rounded-2xl p-6"
  style={{
    background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
  }}
>
  Содержимое
</div>
```

### Вдавленная карточка
```tsx
<div 
  className="rounded-2xl p-6"
  style={{
    background: '#1c1c1e',
    boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.5), inset -4px -4px 8px rgba(60,60,60,0.1)',
  }}
>
  Содержимое
</div>
```

---

## 📝 Типографика

### Заголовок H1
```tsx
<h1 
  className="text-6xl font-light tracking-[0.3em]"
  style={{ color: '#d4af37' }}
>
  ЗАГОЛОВОК
</h1>
```

### Заголовок H2
```tsx
<h2 
  className="text-3xl font-light tracking-widest"
  style={{ color: '#d4af37' }}
>
  ПОДЗАГОЛОВОК
</h2>
```

### Основной текст
```tsx
<p 
  className="text-sm font-light tracking-wide"
  style={{ color: '#888' }}
>
  Текст
</p>
```

### Акцентный текст
```tsx
<span 
  className="text-lg font-medium tracking-wider"
  style={{ color: '#d4af37' }}
>
  Важный текст
</span>
```

---

## 🎨 Градиенты

### Золотой градиент
```css
background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
```

### Зеленый градиент
```css
background: linear-gradient(135deg, #2d5f3f 0%, #1e5631 100%);
```

### Фиолетовый градиент
```css
background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
```

---

## 🔲 Рамки

### Золотая рамка
```css
border: 1px solid rgba(212, 175, 55, 0.1);
```

### Активная рамка
```css
border: 2px solid rgba(212, 175, 55, 0.4);
```

### Красная рамка (ошибка)
```css
border: 1px solid rgba(239, 68, 68, 0.3);
```

---

## 📐 Скругления

```css
border-radius: 12px;  /* Маленькие элементы */
border-radius: 15px;  /* Средние элементы */
border-radius: 20px;  /* Большие карточки */
border-radius: 30px;  /* Очень большие элементы */
```

---

## 🎯 Отступы

```css
padding: 20px;  /* Маленькие */
padding: 30px;  /* Средние */
padding: 40px;  /* Большие */

gap: 20px;      /* Между элементами */
gap: 30px;      /* Между карточками */
```

---

## 🖱️ Hover эффекты

### Scale (увеличение)
```css
transition: all 0.3s;
&:hover {
  transform: scale(1.05);
}
```

### Translate (движение)
```css
transition: all 0.3s;
&:hover {
  transform: translateY(-5px);
}
```

### Shadow (тень)
```css
transition: all 0.3s;
&:hover {
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.5);
}
```

---

## 🎨 Фоновые эффекты

### Анимированный фон
```tsx
<div className="absolute inset-0 opacity-10">
  <div 
    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
    style={{ 
      background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)',
      animation: 'float 6s ease-in-out infinite'
    }}
  />
</div>
```

---

## 📱 Адаптивность

```tsx
/* Mobile first */
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Содержимое */}
</div>

/* Breakpoints */
sm: 640px   /* Маленькие телефоны */
md: 768px   /* Планшеты */
lg: 1024px  /* Ноутбуки */
xl: 1280px  /* Десктопы */
```

---

## 🔧 Утилиты

### Центрирование
```tsx
<div className="flex items-center justify-center">
  {/* Содержимое */}
</div>
```

### Полная высота экрана
```tsx
<div className="min-h-screen">
  {/* Содержимое */}
</div>
```

### Overflow
```tsx
<div className="overflow-hidden">
  {/* Содержимое */}
</div>
```

---

## 📋 Быстрые шаблоны

### Страница с фоном
```tsx
<div 
  className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
  style={{ background: '#1c1c1e' }}
>
  {/* Анимированный фон */}
  <div className="absolute inset-0 opacity-10">
    <div 
      className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
      style={{ 
        background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite'
      }}
    />
  </div>
  
  {/* Контент */}
  <div className="relative z-10">
    {/* Ваш контент */}
  </div>
</div>
```

### Модальное окно
```tsx
<div 
  className="fixed inset-0 flex items-center justify-center p-4 z-50"
  style={{ background: 'rgba(0, 0, 0, 0.8)' }}
>
  <div 
    className="rounded-2xl p-8 max-w-2xl w-full"
    style={{
      background: '#252528',
      boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -12px -12px 24px rgba(60,60,60,0.1)',
      animation: 'fadeIn 0.3s ease-out'
    }}
  >
    {/* Содержимое модального окна */}
  </div>
</div>
```

---

## 🎯 Чек-лист для нового компонента

- [ ] Использовать цветовую палитру (#1c1c1e, #252528, #d4af37)
- [ ] Добавить неоморфные тени
- [ ] Применить font-light и tracking-wide
- [ ] Добавить hover эффекты (scale 1.05)
- [ ] Использовать плавные переходы (transition-all)
- [ ] Добавить анимацию появления (fadeIn)
- [ ] Скруглить углы (rounded-xl, rounded-2xl)
- [ ] Проверить на мобильных устройствах
- [ ] Добавить золотые акценты для важных элементов

---

**Быстрая справка готова! Используйте для создания новых компонентов. ✨**
