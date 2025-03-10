
FROM nginxinc/nginx-unprivileged:1.27.2-alpine

# Non root user
ENV NGINX_USER_ID=101
ENV NGINX_GROUP_ID=101
ENV NGINX_USER=nginx

USER $NGINX_USER_ID


# Add build to nginx root webapp
COPY --chown=$NGINX_USER:$NGINX_USER dist /usr/share/nginx/html

# Copy nginx configuration
RUN rm etc/nginx/conf.d/default.conf
COPY --chown=$NGINX_USER:$NGINX_USER container/nginx.conf etc/nginx/conf.d/


# Add entrypoint
COPY --chown=$NGINX_USER:$NGINX_USER container/entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]