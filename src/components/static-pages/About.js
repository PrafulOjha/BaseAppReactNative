import React, { PureComponent } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Container, Content } from 'native-base';
import { connect } from 'react-redux';
import styles from '../../assets/styles';
import { HeaderComponent, Loader } from '../common';


class About extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            showToast: false,
            visible: false
        };
    }

    /**
     * @method handleToastButton
     * @description Example for toast
     */
    handleToastButton = () => {
        this.setState({
            visible: true
        });
    }

    /**
     * @method render
     * @description Renders the component
     */
    render() {
        const { firstName, lastName } = this.props.userData;
        return (
            <Container>
                {this.props.loading && (
                    <Loader />
                )
                }
                <HeaderComponent
                    title='About'
                    leftButton='customBack'
                    routeName='Home'
                />
                <Content>
                    <View style={styles.container}>
                        <View style={innerStyle.chartWrap}>
                            <Text style={styles.text}>Welcome {`${firstName} ${lastName}`} </Text>
                            <Text style={styles.text}>This page is coming soon...</Text>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
const innerStyle = StyleSheet.create({
    textWrap: {
        padding: 10,
    },
    chartWrap: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        margin: 10
    }
});

/**
* @method mapStateToProps
* @description return state to component as props
* @param {*} state
*/
function mapStateToProps({ auth }) {
    const { userData, loading } = auth;
    return {
        userData, loading
    };
}


/**
 * @method connect
 * @description connect with redux
* @param {function} mapStateToProps
* @param {function} mapDispatchToProps
                        */
export default connect(
    mapStateToProps, null
)(About);

