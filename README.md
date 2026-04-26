[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Ew36zBjj)
# Webfejlesztési keretrendszerek — Projektmunka

> **Hallgató neve:** _Skultéti Bálint_  
> **Neptun kód:** _B4WAJX_  
> **Projekt téma:** _Műkörmös időpontfoglaló oldal_  
> **Keretrendszer:** _Angular_

---

## 🚀 A projekt indítása (lokális futtatás)

```bash
git clone <repo-url>
cd <projekt-mappa>
npm install

# Frontend + json-server backend egyszerre (ajánlott):
npm run dev

# Vagy két külön terminálban:
npm run server   # http://localhost:3000  (json-server, db.json)
npm start        # http://localhost:4200  (Angular dev server)
```

A frontend a `src/environments/environment.ts` fájl `apiUrl` értékét használja
(alapértelmezetten `http://localhost:3000`).

---

## 🌐 Publikus URL

> _[Írd ide a deployolt alkalmazás URL-jét, pl. https://my-app.web.app]_

---

## 📁 Projekt struktúra

```
├── docs/                    # Dokumentáció
│   ├── SPECIFICATION.md     # Funkcionális és nem-funkcionális követelmények
│   ├── DATAMODEL.md         # Adatmodell (entitások, kapcsolatok)
│   ├── COMPONENTS.md        # Komponens-terv
│   └── AI_PROMPT_LOG.md     # AI prompt napló
├── src/                     # Forráskód
├── public/                  # Publikus statikus fájlok (ha van)
├── .github/workflows/       # Automatikus értékelés (ne módosítsd!)
├── angular.json             # Angular workspace konfiguráció
├── package.json             # Projektfüggőségek és scriptek
└── README.md                # Projektleírás
└── .github/workflows/       # Automatikus értékelés (ne módosítsd!)
```

---

## 📅 Mérföldkövek

| # | Tartalom | Határidő | Állapot |
|---|----------|----------|---------|
| 1 | Specifikáció, UI és megjelenés | 2026.03.29. 23:59 | ✅ |
| 2 | Backend és adatok | 2026.04.26. 23:59 | ✅ |
| 3 | Biztonság és tesztelés | 2026.05.10. 23:59 | ⬜ |

### 2. mérföldkő — Backend és adatok

A részletes leírást ld.: [`docs/MILESTONE2.md`](docs/MILESTONE2.md).

Röviden:

- **Backend:** `json-server` REST API a `db.json` seed adattal (`npm run server`)
- **Entitások:** 6 (User, NailArtist, Service, TimeSlot, Appointment, Review),
  egymással hivatkozó kapcsolatokkal — ld. [`docs/DATAMODEL.md`](docs/DATAMODEL.md)
- **CRUD:** teljes CRUD a `Service` és `Appointment` entitásokon (UI-ról is),
  Read a többin
- **Service réteg:** `src/app/core/services/*-api.service.ts` — egy service / entitás
- **Állapotkezelés:** signal-alapú store-ok, `computed` derived state-tel
  (`upcoming`/`past` foglalások, `activeServices`, `priceRange`, …)
- **Reaktív formok, validációval:** `services-admin-page`, `booking-form`
- **UX:** loading spinner, hibaüzenet, üres állapot, toast, megerősítő dialógus,
  keresés (debounce-szal), szűrés, rendezés, lapozás, URL-szinkronizált
  állapot.

### Hogyan kérd az értékelést?

1. Commitold és push-old a munkádat a `main` vagy `master` branch-re
2. Menj a repód **Actions** fülére
3. Válaszd a **"Mérföldkő értékelés"** workflow-t
4. Kattints a **"Run workflow"** → válaszd ki a mérföldkövet → **"Run workflow"**
5. Az eredmény egy **GitHub Issue**-ban jelenik meg

> ⚠️ Mérföldkőnként **maximum 2 alkalommal** futtathatod az értékelést. Használd bölcsen!  
> ⚠️ A határidőkön automatikus értékelés is fut.

---

## ⚠️ Fontos

- A `.github/workflows/` könyvtár tartalmát **ne módosítsd**!
- A `docs/` mappába rakd a dokumentációs fájlokat.
- Az `AI_PROMPT_LOG.md` fájlt a `docs/` mappában vezesd.