import React from 'react'
import './RegionsList.css'

export default class RegionsList extends React.Component {
	static defaultProps = {
		onClick: ()=>{}
	}

	render() {
		return (
			<div className="regionslist">
					{this.props.regions.map((region, i) => {
						return (
							<button
								key={region.id}
								onClick={this.props.onClick}
								className="cellbutton"
								style={{
								boxShadow: `0 0 5px ${region.color}`,
								border: `3px solid ${region.color}`
							}}>
								{i+1}
							</button>
						)
					})}
			</div>
		)
	}
}
