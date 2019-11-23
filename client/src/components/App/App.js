import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import Navbar from '../Navbar/Navbar'
import LandingPage from '../../routes/LandingPage'
import CreatePage from '../../routes/CreatePage'
import UploadPage from '../../routes/UploadPage'
import { MarkupContextProvider } from '../../contexts/MarkupContext'

class App extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    console.error(error)
    return { hasError: true }
  }

  render() {

    return (
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path={'/'} component={LandingPage} />
          <Route exact path={'/create'} component={CreatePage} />
          <Route exact path={'/upload'} component={UploadPage} />
        </Switch>
      </div>
    )
  }
}

export default App