import React, { Component } from 'react'
import Experiments from '../components/Experiments/Experiments'
import MarkupContext from '../contexts/MarkupContext'

export default class ExperimentsPage extends Component {
  static contextType = MarkupContext
  static defaultProps = {
    history: {
      push: () => { },
    },
  }

  onCreateSuccess = () => {
    this.props.history.push('/upload')
  }
  render() {
    return (
      <div>
        <Experiments onCreateSuccess={this.onCreateSuccess}/>
      </div>
    )
  }
}
