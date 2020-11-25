import tmdb from 'themoviedb-javascript-library';

tmdb.common.api_key = "1d332297db144df89557e1d191ef8368";

export const getPopularMovies = tmdb.movies.getPopular;
export const getMovieReleases = tmdb.movies.getReleases;
export const getMovieDetails = tmdb.movies.getById;