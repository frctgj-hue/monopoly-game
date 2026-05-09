# 🚀 Деплой на Vercel

## Текущий деплой

**Frontend URL**: https://monopoly-game-client.vercel.app/

**Дата последнего обновления**: 2026-05-09

**Последние изменения**: Исправлена механика залога недвижимости

---

## 📦 Что задеплоено

### Frontend (Vercel)
- React + TypeScript + Vite
- Автоматический деплой при push в `main` ветку
- URL: https://monopoly-game-client.vercel.app/

### Backend
⚠️ **Важно**: Backend должен быть задеплоен отдельно на:
- Render (https://render.com) - бесплатно
- Railway (https://railway.app) - бесплатно
- Heroku - платно

---

## 🔄 Автоматический деплой

Vercel автоматически деплоит изменения при:
1. Push в ветку `main` на GitHub
2. Merge Pull Request
3. Ручной деплой через Vercel Dashboard

### Процесс деплоя:
1. Вы делаете `git push origin main`
2. Vercel получает webhook от GitHub
3. Vercel автоматически собирает и деплоит проект
4. Через 1-2 минуты изменения доступны на https://monopoly-game-client.vercel.app/

---

## 🛠️ Ручной деплой

Если нужно задеплоить вручную:

### Через командную строку:
```bash
cd monopoly-game/client
npx vercel --prod
```

### Через Vercel Dashboard:
1. Откройте https://vercel.com/dashboard
2. Найдите проект `monopoly-game-client`
3. Нажмите "Redeploy"

---

## ⚙️ Настройки Vercel

### Build Settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables:
Если backend задеплоен, добавьте:
```
VITE_SOCKET_URL=https://your-backend-url.com
```

---

## 🔗 Backend деплой (TODO)

Backend еще не задеплоен. Для полноценной работы нужно:

### Вариант 1: Render (рекомендуется)
1. Зарегистрируйтесь на https://render.com
2. Создайте новый Web Service
3. Подключите GitHub репозиторий
4. Настройки:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Добавьте переменные окружения:
   ```
   PORT=3001
   NODE_ENV=production
   ```
6. Скопируйте URL (например: `https://monopoly-game-server.onrender.com`)
7. Добавьте в Vercel Environment Variables:
   ```
   VITE_SOCKET_URL=https://monopoly-game-server.onrender.com
   ```

### Вариант 2: Railway
1. Зарегистрируйтесь на https://railway.app
2. Создайте новый проект из GitHub
3. Выберите папку `server`
4. Railway автоматически определит Node.js
5. Добавьте переменные окружения
6. Скопируйте URL и добавьте в Vercel

---

## 🧪 Тестирование деплоя

После деплоя проверьте:

### Frontend:
1. Откройте https://monopoly-game-client.vercel.app/
2. Проверьте, что страница загружается
3. Откройте консоль браузера (F12)
4. Проверьте на ошибки

### Функциональность:
- ✅ Создание игры
- ✅ Присоединение к игре
- ✅ Бросок кубиков
- ✅ Покупка недвижимости
- ✅ **Залог недвижимости** (новое!)
- ✅ Строительство домов
- ✅ Торговля
- ✅ Чат

---

## 📊 Статус деплоя

### ✅ Готово:
- Frontend на Vercel
- Автоматический деплой настроен
- Исправления залога задеплоены

### ⏳ TODO:
- Backend на Render/Railway
- Environment variables для production
- Custom domain (опционально)

---

## 🐛 Решение проблем

### "Не удается подключиться к серверу"
**Причина**: Backend не задеплоен или неправильный URL

**Решение**:
1. Задеплойте backend на Render/Railway
2. Добавьте `VITE_SOCKET_URL` в Vercel
3. Redeploy frontend

### "Build failed"
**Причина**: Ошибки TypeScript или зависимости

**Решение**:
1. Проверьте логи в Vercel Dashboard
2. Запустите `npm run build` локально
3. Исправьте ошибки и push снова

### "Page not found"
**Причина**: Неправильная конфигурация роутинга

**Решение**:
1. Добавьте `vercel.json` в корень проекта:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📝 История деплоев

### 2026-05-09
- ✅ Исправлена механика залога недвижимости
- ✅ Добавлены кнопки залога/выкупа в UI
- ✅ Исправлена логика аренды для заложенной недвижимости
- ✅ Добавлено логирование для отладки

### Предыдущие деплои
- Основная функциональность игры
- Анимации
- Чат
- Торговля

---

## 🎮 Как играть онлайн

### Для вас (хост):
1. Откройте https://monopoly-game-client.vercel.app/
2. Создайте игру
3. Отправьте друзьям:
   - URL: https://monopoly-game-client.vercel.app/
   - ID игры: [ваш ID]

### Для друзей:
1. Откройте https://monopoly-game-client.vercel.app/
2. Присоединитесь к игре с ID
3. Играйте!

⚠️ **Важно**: Пока backend не задеплоен, игра работает только локально!

---

## 🔐 Безопасность

- HTTPS автоматически включен на Vercel
- Environment variables зашифрованы
- Код открыт на GitHub (публичный репозиторий)

---

## 💰 Стоимость

- **Vercel**: Бесплатно (Hobby план)
- **Render**: Бесплатно (Free tier, засыпает после 15 мин неактивности)
- **Railway**: $5/месяц кредита бесплатно

---

## 📚 Полезные ссылки

- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repo: https://github.com/frctgj-hue/monopoly-game
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs

---

**Последнее обновление**: 2026-05-09  
**Статус**: ✅ Frontend задеплоен, ⏳ Backend TODO
