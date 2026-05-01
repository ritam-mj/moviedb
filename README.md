# Movie-DB 🎬

A React Native movie database app built with [Expo](https://expo.dev) that fetches and displays movie information from the TMDB (The Movie Database) API. Users can browse trending movies, search for specific films, and view detailed information.

## Features

- **Browse Latest Movies**: View popular movies with posters, ratings, and release dates
- **Search Movies**: Real-time movie search with debounced API calls
- **Movie Details**: Navigate to individual movie pages for more information
- **Responsive Grid Layout**: Dynamic 3-column grid layout for movie cards
- **Loading & Error States**: Proper handling of API loading and error states

## Architecture

### Data Fetching Flow

```
┌─────────────────────────────────────────────────────────┐
│           TMDB API (themoviedb.org)                     │
│  - /discover/movie (trending movies)                    │
│  - /search/movie (search functionality)                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │   services/api.ts     │
       │   - fetchMovies()     │
       │   - TMDB_CONFIG       │
       └───────────┬───────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │ services/useFetch.ts  │
       │ (Custom React Hook)   │
       │ - Manages state       │
       │ - Error handling      │
       │ - Loading state       │
       └───────────┬───────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │     React Components  │
       │ - index.tsx (Home)    │
       │ - search.tsx (Search) │
       │ - [id].tsx (Details)  │
       └───────────┬───────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │   UI Components       │
       │ - MovieCard.tsx       │
       │ - SearchBar.tsx       │
       │ - ReportFilter.tsx    │
       └───────────────────────┘
```

### Key Components

#### 1. **API Service** (`services/api.ts`)
- Configures TMDB API connection with authentication token
- Exports `fetchMovies()` function that handles:
  - Default: Fetch popular movies sorted by popularity
  - With query: Search movies by title
- Uses Bearer token authentication via environment variables

#### 2. **useFetch Hook** (`services/useFetch.ts`)
A custom React hook that handles asynchronous data fetching with:
```typescript
- data: T | null         // The fetched movie data
- loading: boolean       // Loading state indicator
- error: Error | null    // Error object if fetch fails
- refetch(): Promise<T>  // Manual retry function
- reset(): void          // Clear all state
```

**Usage Pattern:**
```typescript
const { data: movies, loading, error, refetch } = useFetch(
  () => fetchMovies({ query: 'Inception' }),
  autoFetch  // Optional: whether to fetch on mount
)
```

#### 3. **MovieCard Component** (`components/MovieCard.tsx`)
Displays individual movie items with:
- Movie poster image (from TMDB CDN)
- Title with truncation
- Star rating (vote_average / 2, displayed as 0-5)
- Release year
- Clickable link to movie details page

#### 4. **Home Screen** (`app/(tabs)/index.tsx`)
- Auto-fetches popular movies on mount
- Displays in a 3-column FlatList grid
- Shows loading spinner while fetching
- Displays error messages if API fails

#### 5. **Search Screen** (`app/(tabs)/search.tsx`)
- Real-time search with 500ms debounce to reduce API calls
- Updates results as user types
- Manual control with `loadMovies()` and `reset()` functions
- Clears results when search is empty

### Data Flow Example: Searching for Movies

```
User types in SearchBar
    ↓
onChange → setSearchQuery (state update)
    ↓
useEffect triggers after 500ms debounce
    ↓
loadMovies() calls fetchMovies({ query: searchQuery })
    ↓
fetchMovies sends GET request to TMDB API
    ↓
API returns movie array
    ↓
useFetch updates data state
    ↓
FlatList re-renders with new movie results
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with your TMDB API key:
   ```
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key_here
   ```
   Get your API key from [TMDB](https://www.themoviedb.org/settings/api)

3. **Start the app**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   In the output, choose:
   - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go) for quick testing

## Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Hooks (useState, useEffect)
- **API**: TMDB API with Bearer token authentication
- **Navigation**: React Navigation (bottom tabs)

## Project Structure

```
moviedb/
├── app/                    # Main app screens (Expo Router)
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home - browse popular movies
│   │   ├── search.tsx     # Search movies
│   │   ├── profile.tsx    # Profile screen
│   │   ├── saved.tsx      # Saved movies screen
│   │   └── _layout.tsx    # Tab layout configuration
│   └── movies/
│       └── [id].tsx       # Dynamic movie details page
├── components/            # Reusable UI components
│   ├── MovieCard.tsx      # Movie grid item card
│   ├── SearchBar.tsx      # Search input component
│   └── ReportFilter.tsx   # Filter component
├── services/              # API and data fetching logic
│   ├── api.ts            # TMDB API integration
│   └── useFetch.ts       # Custom fetch hook
├── interfaces/            # TypeScript interfaces
│   └── interfaces.d.ts   # Movie and TrendingMovie types
├── constants/             # Static data
│   ├── icons.ts          # App icons
│   └── images.ts         # Static images
└── package.json           # Dependencies
```

## Development Commands

```bash
npm start          # Start development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run on web browser
npm run lint       # Run ESLint
```

## Movie Data Model

Each movie object from TMDB API contains:
- `id`: Unique movie identifier
- `title`: Movie title
- `poster_path`: Path to movie poster image
- `vote_average`: Rating (0-10 scale)
- `release_date`: ISO date string (YYYY-MM-DD)
- `overview`: Plot summary
- `genre_ids`: Array of genre identifiers
- And more fields defined in `interfaces/interfaces.d.ts`

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [TMDB API Documentation](https://developer.themoviedb.org/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
