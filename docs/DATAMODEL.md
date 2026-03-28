## Áttekintés

Az alkalmazás első mérföldkövében még nincs tényleges backend implementáció, de a felület működéséhez és a későbbi bővíthetőséghez szükséges egy logikus adatmodell megtervezése.

Az alábbi modell egy műkörmös időpontfoglaló rendszer alapvető entitásait írja le.

---

## Entitások

## 1. User

A rendszer felhasználója, lehet vendég vagy adminisztratív / szolgáltatói szerepkörű felhasználó.

| Mező | Típus | Leírás |
|---|---|---|
| id | number | Egyedi azonosító |
| fullName | string | Teljes név |
| email | string | E-mail cím |
| phone | string | Telefonszám |
| role | 'guest' \| 'client' \| 'admin' | Felhasználói szerepkör |
| createdAt | Date | Regisztráció / létrehozás ideje |

---

## 2. Service

A körmös által nyújtott szolgáltatás.

| Mező | Típus | Leírás |
|---|---|---|
| id | number | Egyedi azonosító |
| name | string | Szolgáltatás neve |
| description | string | Rövid leírás |
| durationMinutes | number | Időtartam percben |
| price | number | Ár forintban |
| isActive | boolean | Aktív-e a szolgáltatás |

---

## 3. Appointment

A lefoglalt időpontot reprezentáló entitás.

| Mező | Típus | Leírás |
|---|---|---|
| id | number | Egyedi azonosító |
| userId | number | Foglaló felhasználó azonosítója |
| serviceId | number | A kiválasztott szolgáltatás azonosítója |
| appointmentDate | Date | A foglalás időpontja |
| status | 'pending' \| 'confirmed' \| 'cancelled' \| 'completed' | Foglalás állapota |
| note | string | Vendég megjegyzése |
| createdAt | Date | Foglalás létrehozásának ideje |

---

## 4. TimeSlot

A foglalható időablakokat leíró entitás.

| Mező | Típus | Leírás |
|---|---|---|
| id | number | Egyedi azonosító |
| start | Date | Idősáv kezdete |
| end | Date | Idősáv vége |
| isAvailable | boolean | Szabad-e az idősáv |
| serviceId | number \| null | Opcionálisan szolgáltatáshoz kötött idősáv |
| appointmentId | number \| null | Ha foglalt, kapcsolódó foglalás azonosítója |

---

## 5. NailArtist

A szolgáltató / műkörmös adatait tároló entitás.

| Mező | Típus | Leírás |
|---|---|---|
| id | number | Egyedi azonosító |
| fullName | string | Szolgáltató neve |
| email | string | Kapcsolattartási e-mail |
| phone | string | Telefonszám |
| bio | string | Rövid bemutatkozás |
| workingHours | string | Munkaidő leírása |

---

## 6. Review

Vendég által adott értékelés egy szolgáltatásról vagy foglalásról.

| Mező | Típus | Leírás |
|---|---|---|
| id | number | Egyedi azonosító |
| userId | number | Értékelő felhasználó |
| serviceId | number | Értékelt szolgáltatás |
| rating | number | 1–5 közötti értékelés |
| comment | string | Szöveges vélemény |
| createdAt | Date | Létrehozás ideje |

---

## Kapcsolatok

### 1. User — Appointment
- **1:N kapcsolat**
- Egy felhasználónak több foglalása lehet.
- Egy foglalás pontosan egy felhasználóhoz tartozik.

### 2. Service — Appointment
- **1:N kapcsolat**
- Egy szolgáltatás többször is lefoglalható.
- Egy foglalás egy konkrét szolgáltatáshoz tartozik.

### 3. Appointment — TimeSlot
- **1:1 kapcsolat** vagy **1:N logikai kapcsolat**, implementációtól függően
- Egy foglalás egy konkrét időablakhoz kapcsolódik.
- Egy idősáv legfeljebb egy aktív foglaláshoz tartozhat.

### 4. NailArtist — Service
- **1:N kapcsolat**
- Egy műkörmös több szolgáltatást is nyújthat.
- Egy szolgáltatás alapesetben egy szolgáltatóhoz rendelhető.

### 5. User — Review
- **1:N kapcsolat**
- Egy felhasználó több értékelést is adhat.
- Egy értékelés egy felhasználótól származik.

### 6. Service — Review
- **1:N kapcsolat**
- Egy szolgáltatáshoz több értékelés tartozhat.
- Egy értékelés egy szolgáltatáshoz kapcsolódik.

---

## Egyszerű szöveges relációs ábra

```text
User (1) ─── (N) Appointment (N) ─── (1) Service
User (1) ─── (N) Review (N) ─── (1) Service
Appointment (1) ─── (1) TimeSlot
NailArtist (1) ─── (N) Service
```

---

## Megjegyzés az első mérföldkőhöz

Az első mérföldkő UI-központú, ezért az entitások jelenleg tervszinten szerepelnek.  
Az implementált felületen ezek közül több még statikus vagy mock adattal jelenik meg, de a modell már támogatja a későbbi backend-integrációt.
