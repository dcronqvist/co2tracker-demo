import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'

// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

postData('https://co2.dcronqvist.se/get', { "_id": ["accumulator"] })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });



let data = {
  name: 'Source',
  children: [{
      name: 'Alex',
      children: [{
          name: 'Samuel'
      }]
  }, {
      name: 'Carl'
  }, {
      name: 'Daniel',
      children: [{
          name: 'Benjamin',
          children: [{
              name: 'Saga'
          }]
      }]
  }]
};

function onClick(event, nodeKey) {
  alert(`Left clicked ${nodeKey}`);
}

function onRightClick(event, nodeKey) {
  event.preventDefault();
  alert(`Right clicked ${nodeKey}`);
}


export default function TreeView() {
  return(
    <div className="custom-container">
      <Tree
          data={data}
          height={800}
          width={document.documentElement.clientWidth}
          nodeShape="rect"
          nodeProps={{ rx: 2}}
          gProps={{
            onClick: onClick,
            onContextMenu: onRightClick
          }}
          svgProps={{
            className: 'custom'
          }}
          animated/>
    </div>
  )
}
