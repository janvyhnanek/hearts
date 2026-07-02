#!/usr/bin/env bash
set -euo pipefail

DOMAIN="pizzabalka.cz"
WWW_DOMAIN="www.pizzabalka.cz"
SITE_SRC="/home/jann/hearts"
SITE_DST="/var/www/${DOMAIN}"
CADDYFILE_SRC="${SITE_SRC}/deploy/Caddyfile"
SERVER_IP="154.13.149.190"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root, e.g.: sudo bash ${SITE_SRC}/deploy/deploy-caddy.sh" >&2
  exit 1
fi

if ! command -v caddy >/dev/null 2>&1; then
  apt-get update
  apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl gnupg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update
  apt-get install -y caddy
fi

if find "${SITE_SRC}" \
  -path "${SITE_SRC}/.git" -prune -o \
  -path "${SITE_SRC}/deploy" -prune -o \
  -type l -print -quit | grep -q .; then
  echo "Refusing to deploy: publishable tree contains symlinks." >&2
  find "${SITE_SRC}" \
    -path "${SITE_SRC}/.git" -prune -o \
    -path "${SITE_SRC}/deploy" -prune -o \
    -type l -print >&2
  exit 1
fi

install -d -m 0755 "${SITE_DST}"
rsync -a --delete --safe-links \
  --exclude '.git' \
  --exclude 'deploy' \
  --exclude 'README.md' \
  "${SITE_SRC}/" "${SITE_DST}/"
chown -R root:root "${SITE_DST}"
find "${SITE_DST}" -type d -exec chmod 0755 {} +
find "${SITE_DST}" -type f -exec chmod 0644 {} +

install -m 0644 "${CADDYFILE_SRC}" /etc/caddy/Caddyfile
caddy fmt --overwrite /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile

if command -v ufw >/dev/null 2>&1; then
  ufw allow 80/tcp || true
  ufw allow 443/tcp || true
fi

systemctl enable --now caddy
systemctl reload caddy

echo "Deployed ${DOMAIN} to ${SITE_DST}."
echo "DNS must point to this server before Let's Encrypt can issue HTTPS:"
echo "  ${DOMAIN}.     A     ${SERVER_IP}"
echo "  ${WWW_DOMAIN}. CNAME ${DOMAIN}.   # or A ${SERVER_IP}"
echo
systemctl --no-pager --full status caddy | sed -n '1,18p'
