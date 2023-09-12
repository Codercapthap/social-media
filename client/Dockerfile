FROM node:lts-alpine AS build
# ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../
RUN npm install
COPY . .

ARG REACT_APP_PUBLIC_FOLDER
ARG REACT_APP_API
ARG REACT_APP_SOCKET
ARG REACT_APP_API_KEY
ARG REACT_APP_AUTH_DOMAIN
ARG REACT_APP_PROJECT_ID
ARG REACT_APP_STORAGE_BUCKET
ARG REACT_APP_MESSAGING_SENDER_ID
ARG REACT_APP_MEASUREMENT_ID
ARG REACT_APP_APP_ID

ENV REACT_APP_MESSAGING_SENDER_ID=1067451250061
ENV REACT_APP_STORAGE_BUCKET=boken-social.appspot.com
ENV REACT_APP_PROJECT_ID=boken-social
ENV REACT_APP_AUTH_DOMAIN=boken-social.firebaseapp.com
ENV REACT_APP_API_KEY=AIzaSyA-B64s7ifleU5y9HJFDFX_O94wu9eWHXE
ENV REACT_APP_SOCKET=http://localhost:8900
ENV REACT_APP_API=http://localhost:3001
ENV REACT_APP_PUBLIC_FOLDER=http://localhost:3001/images/
ENV REACT_APP_APP_ID=1:1067451250061:web:c167b9b369a31dc869b9c4
ENV REACT_APP_MEASUREMENT_ID=G-2RBEDMFE11

# RUN chown -R node /usr/src/app
# USER node
RUN npm run build

FROM nginx:mainline-alpine3.18-perl
# RUN apk update && apk add bash
COPY --link nginx.conf /etc/nginx/conf.d/default.conf
COPY --link --from=build usr/src/app/build/ /usr/share/nginx/html
# COPY ./configure-runtime.sh /usr/share/nginx/html
# RUN chmod +x /usr/share/nginx/html/configure-runtime.sh
EXPOSE 8080
# CMD ["/bin/bash", "-c", "/usr/share/nginx/html/configure-runtime.sh && nginx -g \"daemon off;\""]