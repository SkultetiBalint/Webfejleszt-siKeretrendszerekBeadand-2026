# AI Prompt Napló

Ez a fájl rögzíti, hogy a projekt során milyen AI eszközöket és prompt-okat
használtam.

---

## 3. mérföldkő — Biztonság és tesztelés (2026.05.08)

### Eszköz
- Claude (Anthropic, Opus modell), Cowork mode-ban.

### Felhasznált prompt
> "A következő feladatunk: 3. mérföldkő — Biztonság és tesztelés (20 pont).
> [értékelési pontok teljes szövege a SPECIFICATION-ből]"

A tárgyalás során 3 kulcsdöntésre rákérdezett (backend stack, deploy target,
E2E eszköz), majd a megegyezett kombinációval (json-server-auth + Render +
Cypress) építette fel a megoldást.

### Mit csinált a modell
1. **Auth backend:** `json-server-auth` mint dev dependency, `routes.json`
   per-resource permission kódokkal, demo userek bcrypt-hashelt jelszavakkal.
2. **Frontend auth réteg:** `AuthService` signal-alapú állapottal +
   localStorage perzisztencia, `auth.interceptor.ts` JWT-csatolóval,
   `auth.guard.ts` és `admin.guard.ts` route guardokkal.
3. **Login + Register oldalak:** reactive formok, jelszó komplexitás,
   jelszó-megerősítés cross-field validátorral.
4. **Auth-aware navbar:** vendég/logged-in/admin nézetek, logout gomb.
5. **Profile + Booking átállítása valós userre:** a DEMO_USER_ID kivéve,
   helyette `AuthService.currentUser()`. Booking form auto-fill.
6. **Unit tesztek (25+):** AuthService, ServiceApiService, AppointmentApiService
   spec-ek HttpTestingControllerrel, plus a komponens spec-ek frissítése (a
   navbar és app.component most már auth-aware → szükségesek a HTTP providerek).
7. **Cypress E2E:** `cypress.config.ts`, `cypress/support/e2e.ts`,
   `cypress/e2e/booking-flow.cy.ts` happy-path teszttel.
8. **Deploy konfig:** `render.yaml` (backend), `vercel.json` (frontend),
   `environment.prod.ts` Render URL-re mutató placeholder.
9. **`docs/MILESTONE3.md`** és **`README.md`** frissítések.

### Manuális ellenőrzés szükséges
- A Render és Vercel deploy elindítása a felhasználó GitHub fiókjából.
- `environment.prod.ts` átírása a tényleges Render URL-re.
- `npm test` lokálisan (Chrome szükséges) — a sandboxban Chrome nincs.

---

## 2. mérföldkő — Backend és adatok (2026.04.26)

### Eszköz
- Claude (Anthropic, Opus modell), Cowork mode-ban a teljes projekt mappa
  alatt dolgoztunk. A modell olvasta a meglévő frontend kódot és a docs/
  mappa követelmény-leírásait.

### Felhasznált prompt
> "Elemezd a meglévő műköröm időpontfoglaló projektet. Ez szinte csak a
> frontend, a feladatod a backendnek a megírása. A backend megírásának a
> szempontjai/követelményei: [a 2. mérföldkő szempontjainak teljes szövege a
> SPECIFICATION-ből]"

### Mit csinált a modell
1. **Feltérképezte** a már meglévő frontend kódot (komponensek, modellek,
   routing, stílusok), és a docs/ alatti specifikációt.
2. **Kiválasztotta a backend-stack-et** (`json-server`), és felvette a
   `package.json`-ba mint dev dependency, plusz `npm run server` és
   `npm run dev` scripteket adott hozzá.
3. **Generált TypeScript modelleket** a `core/models/models.ts`-be a
   DATAMODEL.md alapján.
4. **Globális hibakezelést** írt (`error.interceptor.ts`) a HTTP rétegre.
5. **Toast** és **Confirm** service-eket írt a UX kiegészítésekhez.
6. **Új admin nézetet** adott a Service entitás teljes CRUD-jához.
7. **A Profil oldalt felhasználó-szűrt foglaláslistára** építette át, edit /
    cancel megerősítő dialógussal.
7. **A Services oldalra keresést** (debounce-olt), szűrést, rendezést és
    lapozást tett, az állapotot URL query paraméterekbe szinkronizálva.
9. **Empty state komponenst** írt és minden lista alatt használja, ha üres.
10. **README.md** és új **`docs/MILESTONE2.md`** fájl: a 2. mérföldkő
    követelményeit a megvalósítás konkrét fájljaira / komponenseire képezi le.
11. **Build-verifikáció:** `ng build` lefutott hibátlanul, a kezdeti compile
    warning (`*ngIf` import az `EmptyStateComponent`-ben) javítva.

### Manuális ellenőrzés
- `npm run server` → `db.json` szerver fut, REST végpontok elérhetők.
- `npm start` → frontend lefordul, és a böngészőben a listák, foglalás,
  admin CRUD működik a backendből töltött adattal.

