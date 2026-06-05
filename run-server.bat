@echo off
echo =========================================
echo   STARTING MONOPOLY SERVER
echo =========================================
echo.
cd /d C:\Users\Александ Годунок\monopoly-game\client

REM Проверяем наличие папки dist, если нет - собираем
if not exist "dist" (
    echo Building project first time...
    call npm run build
)

REM Запускаем сервер
npx vite preview --port 4173 --host 127.0.0.1

pause