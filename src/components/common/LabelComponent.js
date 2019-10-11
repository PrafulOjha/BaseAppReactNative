import React from 'react';
import { StyleSheet } from 'react-native';
import { Label} from 'native-base';
import { Text } from '../common';
const LabelComponent = ({ label, mandatory }) => {
  if (mandatory == undefined || mandatory == false) {
    return (
      <Label style={innerStyles.labelStyle}>{label}</Label>
    );
  } else {
    return (
      <Label style={innerStyles.labelStyle}>{label}<Text style={{ color: 'red' }}> *</Text></Label>
    );
  }
};

const innerStyles = StyleSheet.create({
  labelStyle: {
    color: '#87939F',
    fontSize: 14,
    marginLeft: 0,
    fontFamily: fontRegular,
    paddingBottom: 0,
    marginBottom: 0
  },
});
export { LabelComponent };

