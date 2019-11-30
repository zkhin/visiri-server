import React, { Component } from 'react'

export default class UploadForm extends Component {

  // componentDidMount() {
  //   const realInput = document.getElementById('imageLoader')
  //   const fakeLoader = document.getElementById('fakeloader')
  //   fakeLoader.addEventListener('click', (e) => {
  //     e.preventDefault()
  //     e.stopPropagation()
  //     realInput.click()
  //   }, false)
  // }
  render() {

    return (
      <div className="fileinputs">
          {/* <label htmlFor="imageLoader">{this.state.uploaded? `Choose another file`: `Image File:`}</label> <br /> */}
        <input className="file" type="file" id="imageLoader" name="imageLoader" onChange={this.props.handleChange} />
        <div className="fakefile">
          <input />
          <span className="menu">Upload File</span>
        </div>
      </div>

    )
  }
}
