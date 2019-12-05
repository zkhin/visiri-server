import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import LandingPage from '../../routes/LandingPage'
import LoginPage from '../../routes/LoginPage'
import RegistrationPage from '../../routes/RegistrationPage'
import UploadPage from '../../routes/UploadPage'
import ExperimentsPage from '../../routes/ExperimentsPage'
import './App.css'

class App extends Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    console.error(error)
    return { hasError: true }
  }

  render() {

    return (
      <div className="App">
        {window.location.pathname === '/' ? null :
          <header className="App__header">
            <Navbar />
          </header>
        }

        <main className="App__main">
          <Switch>
            <Route exact path={'/'} component={LandingPage} />
            <Route exact path={'/register'} component={RegistrationPage} />
            <Route exact path={'/login'} component={LoginPage} />
            <Route exact path={'/experiments'} component={ExperimentsPage} />
            <Route exact path={'/upload'} component={UploadPage} />
          </Switch>
        </main>
      </div>
    )
  }
}

export default App