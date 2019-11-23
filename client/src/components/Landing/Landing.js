import React, { Component } from 'react'
import './Landing.css'

export default class Landing extends Component {
  render() {
    return (
      <>
        <h1>Visiri Landing Page</h1>
        <section>
          <ul>
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
          <a href="#">Continue</a>
        </section>
      </>
    )
  }
}
