FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

ENV PORT=3001
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

EXPOSE 3001

CMD ["npm", "start"]
