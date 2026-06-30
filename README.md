# Todo App

Веб-приложение для управления личными задачами, вдохновлённое Microsoft To Do. Позволяет создавать списки задач, отмечать выполненные, помечать важные и устанавливать сроки выполнения. Реализовано как полноценное full-stack приложение с REST API и PostgreSQL.

## Стек
- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express
- База данных: PostgreSQL

## Деплой
[ссылка появится после деплоя]

## Code Climate
[бейдж появится после подключения]

## Запуск локально

### 1. Клонировать репозиторий
git clone <ссылка на репозиторий>
cd todo-app

### 2. Backend

cd server
npm install

Создать базу данных:
psql -U postgres -c "CREATE DATABASE todo;"

Применить схему:
psql -U postgres -d todo -f schema.sql

Создать файл .env на основе .env.example и заполнить своими данными (пароль от PostgreSQL)

Запустить сервер:
npm start

Сервер запустится на http://localhost:5000

### 3. Frontend

Открыть новый терминал:
cd client
npm install
npm run dev

Приложение откроется на http://localhost:5173