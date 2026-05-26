# ClickHero ⚔️

Mobilna gra RPG w stylu idle clicker zbudowana w React Native + Expo.

## Funkcjonalności

- **Walka** — tapuj ekran żeby atakować potwory i zdobywać złoto oraz XP
- **Levelowanie** — zdobywaj XP, awansuj i zwiększaj statystyki bohatera
- **Zapis gry** — postęp zapisywany automatycznie (AsyncStorage)
- **Haptyki** — wibracje przy ataku i levelowaniu (expo-haptics)

## Technologie

- [Expo](https://expo.dev/) ~54.0
- [Expo Router](https://docs.expo.dev/router/introduction/) — nawigacja (tabs)
- [Context API + useReducer](https://react.dev/reference/react/createContext) — zarządzanie stanem
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — trwały zapis danych
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — haptyczny feedback

## Wymagania

- Node.js 18+
- npm 9+
- Expo Go (na telefonie)

## Uruchomienie

```bash
git clone <url-repozytorium>
npm install --legacy-peer-deps
npm start
```

Zeskanuj QR kod z terminala aplikacją **Expo Go** na telefonie.
