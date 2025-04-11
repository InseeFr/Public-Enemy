#!/bin/sh
function originOf(){
    if [[ ! -z $1 ]]; then echo "$(echo "$1" | awk -F[/] '{print $1 "//" $3 }')"; fi
}
function originsOf(){
    origins=""; for url in $1; do origins="$origins $(originOf $url)";done; echo $origins
}

# If you are in Micro-front-end environnement i.e, you need to load script from other origin to run your app, you must provide MFE_URL var
export DEFAULT_SRC="'self'"
# Please, avoid inline script, prefer use <script src="my-script.js"/> (be careful with vite-envs library <= 4.6.0)
export SCRIPT_SRC="$DEFAULT_SRC 'unsafe-inline'"
# Some css library inject style as inline, so we allow that.
export STYLE_SRC="$DEFAULT_SRC 'unsafe-inline'"
export FONT_SRC="$DEFAULT_SRC"
# Keep 'data:' if you load img as blob inside src attribute of img, remove if not
export IMG_SRC="$DEFAULT_SRC data:"
# Keep 'blob:' if you load dynamically a worker as blob, remove if not
export WORKER_SRC="$DEFAULT_SRC blob:"
# Connect src CSP header is all origin of:
# fetch, XHR, WebSocket, origin appears in ping attribute of <a/>, So all origin of http/ws requests you made (oidc server, api, etc..)
export CONNECT_SRC="$DEFAULT_SRC $(originsOf "$VITE_API_URL $VITE_AUTH_URL")"
# Frame src: the workflow of oidc auth in frontend needs having server auth origin as frame-src (iframe is temporarily created)
export FRAME_SRC="$DEFAULT_SRC $(originOf $VITE_AUTH_URL)"

envsubst '${DEFAULT_SRC} ${SCRIPT_SRC} ${STYLE_SRC} ${FONT_SRC} ${IMG_SRC} ${WORKER_SRC} ${CONNECT_SRC} ${FRAME_SRC}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

