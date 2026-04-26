# 2. mérföldkő — Backend és adatok

Ez a dokumentum a 2. mérföldkő (Backend és adatok) értékelési szempontjaihoz
rendeli hozzá a projekt konkrét megvalósításait, fájlhivatkozásokkal együtt.

---

## A backend technológiája

A választás **`json-server`** lett:

- minimális, de valódi REST API (HTTP-n keresztül),
- automatikus CRUD végpontok (`GET / POST / PATCH / DELETE`),
- támogat keresést (`?q=`), szűrést (`?mező=érték`), rendezést
  (`?_sort=&_order=`), és lapozást (`?_page=&_limit=`),
- a teljes adat egyetlen `db.json` fájlban él, így a perzisztencia biztosított
  és a fejlesztés / kiértékelés is teljesen reprodukálható.

A backend indítása:

```bash
npm run server     # http://localhost:3000
# vagy frontenddel együtt:
npm run dev
```

Az alkalmazás minden hálózati hívása az
[`environment.apiUrl`](../src/environments/environment.ts) értékére mutat,
így könnyen átállítható egy másik backendre (pl. Firebase, saját Express API).

---

## 2.1 Adatmodell és entitások (4 pont)

Az alkalmazás **6 entitást** kezel, amelyek egymással kapcsolatban állnak.
Az entitásokat a [`docs/DATAMODEL.md`](DATAMODEL.md) fájl részletesen leírja,
TypeScript típusként pedig a
[`src/app/core/models/models.ts`](../src/app/core/models/models.ts) fájl
deklarálja őket.

| # | Entitás | Mezők (kivonat) | Kapcsolatok |
|---|---|---|---|
| 1 | `User` | id, fullName, email, phone, role, createdAt | 1—N → Appointment, 1—N → Review |
| 2 | `NailArtist` | id, fullName, bio, workingHours, photoUrl | 1—N → Service |
| 3 | `Service` | id, name, description, durationMinutes, price, isActive, **artistId** | 1—N → Appointment, 1—N → Review, N—1 ← NailArtist |
| 4 | `TimeSlot` | id, start, end, isAvailable, serviceId, appointmentId | 1—1 ↔ Appointment, N—1 ← Service |
| 5 | `Appointment` | id, userId, serviceId, appointmentDate, status, note, createdAt | N—1 ← User, N—1 ← Service |
| 6 | `Review` | id, userId, serviceId, rating, comment, createdAt | N—1 ← User, N—1 ← Service |

A seed adat a [`db.json`](../db.json) fájlban van (4 user, 2 artist, 6 service,
4 time slot, 4 appointment, 4 review), és az ID-alapú hivatkozások végig
konzisztensek.

---

## 2.2 CRUD műveletek (6 pont)

| Művelet | Hol látható az UI-on? | Milyen entitásokon? |
|---|---|---|
| **Create** | `Foglalás` oldal — `app-booking-form` (validációval), `Admin → Szolgáltatások` — új szolgáltatás reaktív formmal | Appointment, Service |
| **Read** | `Szolgáltatások` (listázás + keresés + szűrés + rendezés + lapozás), `Részletek` oldal, `Profil` (saját foglalások), `Műkörmösök`, `Admin` | mind a 6 |
| **Update** | `Profil` — foglalás szerkesztése (új időpont, megjegyzés), `Admin` — szolgáltatás szerkesztése | Appointment, Service |
| **Delete** | `Profil` — foglalás törlése (megerősítő dialóggal), `Admin` — szolgáltatás törlése | Appointment, Service |

Az `Appointment` és `Service` entitásokon **teljes CRUD** van, a többi entitáson
legalább **Read** (lista + részletek). Pl.:

- `NailArtist`: lista a `Műkörmösök` oldalon + select a foglalás formban,
- `User`: a profil oldal és az értékelők neve hivatkozik rá,
- `Review`: a `Részletek` oldalon átlag-rating + lista,
- `TimeSlot`: a foglalás során elérhető idősávok forrása.

A listanézet **kereséssel + szűréssel + rendezéssel + lapozással** rendelkezik:
[`services-page.component.ts`](../src/app/features/services/services-page/services-page.component.ts).

---

## 2.3 Backend integráció és perzisztencia (5 pont)

- **Backend kapcsolat:** Minden adat a json-serverből töltődik HTTP-n keresztül
  (`HttpClient`), nincs hard-coded mock a komponensekben.
- **Írási műveletek:** A Create / Update / Delete műveletek `POST` / `PATCH` /
  `DELETE` hívásokon keresztül a backenden végrehajtódnak, és a `db.json` ezt
  el is menti (perzisztencia).
- **Service réteg:** Minden entitásnak külön HTTP service-e van a
  [`core/services/`](../src/app/core/services/) mappában:
  - `service-api.service.ts` (full CRUD + search/sort/filter)
  - `appointment-api.service.ts` (full CRUD + computed upcoming/past)
  - `review-api.service.ts` (full CRUD + average rating)
  - `nail-artist-api.service.ts` (read)
  - `user-api.service.ts` (read)
  - `time-slot-api.service.ts` (read + reserve/release)

  A komponensek **kizárólag** ezeken a service-eken keresztül kommunikálnak
  a backenddel.

A globális hibakezelést a
[`error.interceptor.ts`](../src/app/core/interceptors/error.interceptor.ts)
végzi: minden HTTP hibát egységes user-friendly üzenetté alakít és toastként
megjelenít.

---

## 2.4 Állapotkezelés (4 pont) — alkalmazott technikák

| # | Technika | Hol? |
|---|---|---|
| 1 | **Központi állapotkezelés service-ben** | minden `*-api.service.ts` belső signal-store-t tart fenn (pl. `_services`, `_appointments`, `_reviews`) |
| 2 | **Reaktív adatfolyam (signals)** | a komponensek a `services()`, `appointments()`, `loading()`, `error()` signalokat olvassák; a frissítés automatikusan átfut a UI-on |
| 3 | **Form állapotkezelés (reactive forms)** | `services-admin-page` és `booking-form` `FormBuilder` + `Validators` alapú reactive formot használnak |
| 4 | **Computed / derived state** | `activeServices`, `priceRange`, `upcoming`, `past`, `averageRating`, `availableSlots`, `filteredServices`, `pagedServices`, `totalPages` |
| 5 | **URL-szinkronizált állapot** | a `services-page` keresés / rendezés / szűrés / lapozás állapotát query paraméterekbe írja és onnan olvassa is vissza |

Mind az 5 technika él, így a **4 pontos** kategóriának megfelel.

---

## 2.5 Aszinkron műveletek kezelése (3 pont)

| # | Technika | Hol? |
|---|---|---|
| 1 | **Loading spinner** | [`loading-spinner.component`](../src/app/shared/components/loading-spinner/) — minden listázó és admin oldal használja a service `loading()` signalját |
| 2 | **Hibakezelés** | globális `error.interceptor` → toast, plusz lokális `error()` signalok megjelenítése |
| 3 | **Üres állapot (empty state)** | [`empty-state.component`](../src/app/shared/components/empty-state/) — pl. profilon "Nincs közelgő foglalásod", listán "Nincs találat" |
| 4 | **Toast / snackbar** | [`toast.service`](../src/app/core/services/toast.service.ts) + `toast-container.component` — sikeres és sikertelen műveleteknél is |
| 5 | **Debounce a keresésen** | `services-page` — `Subject` + `debounceTime(250)` + `distinctUntilChanged()` |

5 technika él (a követelmény "legalább 4" volt a 3 ponthoz).

---

## 2.6 Felhasználói élmény kiegészítések (3 pont)

| # | Technika | Hol? |
|---|---|---|
| 1 | **Megerősítő dialógus** | [`confirm.service`](../src/app/core/services/confirm.service.ts) + `confirm-dialog.component` — szolgáltatás törlése, foglalás törlése |
| 2 | **Keresés** | `services-page` — debounce-olt keresés név/leírás alapján |
| 3 | **Szűrés** | `services-page` — "csak aktív" toggle |
| 4 | **Rendezés** | `services-page` — név / ár / időtartam, asc/desc |
| 5 | **Lapozás** | `services-page` — egyszerű pagination (page + page size) |
| 6 | **Form validáció vizuális visszajelzéssel** | `services-admin-page` és `booking-form` — minden mező alatt inline hibaüzenet (`required`, `minlength`, `maxlength`, `min`, `max`, `pattern`, `email`, custom `pastDate`) |

Mind a 6 technika él (a követelmény "legalább 4" volt a 3 ponthoz).

---

## Összegzett önértékelés

| Szempont | Max. | Önbecsült |
|---|---|---|
| Adatmodell és entitások | 4 | 4 |
| CRUD műveletek | 6 | 6 |
| Backend integráció és perzisztencia | 5 | 5 |
| Állapotkezelés | 4 | 4 |
| Aszinkron műveletek kezelése | 3 | 3 |
| Felhasználói élmény kiegészítések | 3 | 3 |
| **Összesen** | **25** | **25** |
