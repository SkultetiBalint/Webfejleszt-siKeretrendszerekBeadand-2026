## Komponensfa

```text
AppComponent
├── NavbarComponent
├── RouterOutlet
│   ├── HomePageComponent
│   │   ├── HeroComponent
│   │   └── ServiceCardComponent (több példány)
│   ├── ServicesPageComponent
│   │   └── ServiceCardComponent (több példány)
│   ├── BookingPageComponent
│   │   └── BookingFormComponent
│   ├── ProfilePageComponent
│   │   └── AppointmentCardComponent (több példány)
│   └── NotFoundPageComponent
└── FooterComponent
```

---

## Fő oldalak és komponensek összerendelése

## 1. AppComponent
A teljes alkalmazás gyökérkomponense.  
Feladata:
- globális layout biztosítása,
- skip link megjelenítése,
- navbar és footer megjelenítése,
- `router-outlet` biztosítása az oldalak számára.

### Beágyazott komponensek
- `NavbarComponent`
- `FooterComponent`
- route alapján a megfelelő oldal-komponens

---

## 2. Kezdőlap (`HomePageComponent`)
A landing page szerepét tölti be.

### Tartalmazza
- `HeroComponent`
- több `ServiceCardComponent`

### Feladata
- az alkalmazás rövid bemutatása,
- fő CTA megjelenítése,
- kiemelt szolgáltatások listázása.

---

## 3. Szolgáltatások oldal (`ServicesPageComponent`)
Az összes elérhető szolgáltatás megjelenítése.

### Tartalmazza
- több `ServiceCardComponent`

### Feladata
- szolgáltatások listázása,
- név, időtartam, ár megjelenítése,
- egységes kártyaalapú megjelenés biztosítása.

---

## 4. Időpontfoglalás oldal (`BookingPageComponent`)
A foglalási folyamat fő oldala.

### Tartalmazza
- `BookingFormComponent`

### Feladata
- az időpontfoglalási felület megjelenítése,
- az űrlap számára keret és oldalszintű struktúra biztosítása.

---

## 5. Foglalási űrlap (`BookingFormComponent`)
A tényleges adatbeviteli komponens.

### Feladata
- név, email, szolgáltatás, dátum/idő és megjegyzés mezők kezelése,
- felhasználói interakció kezelése,
- visszajelző üzenet megjelenítése.

---

## 6. Profil / Foglalásaim oldal (`ProfilePageComponent`)
A felhasználó meglévő foglalásait mutatja.

### Tartalmazza
- több `AppointmentCardComponent`

### Feladata
- a foglalások áttekinthető megjelenítése,
- státusz és időpont megjelenítése,
- a felhasználói adatokhoz kötődő nézet biztosítása.

---

## 7. Foglalás kártya (`AppointmentCardComponent`)
Újrahasznosítható kártyakomponens foglalási adatokhoz.

### Feladata
- szolgáltatás neve,
- időpont,
- státusz,
- opcionális műveleti gomb megjelenítése.

---

## 8. Hero szekció (`HeroComponent`)
A kezdőoldal kiemelt tartalmi blokkja.

### Feladata
- fő cím és leírás megjelenítése,
- vizuális hangsúly kialakítása,
- navigáció támogatása CTA gombokkal.

---

## 9. Szolgáltatás kártya (`ServiceCardComponent`)
Újrahasznosítható kártyakomponens szolgáltatásokhoz.

### Feladata
- szolgáltatás neve,
- időtartam,
- ár,
- kiválasztást támogató gomb megjelenítése.

---

## 10. Navigáció (`NavbarComponent`)
Globális navigációs komponens.

### Feladata
- route-ok elérhetővé tétele,
- aktuális oldal vizuális kiemelése,
- reszponzív navigációs layout biztosítása.

---

## 11. Lábléc (`FooterComponent`)
Globális lábléc.

### Feladata
- alap információk megjelenítése,
- egységes oldalzárás biztosítása.

---

## 12. 404 oldal (`NotFoundPageComponent`)
Hibás vagy nem létező route esetén megjelenő oldal.

### Feladata
- felhasználó tájékoztatása,
- visszanavigálás lehetőségének biztosítása.

---

## Oldalak és route-ok

| Route | Oldal-komponens | Főbb alkomponensek |
|---|---|---|
| `/` | `HomePageComponent` | `HeroComponent`, `ServiceCardComponent` |
| `/services` | `ServicesPageComponent` | `ServiceCardComponent` |
| `/booking` | `BookingPageComponent` | `BookingFormComponent` |
| `/profile` | `ProfilePageComponent` | `AppointmentCardComponent` |
| `**` | `NotFoundPageComponent` | - |

---

## Megjegyzés

A komponensstruktúra megfelel a komponens-alapú Angular fejlesztésnek:
- több mint 6 önálló saját komponens szerepel benne,
- van szülő–gyerek komponenshierarchia,
- az oldalak és újrahasznosítható UI-elemek logikailag elkülönülnek.
