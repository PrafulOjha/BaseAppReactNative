import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, View, StyleSheet } from 'react-native';
import { Text } from '../common';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = '100%';

export default class Loader extends Component {

	constructor(props) {
		super(props);
		this.state = {
			height: this.props.height || deviceHeight,
			width: this.props.width || deviceWidth,
			isLoading: false
		};
	}

	/**
    * @method autoOffLoader
    * @description after the 2 min loader will stop automatically
    */
	autoOffLoader = () => {
		if (this.state.isLoading === true) {
			console.log("autoOffLoader done");
			this.setState({
				isLoading: false
			})
		}
	}

	/**
    * @method componentWillReceiveProps
    * @description to set the loader value in state by props
    */
	componentWillReceiveProps(nextProps) {
		console.log('autoOffLoader nextProps ', nextProps.isLoading);
		if (this.state.isLoading != nextProps.isLoading) {
			if (nextProps.isLoading == true) {
				this.setState({
					isLoading: true
				}, () => {
					setTimeout(() => {
						console.log("autoOffLoader settime");
						this.autoOffLoader();
					}, 120000)
				})
			} else {
				this.setState({
					isLoading: false
				});
			}
		}
	}

	/**
    * @method render
    * @description to render the loader
    */
	render() {
		console.log('loader render', this.state.isLoading);
		return (
			this.state.isLoading === true &&
			(<View
				style={innerStyles.loader}
			>
				<ActivityIndicator size='large' color='#FFF' />
				<Text style={innerStyles.whiteColor}> Loading...</Text>
			</View>)
		);
	}
}

const innerStyles = StyleSheet.create({
	loader: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 9999,
		justifyContent: 'center',
		alignItems: 'center',
		width: deviceWidth,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,.8)',
		height: deviceHeight
	},
	whiteColor: {
		color: '#FFF'
	}
});
