import React from 'react'
import './RegionsList.css'
import MarkupContext from '../../contexts/MarkupContext'
import ExperimentApiService from '../../services/experiment-api-service'

export default class RegionsList extends React.Component {
	static contextType = MarkupContext
	static defaultProps = {
		onClick: () => { },
		// regions: [],
		// experimentId: null,
	}

	state = {
		regions: this.props.regions,
		experimentId: this.props.experimentId,
		onClick: this.props.onClick,
		regionsLoaded: false,
		readFromProps: null,
		readFromState: null,
		readFromContext: null,
	}

	async componentDidMount() {
		if (!this.state.regions) {
			let regions = await this.fetchExperimentRegions(this.state.experimentId)
			console.log(regions)
			this.setState({
				regions: regions,
				readFromProps: false,
				readFromState: true,
				regionsLoaded: true,
			})
		} else if (this.state.regions){
			this.setState({
				readFromProps: true,
				readFromState: false,
				regionsLoaded: true,
			})
		}
	}

	async fetchExperimentRegions(experimentId) {
		try {
			return await ExperimentApiService.getExperimentRegions(experimentId)
		} catch (err) {
			this.setState({ error: err })
		}
	}

	renderCellButton(region, onClick, i) {
		return (
			<button
				key={i + 1}
				id={`button-${i+1}`}
				onClick={onClick}
				className="cellbutton tooltip"
				style={{
					boxShadow: `0 0 5px ${region.color}`,
					border: `3px solid ${region.color}`
				}}>
				{i+1}
				<span className="tooltiptext">x:{Math.ceil(region.point.x)} y:{Math.ceil(region.point.y)}</span>
			</button>
		)
	}

	render() {
		return (
			<div className="regionslist scrollbar">
				{
					this.state.regionsLoaded &&
					this.state.readFromProps &&
					this.props.regions.length > 0 &&
					 this.props.regions.map((region, i) => {
						 return this.renderCellButton(region, this.props.onClick, i)
						})
				}

				{
					this.state.regionsLoaded &&
					this.state.readFromState &&
					this.state.regions.length > 0 &&
					this.state.regions[0].regions.data.map((data, i) => {
						return this.renderCellButton(data, this.props.onClick, i)
					})
				}
			</div>
		)
	}
}
