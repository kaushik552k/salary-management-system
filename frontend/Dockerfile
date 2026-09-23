FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NEXT_PUBLIC_API_URL=http://assignment-api.kaushikcodes.in/api
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
