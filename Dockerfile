FROM node:18-alpine AS build

RUN apk add --no-cache python3

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --force

COPY . .

RUN npm run build

FROM nginx:alpine AS prod

COPY default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/payslips/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
