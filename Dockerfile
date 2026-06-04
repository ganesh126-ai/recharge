FROM mcr.microsoft.com/playwright:v1.60.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps chromium

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["node", "app.js"]