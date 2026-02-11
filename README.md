## Products

### 2) Produkter (katalog)

**Acceptkriterier**

- Produkter kan ses uden login.
- Tilføjede produkter overlever refresh.
- Klik på produkt åbner detaljeside.

#### Produkt-detaljeside (efter “Se produkt”)

Når brugeren klikker “Se produkt” i kataloget, skal detaljesiden være moderne og give flere muligheder (Amazon-style).

**Krav (moderne muligheder)**

- Galleri: stort billede + (senere) thumbnails/zoom
- Tydelig pris, rating, kategori, “Prime”-badge
- Levering/returnering info (kort)
- Knapper: “Læg i kurv” + “Køb nu”
- Breadcrumbs tilbage til katalog + kategori
- Relaterede produkter sektion (kan starte som mock/udvalgt)
- Anmeldelser-sektion (kan starte som mock)

**Acceptkriterier**

- URL `/products/:id` virker og kan åbnes direkte.
- “Tilbage til katalog” virker.
- Detaljesiden har tydelig CTA og føles moderne på mobil + desktop.

### 3) Login / Auth (API + DB)

# amazirian-

React + TypeScript marketplace.

## Run locally

- Install dependencies: `npm install`
- Start API (SQLite DB): `npm run api:dev`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## Database

- Local SQLite database file: `server/dev.sqlite`
- API base URL (dev): `http://localhost:3001/api`

### Demo login

On first start, the API seeds a demo user:

- Username: `demo`
- Password: `demo`

## Deploy (GitHub Pages)

- Deploy `dist/` to GitHub Pages: `npm run deploy`
