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

Note: GitHub Pages er frontend-only. Login kører som demo (localStorage) medmindre du sætter `VITE_API_BASE` til en hosted API.

## Mobile (Flutter)

Flutter appen ligger i mappen `mobile/`.

### Kør lokalt

- Tjek setup: `flutter doctor`
- Install dependencies: `cd mobile` → `flutter pub get`
- Kør på Android emulator / device: `flutter run`
- Kør som web (hurtig test): `flutter run -d chrome`

### API URL (vigtigt på emulator)

Som standard bruger appen `http://10.0.2.2:3001/api` (Android emulator → din PC).

Du kan override med:

- `flutter run --dart-define=API_BASE=http://10.0.2.2:3001/api`

Konfig ligger i `mobile/lib/config/app_config.dart`.
