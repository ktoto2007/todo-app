[![Maintainability](https://qlty.sh/gh/ktoto2007/projects/todo-app/maintainability.svg)](https://qlty.sh/gh/ktoto2007/projects/todo-app)
# Todo App

Веб-приложение для управления личными задачами, вдохновлённое Microsoft To Do. Позволяет создавать списки задач, отмечать выполненные, помечать важные и устанавливать сроки выполнения. Реализовано как полноценное full-stack приложение с REST API и PostgreSQL.

## Стек
- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express
- База данных: PostgreSQL

## Деплой
https://client-production-5a68.up.railway.app

## Запуск локально

### 1. Клонировать репозиторий

```bash
git clone <ссылка на репозиторий>
cd todo-app
```

### 2. Backend

```bash
cd server
npm install
psql -U postgres -c "CREATE DATABASE todo;"
psql -U postgres -d todo -f schema.sql
```

Создайте файл `.env` на основе `.env.example` и заполните своими данными.

```bash
npm start
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
```
