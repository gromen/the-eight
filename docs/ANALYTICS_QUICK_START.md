# Analytics Quick Start - Dla Klienta

## ✅ Co Już Jest Zrobione (Kod w Sklepie)

Google Tag Manager (GTM) jest już zainstalowany w sklepie i śledzi:
- 👁️ Wyświetlenia produktów
- 🛍️ Wyświetlenia kolekcji
- ➕ Dodawanie do koszyka
- ➖ Usuwanie z koszyka
- 💳 Rozpoczęcie procesu checkout

**Kod jest gotowy - teraz trzeba tylko połączyć z Google Analytics.**

---

## 🚀 Co Musisz Zrobić (15 minut)

### Krok 1: Utwórz Konto Google Analytics 4

1. Idź na: https://analytics.google.com
2. Zaloguj się swoim kontem Google (lub utwórz nowe)
3. Kliknij **"Create"** / **"Utwórz"**
4. Nazwa: `Twoja Firma - Sklep`
5. Strefa czasowa: **Poland**
6. Waluta: **PLN**
7. Kliknij **Next** / **Dalej**

### Krok 2: Ustaw Strumień Danych (Data Stream)

1. Wybierz platformę: **Web**
2. URL strony: `https://twoj-sklep.myshopify.com` (lub własna domena)
3. Nazwa: `Główna strona sklepu`
4. **Enhanced measurement** - zostaw włączone ✅
5. Kliknij **Create stream**

### Krok 3: Skopiuj ID Pomiarowe

Po utworzeniu zobaczysz:
```
Measurement ID: G-XXXXXXXXXX
```

**Skopiuj to ID** - będzie potrzebne w kolejnym kroku!

---

### Krok 4: Połącz GA4 z Google Tag Manager

1. Idź na: https://tagmanager.google.com
2. Wybierz kontener: **GTM-NN78D2QH**
3. **Tags** (Tagi) → **New** (Nowy)

**Utwórz tag konfiguracyjny:**
- Nazwa: `GA4 - Konfiguracja`
- Typ: **Google Analytics: GA4 Configuration**
- **Measurement ID:** wklej skopiowane `G-XXXXXXXXXX`
- **Triggering:** All Pages (Wszystkie strony)
- **Save** (Zapisz)

**Utwórz tagi dla eventów** (powtórz 5 razy dla każdego eventu):

| Nazwa Tagu | Event Name | Trigger (Custom Event) |
|-----------|-----------|----------------------|
| GA4 - View Item | `view_item` | view_item |
| GA4 - View Item List | `view_item_list` | view_item_list |
| GA4 - Add to Cart | `add_to_cart` | add_to_cart |
| GA4 - Remove from Cart | `remove_from_cart` | remove_from_cart |
| GA4 - Begin Checkout | `begin_checkout` | begin_checkout |

**Dla każdego tagu:**
1. **Tags** → **New**
2. Tag type: **Google Analytics: GA4 Event**
3. Configuration Tag: Wybierz `GA4 - Konfiguracja`
4. Event Name: wpisz nazwę z tabeli (np. `view_item`)
5. Event Parameters: **Send ecommerce data** (zaznacz checkbox)
6. Triggering: **Custom Event** → Event name = (nazwa z kolumny "Trigger")
7. Save

### Krok 5: Opublikuj Zmiany

1. Kliknij **Submit** (górny prawy róg w GTM)
2. Nazwa wersji: `Połączenie z GA4`
3. **Publish** (Opublikuj)

---

## ✅ Testowanie (5 minut)

### Sprawdź czy działa:

1. **W GTM:** Kliknij **Preview** → Wpisz adres sklepu → **Connect**
2. **Otwórz sklep** w nowej karcie
3. **Przejdź na stronę produktu** - powinien pojawić się event `view_item`
4. **Dodaj do koszyka** - powinien pojawić się event `add_to_cart`
5. **Kliknij "Checkout"** - powinien pojawić się event `begin_checkout`

### Sprawdź w Google Analytics:

1. GA4 → **Reports** → **Realtime**
2. Wykonaj akcje w sklepie (przeglądaj, dodawaj do koszyka)
3. Po kilku sekundach powinieneś zobaczyć eventy w czasie rzeczywistym

**Widzisz dane? ✅ Działa!**

---

## 📊 Gdzie Znaleźć Dane (Po 24-48h)

### Raporty w GA4:

1. **Realtime** - Co dzieje się teraz (na żywo)
2. **Engagement → Events** - Wszystkie eventy (ile kliknięć, dodań do koszyka)
3. **Monetization → Ecommerce purchases** - Sprzedaż, przychody
4. **Acquisition** - Skąd przychodzą użytkownicy (Google, Facebook, direct)

### Najważniejsze Metryki:

- **Users** - Ilu użytkowników odwiedziło sklep
- **Sessions** - Ile sesji/wizyt
- **Conversion rate** - % konwersji (zakupów)
- **Revenue** - Przychód
- **Add to cart rate** - Ile osób dodało do koszyka

---

## 🆘 Problemy?

**Nie widzę eventów w GTM Preview?**
- Upewnij się, że strona jest opublikowana (nie draft)
- Wyczyść cache przeglądarki (Ctrl+Shift+R)

**Nie widzę danych w GA4?**
- Sprawdź czy Measurement ID jest poprawne
- Poczekaj 24-48h na pełne przetworzenie danych
- Sprawdź czy GTM jest opublikowany (Submit → Publish)

**Jak dodać zakupy (purchase)?**
- Shopify Admin → Settings → Customer events
- Add custom pixel → Google Analytics 4
- Wklej Measurement ID: `G-XXXXXXXXXX`

---

## 📞 Pomoc

Szczegółowy przewodnik: `GTM_GA4_SETUP.md`

Masz problem? Napisz do developera - przekaże ID kontenera i szczegóły techniczne.
