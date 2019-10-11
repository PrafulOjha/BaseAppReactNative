import { Input as InputText, Item } from 'native-base';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { LabelComponent } from './LabelComponent';
import { CustomIcon } from '../../utils/CustomIcon';
import { Text } from '../common';

export default class InputBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: null
        };
    }

    render() {
        const { children, mandatory, isDisabled = false, label, value, onChangeText, placeholder, secureTextEntry = false, isSubmitted = false, keyboardType = 'default', maxLength = 150, onSubmitEditing, onEndEditing, selection, iconName, IconSize } = this.props;
        let customWords = '';
        if (keyboardType === 'default') {
            customWords = 'sentences';
        } else if (keyboardType == 'email-address') {
            customWords = 'none';
        }

        let inputBoxStyle = innerStyles.textStyle;
        if (isDisabled != undefined && isDisabled == true) {
            inputBoxStyle = [innerStyles.textStyle, { backgroundColor: '#efefef', paddingLeft: 0 }];
        }
        return (
            <View stackedLabel style={[innerStyles.itemWarpper]}>
                <LabelComponent label={label} mandatory={mandatory} />
                <Item style={innerStyles.inputWarpper}>
                    <InputText
                        style={inputBoxStyle}
                        secureTextEntry={secureTextEntry}
                        placeholder={placeholder}
                        placeholderTextColor='rgba(135,147,159,0.6)'
                        autoCorrect={false}
                        value={value}
                        keyboardType={keyboardType}
                        onChangeText={onChangeText}
                        maxLength={maxLength}
                        disabled={isDisabled}
                        autoCapitalize={customWords}
                        onSubmitEditing={onSubmitEditing}
                        onEndEditing={onEndEditing}
                        underlineColorAndroid='transparent'
                    />
                    <CustomIcon style={[innerStyles.inputIcon, { fontSize: IconSize }]} name={iconName} />
                    {children}

                </Item>
                {
                    this.props.isFieldInError &&
                    <Text
                        style={{
                            fontSize: 13,
                            color: 'red',
                            marginTop: 5,
                            fontFamily: fontSemiBold,
                        }}
                    >
                        {this.props.fieldErrorMessage}
                    </Text>
                }
            </View>
        );
    }
}

const innerStyles = StyleSheet.create({
    itemWarpper: {
        marginLeft: 0,
        marginBottom: 15
    },
    textStyle: {
        fontSize: 15,
        color: '#040605',
        fontFamily: fontRegular,
        marginBottom: 0,
        textAlignVertical: 'top',
        paddingLeft: 0,
    },
    inputWarpper: {
        flexDirection: 'row',
        borderBottomColor: '#738A9D',
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 0,
        paddingBottom: 2,
        paddingRight: 0,
        paddingLeft: 0,
        paddingTop: 10,
        marginLeft: 0
    },
    inputIcon: {
        color: '#87939F',
        marginTop: -5
    },
});
