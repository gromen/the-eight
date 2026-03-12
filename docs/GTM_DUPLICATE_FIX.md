# Fix: Duplicate GTM Containers

## Problem
Google Tag Assistant pokazuje błąd:
```
Tag Google: nie znaleziono elementu GTM-KV7828VX
```

Wykryto **dwa** kontenery GTM:
- ❌ `GTM-KV7828VX` (stary/nieistniejący)
- ✅ `GTM-NN78D2QH` (poprawny, w theme)

## Przyczyna
Stary GTM container jest dodany przez **Shopify Admin → Customer Events** lub aplikację.

## Rozwiązanie

### Krok 1: Usuń Stary GTM z Shopify Admin

1. **Shopify Admin** → **Settings** → **Customer events**
2. Znajdź sekcję **Custom pixels** lub **Pixels**
3. Szukaj pixela z ID `GTM-KV7828VX`
4. Kliknij **...** (menu) → **Remove** / **Delete**
5. **Save** / Zapisz

### Krok 2: Sprawdź Zainstalowane Aplikacje

1. **Shopify Admin** → **Apps**
2. Szukaj aplikacji GTM/Analytics (np. "Google Tag Manager", "GTM Pixel")
3. Jeśli znajdziesz - **odinstaluj** (mamy GTM w theme, nie potrzebujemy app)

### Krok 3: Weryfikacja

Po usunięciu:

1. Wyczyść cache przeglądarki (Ctrl+Shift+R / Cmd+Shift+R)
2. Odśwież stronę sklepu
3. Otwórz **Google Tag Assistant** (rozszerzenie Chrome)
4. Sprawdź - powinien być tylko: ✅ `GTM-NN78D2QH`

### Krok 4: Test GTM Preview

1. GTM → **Preview**
2. Wpisz URL sklepu
3. **Connect**
4. Sprawdź czy:
   - Container się łączy
   - Eventi się pushują (view_item, add_to_cart)
   - Brak błędów w konsoli

## Gdzie Szukać (Priorytet)

1. **Shopify Admin → Settings → Customer events** (najprawdopodobniej tutaj)
2. **Shopify Admin → Apps** (aplikacje typu "GTM", "Analytics")
3. **Shopify Admin → Online Store → Preferences** → Google Analytics (stara integracja)

## Po Naprawie

Gdy zostanie tylko `GTM-NN78D2QH`:
1. ✅ Przetestuj wszystkie eventi w GTM Preview
2. ✅ Skonfiguruj GA4 (jeśli jeszcze nie)
3. ✅ Opublikuj GTM container
4. ✅ Sprawdź dane w GA4 Realtime

---

**TL;DR:** Idź do Shopify Admin → Settings → Customer events → Usuń pixel z `GTM-KV7828VX`
