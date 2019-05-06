import React from 'react';

function QuicklistButton(props) {
  return (
    <div>
      <button className="bg-black p-2 text-white uppercase font-thin text-xs rounded">
        {`Quick List: ${props.quicklist.length}`}
      </button>
    </div>
  )

}

export default QuicklistButton;