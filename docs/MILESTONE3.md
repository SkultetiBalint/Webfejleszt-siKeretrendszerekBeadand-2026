# 3. mérföldkő — Biztonság és tesztelés

Ez a doksi a 3. mérföldkő (Biztonság és tesztelés) értékelési pontjaihoz
rendeli hozzá a megvalósítás konkrét fájljait.

---

## 3.1 Autentikáció (5 pont)

| Szempont | Hol? |
|---|---|
| **Regisztráció validációval** | [`register-page.component`](../src/app/features/auth/register-page/) — reactive form, email formátum, jelszó min. 8 karakter + betű+szám regex, jelszó-megerősítés, telefon mintaillesztés, inline hibaüzenetek |
| **Bejelentkezés + hibakezelés** | [`login-page.component`](../src/app/features/auth/login-page/) — `400` esetén user-friendly toast: "Hibás email cím vagy jelszó" |
| **Kijelentkezés** | navbar logout gomb → `AuthService.logout()` törli a localStorage-et és a signal állapotot |
| **Auth perzisztencia** | [`auth.service.ts`](../src/app/core/services/auth.service.ts) — JWT és user objektum localStorage-be mentve, page reload után az `_state` signal innen hidratál |
| **Auth-függő UI** | a navbar feltételesen mutatja: vendégnek "Bejelentkezés / Regisztráció", logged-in usernak "Foglalás / Profil / kijelentkezés gomb", csak adminnak az "Admin" linket |

A backend a `json-server-auth` `/login` és `/register` végpontjait használja,
amely **bcrypt**-tel hasholja a jelszavakat és **JWT**-t ad vissza
(HS256 + 1 órás expiráció).

---

## 3.2 Jogosultságkezelés és védelem (5 pont)

| Szempont | Hol? |
|---|---|
| **Védett útvonalak** | `/booking` és `/profile` `authGuard`-dal. `/services/admin` `adminGuard`-dal. Ld. [`app.routes.ts`](../src/app/app.routes.ts) és [`auth.guard.ts`](../src/app/core/guards/auth.guard.ts). Bejelentkezés nélküli próbálkozás `/login?returnUrl=…` címre dobja a felhasználót, login után visszairányít. |
| **Szerepkör-alapú UI** | a navbar `*ngIf="isAdmin()"` blokkja csak adminnak mutatja az Admin linket. A profilon csak a saját userId-jű foglalások jelennek meg (`computed`-tel szűrve). |
| **Backend-oldali szabályok** | [`routes.json`](../routes.json) per-resource permission kódokkal (json-server-auth `parseGuardsRules`): `/services 664` (public read, logged-in write), `/appointments 660` (csak logged-in), `/users 600` (csak admin). Az [`auth.interceptor.ts`](../src/app/core/interceptors/auth.interceptor.ts) minden kérésre csatolja a JWT-t, és a backend a tokent ellenőrzi. |

Példa server-oldali ellenőrzésre: `curl -X POST /services -H "Content-Type: application/json" -d '{"name":"X"}'` token nélkül **401**-et ad vissza, JWT-vel **201**-et.

---

## 3.3 Input validáció és biztonság (2 pont)

| Technika | Hol? |
|---|---|
| **Kliens-oldali validáció** | reactive formok minden formon: `Validators.required`, `email`, `minLength`, `maxLength`, `min`, `max`, `pattern`, custom `pastDate` és `passwordMismatch` validátorok. A hibák inline jelennek meg (`<small class="field-error">`). |
| **Szerver-oldali validáció** | json-server-auth a `/register`-en ellenőrzi, hogy az email egyedi, jelszó hossza ≥ 1; és a permission rendszer minden írást auth + ownership alapján szűr. |
| **XSS-védelem** | Angular minden `{{ }}` interpolációt automatikusan escape-el; a kódban **nincs** `[innerHTML]`, `bypassSecurityTrust*`, vagy `eval`. Felhasználói input (megjegyzés, név, leírás) így soha nem kerül nyers HTML-ként renderelésre. |
| **Érzékeny adatok védelme** | a jelszó **csak** bcrypt hash formában kerül a `db.json`-ba (json-server-auth végzi); JWT secret a json-server-auth alapértelmezett konstansa fejlesztésre, production-ben Render env változóval cserélhető. `.gitignore` zárja: `node_modules`, `dist`, `.env*`, Cypress videók/screenshotok. **Sehol** nincs API kulcs vagy hardcoded titok. |

4 technika valósul meg → 2 pont.

---

## 3.4 Tesztelés (5 pont)

### Unit tesztek (Karma + Jasmine)

A tesztek `npm test` paranccsal indíthatók (vagy `npm run test:ci` headless módban).

Fő spec fájlok:

- [`auth.service.spec.ts`](../src/app/core/services/auth.service.spec.ts) — 6 teszt: kezdeti állapot, login POST + state update, localStorage perzisztencia, logout, isAdmin computed, register
- [`service-api.service.spec.ts`](../src/app/core/services/service-api.service.spec.ts) — 5 teszt: list, activeServices computed, priceRange computed, create + store update, delete + store update
- [`appointment-api.service.spec.ts`](../src/app/core/services/appointment-api.service.spec.ts) — 5 teszt: list, upcoming/past computed, listByUser query param, update PATCH
- [`booking-form.component.spec.ts`](../src/app/features/booking/booking-form/booking-form.component.spec.ts) — 4 teszt: render, üres form invalid, email validáció, custom `pastDate` validátor
- [`home-page.component.spec.ts`](../src/app/features/home/home-page/home-page.component.spec.ts) — 2 teszt: render, `featured` legfeljebb 3 elem
- [`profile-page.component.spec.ts`](../src/app/features/profile/profile-page/profile-page.component.spec.ts) — 2 teszt: render, üres `myUpcoming` ha nincs login
- További létező (auto-generált) component spec-ek: `app.component`, `navbar`, `footer`, `services-page`, `booking-page`, `not-found-page`, `service-card`, `appointment-card`, `hero`

**Több, mint 25 unit teszt** összesen, érdemi logikát fednek le (computed
értékek, HTTP rétegen át state update, validátorok).

A tesztek `HttpClientTestingModule` + `HttpTestingController`-rel mock-olnak
minden hálózati hívást, `provideRouter([])` és `provideHttpClient()` injektálással.

### E2E teszt (Cypress)

[`cypress/e2e/booking-flow.cy.ts`](../cypress/e2e/booking-flow.cy.ts) — egy
happy-path: regisztráció → automatikus login → szolgáltatás kiválasztása →
foglalás form kitöltése → a foglalás megjelenése a profilon.

Futtatás:

```bash
npm run dev          # Indítja az API-t és az Angular dev servert
npm run cy:open      # GUI módban, vagy
npm run cy:run       # headless módban
```

---

## 3.5 Deploy és üzemeltetés (3 pont)

### Backend — Render.com (free tier)

A [`render.yaml`](../render.yaml) leírja a service-et:

- runtime: node
- start: `npx json-server-auth --watch db.json --routes routes.json --port $PORT --host 0.0.0.0`
- a free tier ~30s-ig "alszik" inaktivitás után, de a kiértékeléshez ez elég

Lépések:

1. Hozz létre egy Render fiókot → kösd össze a GitHub repóval.
2. New → Web Service → válaszd ki ezt a repót.
3. Render automatikusan beolvassa a `render.yaml`-t és felteszi a service-t.
4. Megkapod a publikus URL-t (pl. `https://nailtime-api.onrender.com`).

### Frontend — Vercel

A [`vercel.json`](../vercel.json) konfigurálva: a Vercel `npm run build`-et
futtat, majd a `dist/nail-booking/browser` mappát szolgálja ki, az SPA
útvonalakat `/index.html`-re irányítva (rewrite szabály).

Lépések:

1. Vercel fiók → kösd be a GitHub repót.
2. Import Project → automatikus detektálás.
3. **Fontos:** A [`environment.prod.ts`](../src/environments/environment.prod.ts)
   `apiUrl` mezőjét állítsd a Render backend URL-jére, mielőtt build-elsz.
4. Megkapod a publikus URL-t (pl. `https://nailtime.vercel.app`).

### README.md

A [`README.md`](../README.md) tartalmazza a projekt célját, a futtatási
lépéseket lokálisan, és a deployolt URL-eket.

---

## Összegzett önértékelés

| Szempont | Max. | Önbecsült |
|---|---|---|
| Autentikáció | 5 | 5 |
| Jogosultságkezelés és védelem | 5 | 5 |
| Input validáció és biztonság | 2 | 2 |
| Tesztelés | 5 | 5 |
| Deploy és üzemeltetés | 3 | 3 |
| **Összesen** | **20** | **20** |

> A deploy 1+1 pontját csak akkor lehet megkapni, ha a backend és a frontend
> ténylegesen elérhető publikus URL-en — ezt a Render és a Vercel deploy után
> manuálisan kell tesztelni és a README-be linkelni.
