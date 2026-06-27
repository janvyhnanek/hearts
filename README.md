# Hearts

Malá radostná statická stránka s minimalistickou těhotenskou tematikou.

- Kliknutí / tapnutí kamkoliv na stránku vytvoří animovaný výbuch červených srdíček.
- Design je responzivní a funguje bez build kroku.
- Respektuje `prefers-reduced-motion`.

## Spuštění / hosting

```bash
./serve.sh
```

Výchozí adresa: <http://localhost:8099>

Port lze změnit:

```bash
PORT=8080 ./serve.sh
```

## Soubory

- `index.html` — struktura stránky
- `style.css` — vizuální styl a animace srdíček
- `script.js` — interakce pro kliknutí/tapnutí
