import React from 'react';

function MovieResult(props) {

  return (
    <div
      className="m-0 p-0 w-1/6 relative"
      key={props.id}
    >
      <div
        className="movie-result__hover-buttons-container absolute pin"
      >
        <button 
          className="bg-white p-2 rounded-sm absolute pin-l pin-b ml-2 mb-2 z-10"
        >
          +QL
        </button>
        <button
          className="bg-blue-light p-2 rounded-sm absolute pin-r pin-b mr-2 mb-2 z-10"
        >
          info
        </button>
        <div
          className="bg-grey-darkest absolute pin opacity-50"
        >
        </div>
      </div>
      <img
        className="h-full w-full m-0 p-0"
        alt=""
        src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${props.posterPath}`}
      />
    </div>
  )
}

export default MovieResult;