# Используем официальный образ Node.js в качестве базового образа
FROM node:14

# Устанавливаем зависимости
WORKDIR /usr/share/nginx/html
COPY ./package*.json ./
RUN npm install

# Копируем все файлы проекта внутрь контейнера
COPY . .


# Экспонируем порт 80
EXPOSE 80
