import React, {useState} from 'react'
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

async function searchAndAdd(productName, amount) {
  let obj = {
    name: productName,
    children: []
  }

  await axios.post('https://co2.dcronqvist.se/benchmarks/get/latest', {
    "product": productName
  })
  .then(async function (response) {
    obj.name = amount + " units \n" + obj.name + ": " + response.data.response.chain_impact.co2
    let subs = response.data.response.sub_products;

    for(const sub in subs){
      let s = subs[sub]
      let sub_children = await searchAndAdd(s.product, s.unit_amount)

      obj.children.push(sub_children)
    }
  })
  .catch(function (error) {
    console.log(`ERROR FROM ${productName}`);
  });

  return obj
}

function onClick(event, nodeKey) {
  alert(`Left clicked ${nodeKey}`);
}

function onRightClick(event, nodeKey) {
  event.preventDefault();
  alert(`Right clicked ${nodeKey}`);
}

export default function TreeView() {

  const [treeData, setTreeData] = useState({})
  const [booli, setBooli] = useState(true)
  const [prod, setProduct] = useState("")

  async function activateLasers() {
    const prods = await searchAndAdd(prod, 1)
    setTreeData(prods)
    setBooli(true)
    console.log(treeData)
  }


  return(
    <div>
      <div className="input-container">
        <input type="text" onChange={(e) => setProduct(e.target.value)} placeholder="Product ID" onFocus={() => {
            setTreeData({})
            setBooli(false)
          }} onBlur={() => setBooli(true)}>

        </input>
        <button onClick={activateLasers}>
          Get Supply Chain
        </button>
      </div>
      <div className="custom-container">
        {booli ? <Tree
            data={treeData}
            height={730}
            width={1200}
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
            }}/> : null}
      </div>
    </div>
  )
}
