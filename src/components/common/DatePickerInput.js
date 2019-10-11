import React from 'react';
import { View } from 'native-base';
import { StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { LabelComponent } from './LabelComponent';
import { CustomIcon } from '../../utils/CustomIcon';

const DatePickerInput = ({ date = '', disabled, mode, placeholder, format, label, mandatory, minDate, maxDate, onDateChange, value, isSubmitted = false, isDisabled = false }) => {

  return (
    <View
      error={(value == '' && isSubmitted == true)}
      success={(!(value == '') && isSubmitted == true)} style={innerStyles.itemWarpper}
    >
      <LabelComponent label={label} mandatory={mandatory} />
      <View style={innerStyles.inputStyle}>
        <DatePicker
          date={date}
          mode={mode}
          showIcon={false}
          disabled={disabled}
          placeholder={placeholder}
          format={format}
          minDate={minDate}
          maxDate={maxDate}
          confirmBtnText="OK"
          cancelBtnText="CANCEL"
          onDateChange={onDateChange}
          style={{ position: 'absolute', width: '100%', zIndex: 3 }}
          customStyles={{
            dateInput: {
              borderWidth: 0, borderBottomWidth: 0, alignItems: 'flex-start', marginRight: 0,
            },
            disabled: {
              backgroundColor: '#fff',
            },
            placeholderText: { color: 'rgba(135,147,159,0.6)', fontSize: 14, fontFamily: fontRegular, paddingLeft: 0 },
            dateText: { fontSize: 14, fontFamily: fontRegular, paddingLeft: 2 },
            btnTextConfirm: {
              color: '#FFC30D'
            },

          }}
        />
        <CustomIcon style={innerStyles.calIcon} name='calendar' />
      </View>
    </View>
  );
};

const innerStyles = StyleSheet.create({
  itemWarpper: {
    marginLeft: 0,
    marginBottom: 5
  },
  innerWrapper: {
    flexDirection: 'column'
  },
  inputStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 34,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#738A9D',
    position: 'relative',
    marginBottom: 15
  },
  calIcon: {
    color: '#919ba7',
    fontSize: 17
  }
});

export default DatePickerInput;
