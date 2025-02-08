# Docker Image which is used as foundation to create
# a custom Docker Image with this Dockerfile
# Windows
#FROM nginx:118
# linux
FROM nginx
USER root
ENV TZ=Etc/GMT+6

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later

WORKDIR /usr/src/app

# Copies everything over to Docker environment

COPY dist /usr/share/nginx/html

COPY dist/dashboards/solicitudes/v1/index.html /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginx:nginx /usr/share/nginx/html

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Uses port which is used by the actual application
EXPOSE 3011
# Finally runs the application 

CMD ["nginx", "-g", "daemon off;"]
