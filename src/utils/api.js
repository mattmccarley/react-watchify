const API_KEY = "1d332297db144df89557e1d191ef8368";

export function getPopularMovies() {
  return fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.message) {
        throw new Error(res.message);
      }

      return res;
    });
}

export function getMovieReleases(movieId) {
  return fetch(`https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.message) {
        throw new Error(res.message);
      }

      return res;
    });
}

export function getMovieDetails(movieId) {
  return fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.message) {
        throw new Error(res.message);
      }

      return res;
    });
}

export function getMovieVideos(movieId) {
  return fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.message) {
        throw new Error(res.message);
      }

      return res;
    });
}

export function getMovieRecommendations(movieId) {
  return fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.message) {
        throw new Error(res.message);
      }

      return res;
    });
}

export function searchMovies(searchText) {
  return fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchText}&page=1&include_adult=false`)
  .then((res) => res.json())
  .then((res) => {
    if (res.message) {
      throw new Error(res.message);
    }

    return res;
  });
}