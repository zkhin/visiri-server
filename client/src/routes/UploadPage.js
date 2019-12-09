import React, { Component } from 'react'
import Upload from '../components/Upload/Upload'

export default class UploadPage extends Component {
  static defaultProps = {
    history: {
      push: () => { },
    },
  }
	onFinish = () => {
		this.props.history.push('/experiments')
	}
  render() {

    return (
      <div>
        <Upload onFinish={this.onFinish}/>
      </div>
    )
  }
}
