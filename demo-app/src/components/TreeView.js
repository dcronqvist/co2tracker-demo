import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css';
import axios from 'axios';

const instance = axios.create({
  method: 'post',
  baseURL: 'https://co2.dcronqvist.se/',
  timeout: 1000,
  headers: {'Content-Type': 'application/json'}
});





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

let searchproduct = "accumulator";
let products = {
  0: searchproduct
};
let parents = {
  0: null
};

function searchAndAdd(productName) {

  console.log(productName);
  axios.post('https://co2.dcronqvist.se/benchmarks/get/latest', {
    "product": productName
  })
  .then(function (response) {
    for (const i in response.data.response.sub_products) {
      for(const property in response.data.response.sub_products[i]){
        if (property == "product") {
          var foundProduct = response.data.response.sub_products[i][property];
          products[Object.keys(products).length] = foundProduct;
          parents[Object.keys(parents).length] = productName;
          searchAndAdd(foundProduct);
        };
    }}
  })
  .catch(function (error) {
    console.log(`ERROR FROM ${productName}`);
  });
}

let data = {
  name: 'Source (0.5kg)',
  children: [{ name: 'Alex',
               children: [{ name: 'Samuel'}]}, {
               name: 'Carl'}, {
               name: 'Daniel',
               children: [{ name: 'Benjamin',
                            children: [{ name: 'Saga'}]
      }]
  }]
};
function activateLasers() {
 
  searchAndAdd(searchproduct);
  console.log(products);
  console.log(parents);
  let searchTree = generateTree(searchproduct);
  console.log(data);
  console.log(searchTree);

  /*
  axios.post('https://co2.dcronqvist.se/benchmarks/get/latest', {
    "product": "plastic-bar"
  })
  .then(function (response) {
    console.log(response.data.response);
  })
  .catch(function (error) {
    console.log(error);
  });

*/
    // searchAndAdd(searchproduct);


    /*
    console.log(Object.keys(products).length)
    axios.post('https://co2.dcronqvist.se/benchmarks/get/latest', {
      "product": searchproduct
    })
    .then(function (response) {
      //response.data.response.sub_products.forEach(console.log(this))
      for (const i in response.data.response.sub_products) {
        for(const property in response.data.response.sub_products[i]){
          if (property == "product") {
            products[Object.keys(products).length] = response.data.response.sub_products[i][property];
            parents[Object.keys(parents).length] = searchproduct;
          };
          console.log(`${property}: ${response.data.response.sub_products[i][property]}`);
      }
      }
      console.log(response);
      console.log(response.data.response.sub_products);
      console.log(response.data.response.kg_per_unit);
      console.log(products);
      console.log(parents);
    })
    .catch(function (error) {
      console.log(error);
    });
    */
  }


function generateTree(source){  
  let node = {name: source, children: []};
  for(const i in parents){
    if(parents[i] == source){
      node.children.push(generateTree(products[i]));
    }
  }
  return node;
}

/*

*/

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
      <button onClick={activateLasers}>
        Activate Lasers
      </button>
      <Tree
          data={data}
          height={800}
          width={document.documentElement.clientWidth}
          nodeOffset={10}
          nodeRadius={10}
          nodeShape="rect"
          nodeProps={{ rx: 2}}
          gProps={{
            onClick: onClick,
            onContextMenu: onRightClick
          }}
          svgProps={{
            className: 'custom',
          }}
          animated/>
    </div>
  )
}
