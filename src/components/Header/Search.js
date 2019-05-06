import React from 'react';

function Search(props) {
  return (
    <input 
      className="p-4 rounded-full bg-white w-full"
      placeholder="search by movie title, cast member name, or keyword"
      type="text"
      value={props.searchInput}
      onChange={(e) => props.onSearchInputChange(e.target.value)}
    />
  )
}

export default Search;