import React, { Component } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Icon } from 'native-base';
import styles from '../../assets/styles';
import { Text } from '../common';

export default class CommonModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  closeModal = () => {
    this.props.hideModal();
  };
  render() {
    return (
      <Modal animationType={'fade'} transparent={true} visible={this.props.isVisiable} >
        <View style={styles.modal}>
          <View style={[styles.modalInnerBox, { height: 'auto' }]}>
            <View style={styles.modalHead}>
              <Text style={styles.optionLabel}>{this.props.heading}</Text>
              <TouchableOpacity style={styles.closeIcon} onPress={this.closeModal}>
                <Icon name="close" style={styles.closeIcn} />
              </TouchableOpacity>
            </View>
            <View style={styles.paddingTen}>
              {this.props.children}
            </View>
          </View>
        </View>
      </Modal>
    )
  }
};
