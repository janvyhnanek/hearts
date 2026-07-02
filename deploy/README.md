# Deploy pizzabalka.cz

Cíl: statický web z tohoto repozitáře publikovat jako:

- https://pizzabalka.cz
- https://www.pizzabalka.cz → přesměrování na apex doménu

## DNS záznamy

Jakmile bude doména aktivní, nastav u registrátora DNS:

| Typ | Název | Hodnota |
|---|---|---|
| A | `@` / `pizzabalka.cz` | `154.13.149.190` |
| CNAME | `www` | `pizzabalka.cz` |

Alternativně může být `www` také `A` záznam na `154.13.149.190`.

## Server deploy

Na serveru je potřeba root/sudo, protože webserver musí poslouchat na portech 80/443 a instalovat balíčky.

Jednorázově lze spustit přímo:

```bash
sudo bash /home/jann/hearts/deploy/deploy-caddy.sh
```

### Pohodlný deploy na vyžádání přes Hermes

Aby mohl Hermes spouštět produkční deploy na tvoje vyžádání bez toho, abys pokaždé lezl na server a zadával heslo, spusť jednou ručně:

```bash
sudo bash /home/jann/hearts/deploy/install-ondemand-deploy.sh
```

Tím se nainstaluje root-owned helper:

```bash
/usr/local/sbin/deploy-pizzabalka
```

A sudoers pravidlo povolí uživateli `jann` bez hesla pouze tento jeden deploy příkaz:

```bash
sudo /usr/local/sbin/deploy-pizzabalka
```

Potom můžeš v Telegramu napsat „proveď produkční deploy“ a Hermes ho spustí odsud.

Skript:

1. nainstaluje Caddy, pokud není nainstalovaný,
2. zkopíruje web do `/var/www/pizzabalka.cz`,
3. nastaví `/etc/caddy/Caddyfile`,
4. povolí porty 80/443 přes `ufw`, pokud je dostupné,
5. spustí/reloadne Caddy.

Caddy automaticky vystaví Let's Encrypt certifikát, jakmile DNS vede na tento server a porty 80/443 jsou dostupné z internetu.

## Ověření

```bash
dig +short A pizzabalka.cz
curl -I http://pizzabalka.cz
curl -I https://pizzabalka.cz
systemctl status caddy
journalctl -u caddy -n 100 --no-pager
```
