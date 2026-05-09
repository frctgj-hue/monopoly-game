# 🎨 Shadcn/ui Setup

## ✅ Установлено

**Дата**: 2026-05-09

Shadcn/ui успешно установлен и настроен в проекте!

---

## 📦 Установленные компоненты

### Button
- Путь: `src/components/ui/button.tsx`
- Использование: `import { Button } from "@/components/ui/button"`

---

## 🛠️ Конфигурация

### Path Aliases
Настроены в `tsconfig.app.json` и `vite.config.ts`:
```typescript
"@/*": ["./src/*"]
```

### Утилиты
- `src/lib/utils.ts` - функция `cn()` для объединения классов

### Зависимости
- ✅ `class-variance-authority` - для вариантов компонентов
- ✅ `clsx` - для условных классов
- ✅ `tailwind-merge` - для объединения Tailwind классов
- ✅ `lucide-react` - иконки
- ✅ `radix-ui` - примитивы UI компонентов

---

## 📝 Как использовать

### Пример использования Button:

```tsx
import { Button } from "@/components/ui/button"

function MyComponent() {
  return (
    <div>
      {/* Default button */}
      <Button>Click me</Button>

      {/* Варианты */}
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>

      {/* Размеры */}
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>

      {/* Icon button */}
      <Button size="icon">
        <Icon />
      </Button>

      {/* Disabled */}
      <Button disabled>Disabled</Button>
    </div>
  )
}
```

---

## 🎯 Добавление новых компонентов

Чтобы добавить новый компонент из Shadcn/ui:

```bash
cd client
npx shadcn@latest add [component-name]
```

Примеры:
```bash
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

⚠️ **Важно**: После добавления компонента, переместите его из `@/components/ui/` в `src/components/ui/`

---

## 📚 Доступные компоненты

Полный список компонентов: https://ui.shadcn.com/docs/components

Популярные компоненты:
- **Button** ✅ (установлен)
- Card - карточки
- Dialog - модальные окна
- Input - поля ввода
- Select - выпадающие списки
- Dropdown Menu - выпадающие меню
- Toast - уведомления
- Tabs - вкладки
- Table - таблицы
- Form - формы
- Avatar - аватары
- Badge - бейджи
- Alert - алерты

---

## 🎨 Кастомизация

### Цвета
Настройте цвета в `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2d8659', // Ваш зеленый цвет
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#dc3545', // Ваш красный цвет
          foreground: '#ffffff',
        },
      },
    },
  },
}
```

### Радиус скругления
```js
theme: {
  extend: {
    borderRadius: {
      lg: '0.5rem',
      md: '0.375rem',
      sm: '0.25rem',
    },
  },
}
```

---

## 🔧 Troubleshooting

### Проблема: "Cannot find module '@/lib/utils'"
**Решение**: Убедитесь, что path aliases настроены в `tsconfig.app.json` и `vite.config.ts`

### Проблема: Компонент создается в папке `@/components/ui/`
**Решение**: Переместите компонент в `src/components/ui/` вручную

### Проблема: Tailwind классы не работают
**Решение**: Убедитесь, что Tailwind CSS настроен и импортирован в `src/index.css`

---

## 📖 Документация

- Shadcn/ui: https://ui.shadcn.com
- Radix UI: https://www.radix-ui.com
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

---

## 🎉 Готово!

Теперь вы можете использовать красивые, доступные и кастомизируемые компоненты Shadcn/ui в вашем проекте Монополии!

**Пример замены кнопки в PropertyManagement:**

```tsx
import { Button } from "@/components/ui/button"

// Вместо:
<button className="bg-yellow-500 hover:bg-yellow-600...">
  💰 Заложить
</button>

// Используйте:
<Button variant="default" size="sm">
  💰 Заложить
</Button>
```

---

**Последнее обновление**: 2026-05-09
