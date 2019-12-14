import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Landing.css'

export default class Landing extends Component {
  render() {
    return (
      <>
        <section>
          <img className="splash" src="/Completed 2.jpg"></img>
          <Link to="/register" className="menu">Register</Link>
          <Link to="/login" className="menu">Login</Link>
          <Link className="menu" to="/upload">Demo</Link>
          <ul className="intro">
            <li>
              Take a picture of the cells you want to count.
            </li>
            <li>
              Mark the image with square boxes containing an individual cell.
            </li>
            <li>
              Click on your cell in the toolbox to change its position or delete it.
            </li>
            <li>
              When you are done, click Finished to save and upload the data to your collection of experiments.
            </li>
          </ul>

        </section>
      </>
    )
  }
}
