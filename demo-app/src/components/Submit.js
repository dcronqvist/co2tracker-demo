import React, {useState} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';

const inputContainer = {
  margin: 'auto',
}

const inputStyle = {
  borderRadius: '12px',
  width: '24rem',
  height: '2.5rem',
  backgroundColor: 'white',
  color: 'black',
  placeItems: 'center',
  boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.20)',
  margin: '.5rem',
}

const formStyle = {
  display: 'grid',
}

const button = {
  cursor: 'pointer',
  marginTop: '50px',
  borderRadius: '12px',
  width: '14rem',
  height: '3.5rem',
  backgroundColor: 'white',
  color: 'black',
  display: 'grid',
  placeItems: 'center',
  boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.20)',
}

const multiSelectStyle = {
  justifyContent: 'center',
  margin: '.5rem',
  display: 'grid',

}

const selectStyleContainer = {
  width: '24rem',
}

const footer = {
  height: '250px',
}

export default function Submit() {

  const [prodId, setProdId] = useState("")
  const [prodName, setProdName] = useState("")
  const [prodTags, setProdTags] = useState([])
  const [prodWeight, setProdWeight] = useState("")
  const [prodTypeDesc, setTypeDesc] = useState("")
  const [prodSelfImpact, setSelfImpact] = useState("")
  const [prodImpactError, setImpactError] = useState("")
  const [prodEnergySources, setEnergySources] = useState([])
  const [subProds, setSubProds] = useState([])
  const [nSubs, setNSubs] = useState([])

  function addEle(e) {
    setNSubs(Array.from({length: e.value}, (_, i) => i + 1))
  }

  const changeHandler = e => {
    setTypeDesc(e.value)
  }

  const options = [
    { value: 'assembly', label: 'Assembly' },
    { value: 'refinement', label: 'Refinement' },
    { value: 'production', label: 'Production' },
    { value: 'extraction', label: 'Extraction' },
  ]

  const tags = [
    { value: 'electronicDevice', label: 'Electronic Device' },
    { value: 'electronicComponent', label: 'Electronic Component' },
    { value: 'material', label: 'Material' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'extraction', label: 'Food'}
  ]

  const energySources = [
    { value: 'fossilFuel', label: 'Fossil fuels' },
    { value: 'genElec', label: 'Electricity' },
    { value: 'nonFFElec', label: 'Non fossil fuel generated electricity' },
    { value: 'bioGas', label: 'Bio Gas' }
  ]
  const numList = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' }
    ]

  const animatedComponents = makeAnimated();

  function postData() {

    let payload = {
      "_id": prodId,
      "type": "product",
      "tags": prodTags.map(o => o["value"]),
      "type_description": prodTypeDesc,
      "prod_name": prodName,
      "kg_per_unit": parseFloat(prodWeight),
      "unit" : "kg",
      "benchmark": {
          "self_impact": {
              "co2": parseFloat(prodSelfImpact),
              "measurement_error": parseFloat(prodImpactError),
              "energy_sources": prodEnergySources.map(o => o["value"])
          },
          "date": new Date().getTime().toString(),
          "sub_products": []
      }
    }

    const payloadSubProduct = {
      "product": ["str"],
      "unit_amount": ["float", "int"],
      "transport": ["int", "str"]
    }

    for (let i = 0; i < subProds.length; i += 3){
      let tempPLSP = {...payloadSubProduct}
      tempPLSP["product"] = subProds[i]
      tempPLSP["unit_amount"] = parseFloat(subProds[i + 1])
      tempPLSP["transport"] = parseInt(subProds[i + 2])
      payload["benchmark"]["sub_products"].push(tempPLSP)
    }
    console.log(payload)

    axios.post('https://co2.dcronqvist.se/products/create', payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) =>
      console.log(response)
    )
    .catch((error) =>
      console.log(error.response)
    )
  }

  return(
    <div>
      <center><h1>Update Supply Chain</h1></center>
      <center><h2>Product</h2></center>
      <form style={formStyle}>
        <div style={inputContainer}>
          <input
            onChange={(e) => setProdId(e.target.value)}
            style={inputStyle}
            type="text"
            placeholder="Internal Product ID"/>
        </div>
        <div style={inputContainer}>
          <input
            onChange={(e) => setProdName(e.target.value)}
            style={inputStyle}
            type="text"
            placeholder="Product Name"/>
        </div>
        <div style={multiSelectStyle}>
          <div style={selectStyleContainer}>
            <CreatableSelect
              placeholder="Select product tags"
              components={animatedComponents}
              onChange={(e) => console.log(e)}
              isMulti={true}
              options={tags}
            />
          </div>
        </div>
        <div style={inputContainer}>
          <input
            onChange={(e) => setProdWeight(e.target.value)}
            style={inputStyle}
            type="text"
            placeholder="Product Wight per Unit (kg)"/>
        </div>
        <div style={multiSelectStyle}>
          <div style={selectStyleContainer}>
            <Select
              placeholder="Select update type"
              onChange={(e) => setTypeDesc(e.value)}
              options={options}/>
          </div>
        </div>
        <div style={inputContainer}>
          <input
            onChange={(e) => setSelfImpact(e.target.value)}
            style={inputStyle}
            type="text"
            placeholder="Co2 Self Impact per Unit (kg)"/>
        </div>
        <div style={inputContainer}>
          <input
            onChange={(e) => setImpactError(e.target.value)}
            style={inputStyle}
            type="text"
            placeholder="Measurement Error | ex 0.05"/>
        </div>
        <div style={multiSelectStyle}>
          <div style={selectStyleContainer}>
            <CreatableSelect
              placeholder="Select energy sources"
              components={animatedComponents}
              onChange={(e) => setEnergySources(e)}
              isMulti={true}
              options={energySources}
            />
          </div>
        </div>
        <center><h2>Sub Products</h2></center>

        <div style={multiSelectStyle}>
          <div style={selectStyleContainer}>
            <CreatableSelect
              placeholder="Select the number of sub products"
              onChange={(e) => addEle(e)}
              options={numList}/>
          </div>
        </div>
        {nSubs.map((item) => (
          <SubProductForm
            subProds={subProds}
            setSubProds={setSubProds}
            key={item}
            data={item}/>
        ))}
        <div style={inputContainer}>
          <div onClick={postData} style={button}>
            Update Supply Chain
          </div>
        </div>
      </form>
      <div style={footer}>
      </div>
    </div>
  )
}

function SubProductForm(props) {

  function fixShit(selector, event){
    const copy = [...props.subProds]
    copy[(props.data - 1) * 3 + selector] = event.target.value
    props.setSubProds(copy)
  }

  return (
    <div style={formStyle}>
      <center><h2>Sub Product {props.data}</h2></center>
      <div style={inputContainer}>
        <input
          onChange={(e) => fixShit(0, e)}
          style={inputStyle}
          type="text"
          placeholder="Internal Product ID"/>
      </div>
      <div style={inputContainer}>
        <input
          onChange={(e) => fixShit(1, e)}
          style={inputStyle}
          type="text"
          placeholder="Unit amount"/>
      </div>
      <div style={inputContainer}>
        <input
          onChange={(e) => fixShit(2, e)}
          style={inputStyle}
          type="text"
          placeholder="Product Transport ID"/>
      </div>
    </div>

  )
}
