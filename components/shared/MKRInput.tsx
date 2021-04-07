import { useState, forwardRef } from 'react';
import { Input, Text, Box, ThemeUIStyleObject } from 'theme-ui';

import Bignumber from 'bignumber.js';

type Props = {
  placeholder?: string;
  onChange: (value: Bignumber) => void;
  min?: Bignumber;
  max?: Bignumber;
  error?: string | false;
  style?: ThemeUIStyleObject;
};

const MKRInput = forwardRef<HTMLInputElement, Props>(
  ({ placeholder = '0.00', error, ...props }: Props, ref): JSX.Element => {
    const { onChange, min, max, style } = props;
    const [currentValueStr, setCurrentValueStr] = useState('');

    function updateValue(e: { currentTarget: { value: string } }) {
      const newValueStr = e.currentTarget.value;

      /* eslint-disable no-useless-escape */
      if (!/^((0|[1-9]\d*)(\.\d+)?)?$/.test(newValueStr)) return; // only non-negative valid numbers
      const newValue = new Bignumber(newValueStr || '0');
      const invalidValue = (min && newValue.lt(min)) || (max && newValue.gt(max));
      if (invalidValue) {
        return;
      }

      onChange(newValue);
      setCurrentValueStr(newValueStr);
    }

    return (
      <Box>
        <Input
          ref={ref}
          aria-label="mkr-input"
          type="number"
          onChange={updateValue}
          value={currentValueStr}
          placeholder={placeholder}
          sx={style}
        />
        {error && <Text sx={{ color: 'error', fontSize: 2 }}>{error}</Text>}
      </Box>
    );
  }
);

export default MKRInput;
