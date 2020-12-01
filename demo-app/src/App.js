import './App.css';
import Submit from './components/Submit.js'
import TreeView from './components/TreeView.js'

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

function App() {
  return (
    <div style={appStyle}>
      <header style={headerStyle}>
        <div style={title}>Co2 Tracker Demonstration</div>
      </header>
      <Submit/>
      <TreeView/>
    </div>
  )
}

export default App
