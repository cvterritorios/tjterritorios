import React from 'react'
import ReactDOM from 'react-dom/client'

//containers
import Bandeja from './containers/Bandeja'

//components
import NavBar from './components/NavBar'

//css
import './globalStyles.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NavBar/>
    <Bandeja/>
  </React.StrictMode>,
)
