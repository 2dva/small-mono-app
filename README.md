# Vue Back + Front Playground

## Запуск приложения

Создать .env файлы из соответствующих backend/env.example и front/env.example

Выполнить:

```shell
pnpm install
pnpm dev
```

Открыть в браузере ссылку http://localhost:8000/ (или использовать порт указанный в front/.env)

### При возникновении ошибки Error: Could not locate the bindings file
Необходимо перейти в папку 
".\backend\node_modules\better-sqlite3\" и выполнить `pnpm rebuild`

Это особенность модуля better-sqlite3 для призмы. Затем заново в корне запустить pnpm dev

## Запуск тестов

Выполнить

```shell
pnpm run test
```

## Альтернативный запуск приложения через бекенд
(Необходимо применить await applyServeWebApp(expressApp) в приложении бека)

Вместо pnpm dev, сбилдить фронт и бек, а затем запустить бекенд. Выполните:
```shell
pnpm b build
pnpm f build
pnpm b start
```

Теперь приложение работает через сервер бекенда: http://localhost:3000/




## Stack

### Server

NodeJS + Express + tRPC + Prisma + SQLite

### Client

Vite + Vue + tanstack/vue-query + tRPC

### Common

jest, eslint, prettier
