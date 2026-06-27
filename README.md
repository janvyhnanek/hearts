# Hearts

Malá radostná statická stránka s minimalistickou těhotenskou tematikou.

- Kliknutí / tapnutí kamkoliv na stránku vytvoří animovaný výbuch červených srdíček.
- Welcome obrazovka obsahuje rozbalovací těhotenskou kalkulačku.
- Kalkulačka převádí kalendářní měsíce + dny na těhotenské týdny + dny a opačně.
- Design je responzivní a funguje bez build kroku.
- Respektuje `prefers-reduced-motion`.

## Spuštění / hosting

Dočasně běží jednoduchý server na portu 8099:

```bash
./serve.sh
```

Výchozí adresa: <http://localhost:8099>

Port lze změnit:

```bash
PORT=8080 ./serve.sh
```

Produkční nasazení pro `https://pizzabalka.cz` je připravené v `deploy/`:

```bash
sudo bash /home/jann/hearts/deploy/deploy-caddy.sh
```

## Soubory

- `index.html` — struktura stránky
- `style.css` — vizuální styl a animace srdíček
- `script.js` — interakce pro kliknutí/tapnutí
