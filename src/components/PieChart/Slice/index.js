import React, { forwardRef } from 'react';
import { Path } from 'react-native-svg';

export const Slice = forwardRef(
  ({ index, animValue, onSelect = () => { }, ...rest }, ref) => {
    return <Path ref={ref} onPress={() => onSelect(index)} {...rest} />;
  },
);
