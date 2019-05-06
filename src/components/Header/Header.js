import React from 'react';

function Header(props) {
  return (
    <div className="flex justify-between bg-yellow-dark fixed pin-t pin-l pin-r px-8 py-4 shadow items-center">
      {props.children}
    </div>
  )
}

export default Header;
