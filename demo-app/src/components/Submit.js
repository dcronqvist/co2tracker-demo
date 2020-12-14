import React, {useState} from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [isAboutUpdate, setAboutUpdate] = useState(false)

  const [menuSources, setMenuSources] = useState([])

  function addEle(val) {
    setNSubs(Array.from({length: val}, (_, i) => i + 1))
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
    { value: 'Fossil fuels', label: 'Fossil fuels' },
    { value: 'Electricity', label: 'Electricity' },
    { value: 'Non fossil fuel generated electricity', label: 'Non fossil fuel generated electricity' },
    { value: 'Bio Gas', label: 'Bio Gas' }
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
    console.log(menuSources)
    console.log(prodEnergySources)
    console.log(prodId)

    let payloadCreate = {
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

    let payloadUpdate = {
      "product" : prodId,
      "kg_per_unit": parseFloat(prodWeight),
      "unit" : "kg",
      "self_impact": {
          "co2": parseFloat(prodSelfImpact),
          "measurement_error": parseFloat(prodImpactError),
          "energy_sources": prodEnergySources
      },
      "sub_products": []
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
      payloadCreate["benchmark"]["sub_products"].push(tempPLSP)
    }

    //yes this is dumb but im lazy
    for (let i = 0; i < subProds.length; i += 3){
      let tempPLSP = {...payloadSubProduct}
      tempPLSP["product"] = subProds[i]
      tempPLSP["unit_amount"] = parseFloat(subProds[i + 1])
      tempPLSP["transport"] = parseInt(subProds[i + 2])
      payloadUpdate["sub_products"].push(tempPLSP)
    }

    let createURL = 'https://co2.dcronqvist.se/products/create'
    let updateURL = 'https://co2.dcronqvist.se/benchmarks/create'

    console.log(payloadCreate)
    axios.post(isAboutUpdate ? updateURL : createURL, isAboutUpdate ? payloadUpdate : payloadCreate, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) =>
      notifySucess(response)
    )
    .catch((error) =>
      notifyFail(error)
    )
  }

  function notifySucess(res, input){
    if (input == null){
      input = "Wow so easy"
    }
    toast.success('🦄 ' + input, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function notifyFail(error, input){
    toast.error('🦄 ' + error + ' '+  input, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function notifyInfo(error, input){
    toast.info('🦄 ' + error + ' '+  input, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function prodIdAction(e){
    /*
    if(prodId == ""){
      setAboutUpdate(false)
      setProdId("")
      setProdName("")
      setProdTags([])
      setProdWeight("")
      setTypeDesc("")
      setSelfImpact("")
      setImpactError("")
      setEnergySources([])
      setSubProds([])
      setNSubs([])
      setMenuSources([])
      return
    }
    */
    axios.post('https://co2.dcronqvist.se/products/search/id', {"_id" : [prodId]}, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      // console.log(prodId.toUpperCase())
      notifySucess(response, 'Product already in system')
      axios.post('https://co2.dcronqvist.se/benchmarks/get/latest', {"product" : prodId}, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then((response) => {
        notifySucess(response, "Pulled product information from db")
        setAboutUpdate(true)
        console.log(response.data.response)
        setProdWeight(response.data.response.kg_per_unit)
        setSelfImpact(response.data.response.self_impact.co2)
        setEnergySources(response.data.response.self_impact.energy_sources)
        setImpactError(response.data.response.self_impact.measurement_error)
        addEle(response.data.response.sub_products.length)

        let copy = []

        for(let i = 0; i < response.data.response.sub_products.length; i++){
          copy.push(response.data.response.sub_products[i]['product'])
          copy.push(response.data.response.sub_products[i]['unit_amount'])
          copy.push(response.data.response.sub_products[i]['transport'])
        }
        setSubProds(copy)

        console.log(response.data.response.self_impact.energy_sources)
        let copyOfEnergy = [...response.data.response.self_impact.energy_sources]
        console.log(copyOfEnergy)

        copyOfEnergy = copyOfEnergy.map(o => (
          {
          'value' : o,
          'label' : o
          }
        ))
        console.log(copyOfEnergy)
        setMenuSources(copyOfEnergy)
        console.log(menuSources)
      })
      .catch((error) => {
        if(error.response){
          notifyFail(error.response.data.response, "test")
      } else {
        notifyInfo(error)
      }
      })
    })
    .catch((error) => {
      if(error.response){
        setAboutUpdate(false)
        notifyInfo(error.response.data.response, "This is a new item")
        setProdName("")
        setProdTags([])
        setProdWeight("")
        setTypeDesc("")
        setSelfImpact("")
        setImpactError("")
        setEnergySources([])
        setSubProds([])
        setNSubs([])
        setMenuSources([])
    } else notifyInfo(error)
    })
  }

  const aboutUpdateStyle = {
    display: isAboutUpdate ? 'none' : 'grid',
  }

  return(
    <div>
      <center><h1>Update Supply Chain</h1></center>
      <center><h2>Product</h2></center>
      <form style={formStyle}>
        <div style={inputContainer}>
          <input
            onBlur={(e) => prodIdAction(e)}
            onChange={(e) => {
              setProdId(e.target.value)
            }}
            style={inputStyle}
            type="text"
            placeholder="Internal Product ID"
            />
        </div>
        <div style={aboutUpdateStyle}>
          <div style={inputContainer}>
            <input
              onChange={(e) => setProdName(e.target.value)}
              style={inputStyle}
              type="text"
              placeholder="Product Name"
              value={prodName}/>
          </div>
          <div style={multiSelectStyle}>
            <div style={selectStyleContainer}>
              <CreatableSelect
                placeholder="Select product tags"
                components={animatedComponents}
                onChange={(e) => setProdTags(e)}
                isMulti={true}
                options={tags}
              />
            </div>
          </div>
          <div style={multiSelectStyle}>
            <div style={selectStyleContainer}>
              <Select
                placeholder="Select update type"
                onChange={(e) => setTypeDesc(e.value)}
                options={options}/>
            </div>
          </div>
        </div>
        <div style={inputContainer}>
          <input
            onChange={(e) => setProdWeight(e.target.value)}
            style={inputStyle}
            type="text"
            placeholder="Product Wight per Unit (kg)"
            value={prodWeight}/>
        </div>

        <div style={inputContainer}>
          <input
            onChange={(e) => setSelfImpact(e.target.value)}
            style={inputStyle}
            type="text"
            placeholder="Co2 Self Impact per Unit (kg)"
            value={prodSelfImpact}/>
        </div>
        <div style={inputContainer}>
          <input
            onChange={(e) => setImpactError(e.target.value)}
            style={inputStyle}
            type="text"
            placeholder="Measurement Error | ex 0.05"
            value={prodImpactError}/>
        </div>
        <div style={multiSelectStyle}>
          <div style={selectStyleContainer}>
            <CreatableSelect
              placeholder="Select energy sources"
              components={animatedComponents}
              onChange={(e) => {setEnergySources(e)
              }}
              isMulti={true}
              options={energySources}
              value={prodEnergySources}
            />
          </div>
        </div>
        <center><h2>Sub Products</h2></center>
        <div style={aboutUpdateStyle}>
          <div style={multiSelectStyle}>
            <div style={selectStyleContainer}>
              <CreatableSelect
                placeholder="Select the number of sub products"
                onChange={(e) => addEle(e.value)}
                options={numList}/>
            </div>
          </div>
        </div>
        {nSubs.map((item) => (
          <SubProductForm
            subProds={subProds}
            setSubProds={setSubProds}
            key={item}
            data={item}
          />
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
          placeholder="Internal Product ID"
          value={props.subProds[(props.data - 1) * 3]}/>
      </div>
      <div style={inputContainer}>
        <input
          onChange={(e) => fixShit(1, e)}
          style={inputStyle}
          type="text"
          placeholder="Unit amount"
          value={props.subProds[(props.data - 1) * 3 + 1]}/>
      </div>
      <div style={inputContainer}>
        <input
          onChange={(e) => fixShit(2, e)}
          style={inputStyle}
          type="text"
          placeholder="Product Transport ID"
          value={props.subProds[(props.data - 1) * 3 + 2]}/>
      </div>
    </div>

  )
}
