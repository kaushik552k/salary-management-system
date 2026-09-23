FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NEXT_PUBLIC_API_URL=http://your-oci-ip-or-domain:3003/api
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
