import React from 'react';

import MovieResult from './MovieResult';

function MovieSearchResults(props) {
  return (
    <>
      <h2>Movies</h2>
      <div className="flex flex-wrap">
        {props.movieSearchResults.map(movie => {
          return (
            <MovieResult
              id={movie.id}
              posterPath={movie.poster_path}
            />
          )
        })}
      </div>
    </>
  )
}

export default MovieSearchResults;