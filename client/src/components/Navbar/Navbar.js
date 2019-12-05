import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import TokenService from '../../services/token-service'
import './Navbar.css'

export default class Navbar extends Component {
  handleLogoutClick = () => {
		TokenService.clearAuthToken()
  }

  renderLogoutLink() {
    return (
        <Link className='authmenu top'
          onClick={this.handleLogoutClick}
          to='/'>
          Logout
        </Link>
    )
  }

  renderLoginLink() {
    return (
      <div>
        <Link className='authmenu top'
          to='/login'>
          Log in
        </Link>
        <Link className='authmenu bottom'
          to='/register'>
          Register
        </Link>
      </div>
    )
  }

  render() {
    return (
      <div className="container">
        <nav className="nav">
          <h1>
            <Link className="logo" to={
              TokenService.hasAuthToken() ? "/experiments" : "/register"}
            >
              visiri
            </Link>
          </h1>
          {TokenService.hasAuthToken()
            ? this.renderLogoutLink()
            : this.renderLoginLink()
          }
        </nav>
      </div>
    )
  }
}
