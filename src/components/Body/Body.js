import React from 'react';

function Body(props) {
  return (
    <div className="w-2/3 min-h-screen pt-24">
      {props.children}
    </div>
  )
}

export default Body;