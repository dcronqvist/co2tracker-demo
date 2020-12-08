import './App.css';
import Submit from './components/Submit.js'
import TreeView from './components/TreeView.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import axios from 'axios';


const appStyle = {
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  backgroundColor: '#DFE2EB',
  fontFamily: "'Roboto', 'sans-serif'",
}

const headerStyle = {
  width: '100%',
  height: '10vh',
  backgroundColor: '#14121F',
  display: 'grid',
  placeItems: 'center',
}

const title = {
  fontSize: '30pt',
  color: 'white',
  fontWeight: '300',
}

const button = {
  borderRadius: '12px',
  width: '8rem',
  height: '2.5rem',
  backgroundColor: 'white',
  color: 'black',
  display: 'grid',
  placeItems: 'center',
  boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.20)',
}

const subHeader = {
  display: 'grid',
  margin: '25px',
  justifyContent: 'center',
  placeItems: 'center',
  gridTemplateColumns: '150px 150px',
}

function App() {
  return (
    <div style={appStyle}>
      <header style={headerStyle}>
        <div style={title}>Co2-Tracker Demonstration</div>
      </header>
      <Router>
        <div style={subHeader}>
          <div style={button}>
            <Link to="/submit" style={{ textDecoration: 'none' }}>
            <div style={button}>
              Submit
            </div>
            </Link>
          </div>
          <div style={button}>
            <Link to="/supplychain" style={{ textDecoration: 'none' }}>
            <div style={button}>
              Supply Chain
            </div>
            </Link>
          </div>
        </div>

        <Route path="/supplychain">
          <TreeView/>
        </Route>
        <Route path="/submit">
          <Submit/>
        </Route>
      </Router>
    </div>
  )
}

export default App
