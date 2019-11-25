import React from 'react'
import './RegionsList.css'

export default class RegionsList extends React.Component {

	render(){
		return (
			<div className="regionslist">
					{this.props.regions.map(region => {
						return (
							<button key={region.id} className="cellbutton" style={{
								boxShadow: `0 0 5px ${region.color}`,
								border: `3px solid ${region.color}`
							}}>
								{region.id}
							</button>
						)
					})}
			</div>
		)
	}
}
