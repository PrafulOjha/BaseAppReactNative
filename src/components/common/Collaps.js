/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { PureComponent } from 'react';
import { View, TouchableOpacity} from 'react-native';
import { Icon } from 'native-base';
import { Text } from '../common';
export default class Collapse extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            show: this.props.isCollapsed,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            //show: nextProps.isCollapsed
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.show != nextState.show) {
            return true;
        }

        if (typeof this.props.isChecked != 'undefined' && this.props.isChecked === nextProps.isChecked) {
            return false
        }
        return true;
    }

    __toggle() {

        this.setState({
            show: !this.state.show
        }, () => {
            if (this.state.show == true && this.props.isFetchPartList && this.props.isFetchPartList == true && this.props.fetchPartList) {
                this.props.fetchPartList()
            }
        });

        if (this.props.onClickCollaps) {
            this.props.onClickCollaps(this.props.collapsIndex);
        }


    }

    render() {
        const handleLongPressCallback = this.props.handleLongPress;
        return (
            <View style={inlineStyle.collapse}  {...this.props}>
                <TouchableOpacity onPress={() => this.__toggle()} onLongPress={handleLongPressCallback}>
                    <View style={inlineStyle.collapseHeader}>
                        <Text style={inlineStyle.collapseHeaderText}>{this.props.title}</Text>
                        <Icon name={this.state.show ? 'ios-remove' : 'ios-add'} style={inlineStyle.collapseHeaderIcon} />
                    </View>
                </TouchableOpacity>
                <View style={inlineStyle.collapseBody}>
                    {this.props.diplayContent && this.props.diplayContent()}
                    {this.state.show &&
                        this.props.children}
                </View>
            </View>
        );

    }
}
const inlineStyle = {
    collapse: {
        overflow: 'hidden',
        marginBottom: 15
    },
    collapseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight:40,
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingLeft:0,
        paddingRight: 5
    },
    collapseHeaderText: {
        flex: 1,
        fontSize: 16,
        color: '#2C3138',        
    },
    collapseHeaderIcon: {
        color: '#87939F',
        fontSize:20,
        fontWeight:900
    },   
    collapseFooter: {
        backgroundColor: '#e8ebee',
        padding: 15,
        minHeight: 50
    }
}