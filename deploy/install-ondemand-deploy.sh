#!/usr/bin/env bash
set -euo pipefail

HELPER="/usr/local/sbin/deploy-pizzabalka"
SUDOERS="/etc/sudoers.d/pizzabalka-deploy"
SOURCE="/home/jann/hearts/deploy/deploy-caddy.sh"
USER_NAME="jann"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root, e.g.: sudo bash /home/jann/hearts/deploy/install-ondemand-deploy.sh" >&2
  exit 1
fi

install -o root -g root -m 0755 "${SOURCE}" "${HELPER}"
printf '%s ALL=(root) NOPASSWD: %s\n' "${USER_NAME}" "${HELPER}" > "${SUDOERS}"
chmod 0440 "${SUDOERS}"

if command -v visudo >/dev/null 2>&1; then
  visudo -cf "${SUDOERS}"
fi

echo "Installed on-demand deploy helper: ${HELPER}"
echo "From now on, user ${USER_NAME} can deploy with: sudo ${HELPER}"
