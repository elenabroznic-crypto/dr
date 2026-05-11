# 🇭🇷 Povijesni Analitičar: Arhivator

![Historical Analysis Concept](https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1000)

**Arhivator** je napredna web aplikacija koja koristi **Gemini AI** za dubinsku analizu povijesnih tekstova, primarno fokusiranih na razdoblje Domovinskog rata u Hrvatskoj. Aplikacija transformira linearne povijesne zapise u interaktivne vizualne mreže, omogućujući istraživačima i entuzijastima da lakše identificiraju ključne aktere i prirodu njihovih odnosa.

## 🚀 Ključne Funkcionalnosti

### 1. AI-Powered Ekstrakcija Entiteta
Koristeći najnovije Gemini modele, sustav automatski identificira:
- **Pojedince**: Političke i vojne vođe.
- **Vlade i Države**: Nacionalne entitete i njihove politike.
- **Međunarodne Organizacije**: UN, EU, promatračke misije.
- **Događaje**: Ključne sporazume i prekretnice.

### 2. Relacijsko Mapiranje
Aplikacija ne samo da pronalazi aktere, već i kategorizira tipove interakcija:
- 🤝 **Diplomacija**: Pregovori i mirovne inicijative.
- ⚔️ **Sukob**: Vojne operacije i agresije.
- 📜 **Sporazum**: Potpisani dokumenti i prekretnice (npr. Daytonski sporazum).

### 3. Interaktivna Mrežna Vizualizacija
Izgrađena pomoću **D3.js**, aplikacija generira dinamički graf gdje:
- Veličina i boja čvorova označavaju tip aktera.
- Linije (linkovi) vizualiziraju povezanost i tip odnosa.
- Zumiranje i povlačenje omogućuju detaljno proučavanje kompleksnih mreža.

### 4. Bento Grid Dizajn
Suvremeno i pregledno sučelje inspirirano bento-grid estetikom pruža modularan uvid u tekst, popis aktera, statistiku relacija i samu vizualizaciju.

## 🛠️ Tehnološki Stog

- **Frontend**: React 19 + TypeScript
- **Stil: ** Tailwind CSS
- **Animacije**: Motion (framer-motion)
- **Vizualizacija**: D3.js
- **AI**: Google Gemini API (@google/genai)
- **Ikone**: Lucide React

## 📈 Planirani Razvoj (Roadmap)

S obzirom na važnost povijesne točnosti i edukaciju, u budućim verzijama planiramo:

- [ ] **Uvoz PDF dokumenata**: Direktna analiza skeniranih arhivskih materijala pomoću OCR-a.
- [ ] **Vremenska lenta (Timeline Slider)**: Mogućnost pregleda kako se mreža odnosa mijenjala iz godine u godinu (1991. -> 1995.).
- [ ] **Izvoz Podataka**: Mogućnost izvoza analize u JSON ili CSV format za znanstvene radove.
- [ ] **Edukativni Moduli**: Integracija provjerenih izvora iz Memorijalno-dokumentacijskog centra Domovinskog rata.
- [ ] **Multi-jezična podrška**: Analiza stranih tekstova o sukobu radi identifikacije vanjskih perspektiva.

## 📝 Kako koristiti?

1. Zalijepite tekst u prozirno polje za unos (donji lijevi modul).
2. Kliknite na **"Pokreni Analizu"** u gornjem desnom kutu.
3. Pričekajte da Gemini AI procesira podatke i generira graf.
4. Istražite čvorove klikom na njih za detalajnije opise.

---
*Ovaj projekt je razvijen u svrhu edukacije i digitalne humanističke analize.*
