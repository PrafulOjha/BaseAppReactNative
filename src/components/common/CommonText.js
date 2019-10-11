import React from 'react';
import { Text } from 'react-native';
export default props => <Text {...props} style={[{fontFamily: 'TitilliumWeb-Regular'}, props.style]}>{props.children}</Text>