# TMDb App (React + TypeScript + Vite)

The app shows top movies for each year and users can filter by
genre, the app also loads top movies from previous / next years as the user scrolls through the
list.

## How to run the app:

- The default branch is `master`.
- Clone the respository in your local using `git clone <git-url>`
- Run `npm install` to install all the dependencies
- Run `npm run dev`
- Open `localhost:5173` in any browser of your choice

## Things which are covered:

- The application is written in TypeScript
- The app uses infinite scrolling to load movies using Intersection Observer API
- The app is capable of fetching both previous and next year's movies
- The app uses the concept of props to communicate between the Header and the MovieList component
- The app is responsive in terms of styling (written completely in native CSS in separate modules)
- Throttling and debouncing are enabled to avoid expensive network calls

## Things not covered:

- The app is built using React and not React Native
- The app does not have individual movie pages as most of the information are displayed on to the cards

## Additional points to note:

- A CSS pre-processor could have been used but more preferences are given to the logic building section than styling
- Some of the properties like cast and director are not displayed on the cards as they are not directly available in the API response
- No global state management flow like Redux has been used as the requirements are fairly straightforward and the the require use case
  does not require a complex state management flow
- Since there are only two major components - Header and MovieList, only the concept of props and states have been used for data flow. For a slightly more nested application, we could go with Context API or Redux
- The API used fetches movies by year and not all movies at once thereby reducing unnecessary network calls
