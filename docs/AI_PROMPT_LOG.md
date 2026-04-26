# AI Prompt Napló

Ez a fájl rögzíti, hogy a projekt során milyen AI eszközöket és prompt-okat
használtam.

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
3. **Felépítette a `db.json` seed adatbázist** a 6 entitásra konzisztens
   ID-hivatkozásokkal.
4. **Generált TypeScript modelleket** a `core/models/models.ts`-be a
   DATAMODEL.md alapján.
5. **Service réteget hozott létre** (`core/services/*-api.service.ts`) — egy
   service entitásonként, signal-alapú belső store-ral, computed derived
   állapottal.
6. **Globális hibakezelést** írt (`error.interceptor.ts`) a HTTP rétegre.
7. **Toast** és **Confirm** service-eket írt a UX kiegészítésekhez.
8. **Frissítette a komponenseket** úgy, hogy a service-eken keresztül
   kommunikáljanak a backenddel (signals + Observables), reaktív formokat
   állított össze validációval.
9. **Új admin nézetet** adott a Service entitás teljes CRUD-jához.
10. **A Profil oldalt felhasználó-szűrt foglaláslistára** építette át, edit /
    cancel megerősítő dialógussal.
11. **A Services oldalra keresést** (debounce-olt), szűrést, rendezést és
    lapozást tett, az állapotot URL query paraméterekbe szinkronizálva.
12. **Empty state komponenst** írt és minden lista alatt használja, ha üres.
13. **README.md** és új **`docs/MILESTONE2.md`** fájl: a 2. mérföldkő
    követelményeit a megvalósítás konkrét fájljaira / komponenseire képezi le.
14. **Build-verifikáció:** `ng build` lefutott hibátlanul, a kezdeti compile
    warning (`*ngIf` import az `EmptyStateComponent`-ben) javítva.

### Manuális ellenőrzés
- `npm run server` → `db.json` szerver fut, REST végpontok elérhetők.
- `npm start` → frontend lefordul, és a böngészőben a listák, foglalás,
  admin CRUD működik a backendből töltött adattal.

---

## 1. mérföldkő (korábbi munka)

A tárgy nyitó mérföldkövénél is használtam Claude-ot a komponens-terv és a
DATAMODEL.md megfogalmazásához, illetve egy-egy stílus/CSS finomításhoz.
A vázlatokat minden esetben átolvastam és módosítottam, ahol az alkalmazás
saját stílusához nem illett.
