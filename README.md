# Hearts

Malá radostná statická stránka s minimalistickou těhotenskou tematikou.

- Kliknutí / tapnutí kamkoliv na stránku vytvoří animovaný výbuch červených srdíček.
- Design je responzivní a funguje bez build kroku.
- Respektuje `prefers-reduced-motion`.

## Lokální spuštění

```bash
python3 -m http.server 8080
```

Potom otevři: <http://localhost:8080>

## Soubory

- `index.html` — struktura stránky
- `style.css` — vizuální styl a animace srdíček
- `script.js` — interakce pro kliknutí/tapnutí
