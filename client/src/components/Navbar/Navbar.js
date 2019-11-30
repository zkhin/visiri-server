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
      <div className='Header__logged-in'>
        <Link
          onClick={this.handleLogoutClick}
          to='/'>
          Logout
        </Link>
      </div>
    )
  }

  renderLoginLink() {
    return (
      <div className='Header__not-logged-in'>
        <Link
          to='/login'>
          Log in
        </Link>
        <Link
          to='/register'>
          Register
        </Link>
      </div>
    )
  }

  render() {
    return (
      <div>
        <nav className="nav">
          <h1>
              visiri
          </h1>
          {/* {TokenService.hasAuthToken()
            ? this.renderLogoutLink()
            : this.renderLoginLink()
          } */}
        </nav>
      </div>
    )
  }
}
