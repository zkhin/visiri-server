import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import Navbar from '../Navbar/Navbar'
import LandingPage from '../../routes/LandingPage'

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
        </Switch>
      </div>
    )
  }
}

export default App