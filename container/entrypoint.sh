#!/bin/sh
echo "window._env_['VITE_API_URL'] = '$VITE_API_URL';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['VITE_ORCHESTRATOR_URL'] = '$VITE_ORCHESTRATOR_URL';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['VITE_POGUES_URL'] = '$VITE_POGUES_URL';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['VITE_DOCUMENTATION_URL'] = '$VITE_DOCUMENTATION_URL';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['VITE_LOCALE'] = '$VITE_LOCALE';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['VITE_AUTH_TYPE'] = '$VITE_AUTH_TYPE';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['VITE_AUTH_URL'] = '$VITE_AUTH_URL';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['VITE_REALM'] = '$VITE_REALM';" >> /usr/share/nginx/html/env-config.js
echo "window._env_['VITE_CLIENT_ID'] = '$VITE_CLIENT_ID';" >> /usr/share/nginx/html/env-config.js
exec "$@"