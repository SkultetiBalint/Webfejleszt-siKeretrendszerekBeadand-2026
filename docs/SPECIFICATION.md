## Projekt leírás

A **NailTime** egy Angular alapú, reszponzív műkörmös időpontfoglaló alkalmazás felülete.  
Az alkalmazás célja, hogy a vendégek gyorsan és egyszerűen át tudják tekinteni az elérhető szolgáltatásokat, időpontot tudjanak foglalni, valamint meg tudják nézni a saját foglalásaikat.

A felület elsődleges célcsoportja:
- műkörmös szolgáltatást igénybe vevő vendégek,
- a szolgáltató, aki a jövőben adminisztrációs vagy kezelőfelületi funkciókon keresztül használhatja az alkalmazást.

Az első mérföldkő fókusza a frontend UI, a navigáció, a reszponzív megjelenés, az accessibility és a komponens-alapú felépítés.

---

## Funkcionális követelmények

### 1. Navigáció és oldalstruktúra
- Az alkalmazás többoldalas, kliensoldali routingot használ.
- A felhasználó navigációs menün keresztül érheti el a fő oldalakat.
- Az aktuális oldal a navigációban vizuálisan kiemelve jelenik meg.
- Ismeretlen URL esetén egyedi 404 oldal jelenik meg.

### 2. Kezdőlap
- Bemutatja az alkalmazás fő célját.
- Kiemelt CTA (Call to Action) gombot tartalmaz időpontfoglaláshoz.
- Röviden megjeleníti a népszerű vagy kiemelt szolgáltatásokat.

### 3. Szolgáltatások oldal
- Kilistázza az elérhető körmös szolgáltatásokat.
- Minden szolgáltatás külön kártyán jelenik meg.
- A szolgáltatáshoz megjelenik név, időtartam és ár.

### 4. Időpontfoglalás oldal
- A felhasználó űrlapon keresztül adhatja meg a foglalás adatait.
- Az űrlap tartalmazza a név, e-mail, szolgáltatás, dátum/idő és megjegyzés mezőket.
- A sikeres művelet után visszajelzés jelenik meg a felhasználónak.

### 5. Profil / Foglalásaim oldal
- A felhasználó láthatja a korábbi vagy közelgő foglalásait.
- Az időpontok külön kártyákon jelennek meg.
- Minden foglalásnál látható a szolgáltatás neve, időpontja és státusza.

### 6. UI és felhasználói élmény
- A felület mobilközpontú (mobile-first) felépítésű.
- A megjelenés mobil, tablet és desktop nézetre is optimalizált.
- A gombok és interaktív elemek érintőképernyőn is kényelmesen használhatók.
- A felület egységes design token rendszerre épül.

---

## Nem-funkcionális követelmények

### Technológiai döntések
- **Frontend keretrendszer:** Angular
- **Nyelv:** TypeScript
- **Stílusozás:** CSS (globális tokenek + komponensszintű stílusok)
- **Routing:** Angular Router
- **Űrlapkezelés:** Template-driven form (`ngModel`)
- **Backend:** az első mérföldkőben nincs tényleges backend, a foglalási és profil adatok mock / statikus adatokkal jelennek meg

### UX és megjelenési elvárások
- Mobile-first megközelítés
- Legalább 3 breakpoint: mobil, tablet, desktop
- Egységes spacing, színek, tipográfia, árnyékok, lekerekítések
- Könnyen értelmezhető navigáció
- Világos információs hierarchia
- Modern, nőies, letisztult vizuális stílus a témához illeszkedően

### Accessibility elvárások
- Szemantikus HTML elemek használata
- Helyes heading-hierarchia
- Látható fókuszállapot interaktív elemeken
- Alapvető billentyűzetes navigálhatóság
- ARIA attribútumok használata, ahol szükséges
- Skip link az oldal elején

### Teljesítmény és karbantarthatóság
- Komponens-alapú felépítés
- Újrahasznosítható UI komponensek
- Egyszerűen bővíthető struktúra
- Kisebb, önálló felelősségi körű komponensek

---

## Felhasználói szerepkörök / interakciós módok

### 1. Vendég / látogató
A vendég megtekintheti a kezdőlapot és a szolgáltatásokat, valamint megnyithatja a foglalási oldalt.  
A fő célja az információgyűjtés és az időpontfoglalás.

### 2. Regisztrált ügyfél / visszatérő felhasználó
A felhasználó a saját foglalásait is megtekintheti a Profil / Foglalásaim oldalon.  
A fő célja a meglévő időpontok áttekintése és a későbbi ügyfélfolyamat támogatása.

> Megjegyzés: az első mérföldkőben a szerepkörök elsősorban UI-szinten különülnek el, nem jogosultsági rendszerrel.

---

## Képernyő-lista / sitemap

### Fő oldalak
1. **Kezdőlap** (`/`)
2. **Szolgáltatások** (`/services`)
3. **Időpontfoglalás** (`/booking`)
4. **Profil / Foglalásaim** (`/profile`)
5. **404 / Not Found** (`**`)

### Navigáció leírása
- A felső navigációs sáv minden főoldalon látható.
- A menüből közvetlenül elérhető a Kezdőlap, Szolgáltatások, Foglalás és Profil oldal.
- Az aktuális route vizuálisan kiemelt állapotban jelenik meg.
- Hibás URL esetén a felhasználó a 404 oldalra kerül, ahonnan visszanavigálhat a kezdőlapra.

### Egyszerű sitemap

```text
Kezdőlap
├── Szolgáltatások
├── Időpontfoglalás
├── Profil / Foglalásaim
└── 404 oldal
```
